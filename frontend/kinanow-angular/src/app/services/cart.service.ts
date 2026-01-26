import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface AddToCartRequest {
    productId: string;
    quantity: number;
    skuCode: string;
    price: number;
    imageUrl?: string;
    productName?: string;
    merchantId?: string | number;
}

export interface CartItem {
    id: number;
    productId: string | number;
    skuCode: string;
    quantity: number;
    price: number;
    imageUrl?: string;
    productName?: string;
    merchantId?: string | number;
}

export interface Cart {
    id: number;
    userId: number;
    items: CartItem[];
    total: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = '/api/v1/cart';

    private cartCountSubject = new BehaviorSubject<number>(0);
    cartCount$ = this.cartCountSubject.asObservable();

    constructor() {
        this.triggerRefresh();
    }

    triggerRefresh() {
        this.getCart().subscribe(cart => {
            const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            this.cartCountSubject.next(count);
        });
    }

    // Guest Cart Key
    private STORAGE_KEY = 'kinanow_guest_cart';

    addToCart(request: AddToCartRequest): Observable<any> {
        const userId = this.authService.currentUserId;

        if (userId) {
            const headers = new HttpHeaders().set('X-User-Id', userId.toString());
            return this.http.post(`${this.apiUrl}/items`, request, { headers }).pipe(
                tap(() => this.triggerRefresh()),
                catchError(() => this.addToLocalCart(request))
            );
        } else {
            return this.addToLocalCart(request).pipe(tap(() => this.triggerRefresh()));
        }
    }

    getCart(): Observable<Cart> {
        const userId = this.authService.currentUserId;

        if (userId) {
            const headers = new HttpHeaders().set('X-User-Id', userId.toString());
            return this.http.get<Cart>(`${this.apiUrl}`, { headers }).pipe(
                catchError(() => of(this.getLocalCart()))
            );
        } else {
            return of(this.getLocalCart());
        }
    }

    updateQuantity(itemId: string | number, quantity: number): Observable<any> {
        const userId = this.authService.currentUserId;
        if (userId) {
            const headers = new HttpHeaders().set('X-User-Id', userId.toString());
            // Backend PUT /items/{itemId}
            return this.http.put(`${this.apiUrl}/items/${itemId}?quantity=${quantity}`, {}, { headers }).pipe(
                tap(() => this.triggerRefresh()),
                catchError(() => {
                    const cart = this.getLocalCart();
                    // Clean lookup by unique Item ID
                    const item = cart.items.find(i => String(i.id) === String(itemId));

                    if (item) {
                        item.quantity = quantity;
                        this.recalculateTotal(cart);
                        this.saveLocalCart(cart);
                        this.triggerRefresh();
                    }
                    return of(cart);
                })
            );
        } else {
            const cart = this.getLocalCart();
            // Local lookup by Item ID
            const item = cart.items.find(i => String(i.id) === String(itemId));

            if (item) {
                item.quantity = quantity;
                this.recalculateTotal(cart);
                this.saveLocalCart(cart);
                this.triggerRefresh();
            }
            return of(cart);
        }
    }

    removeItem(itemId: string | number): Observable<any> {
        const userId = this.authService.currentUserId;
        if (userId) {
            const headers = new HttpHeaders().set('X-User-Id', userId.toString());
            return this.http.delete(`${this.apiUrl}/items/${itemId}`, { headers }).pipe(
                tap(() => this.triggerRefresh()),
                catchError(() => {
                    const cart = this.getLocalCart();
                    cart.items = cart.items.filter(i => String(i.id) !== String(itemId));
                    this.saveLocalCart(cart);
                    this.triggerRefresh();
                    return of(cart);
                })
            );
        } else {
            const cart = this.getLocalCart();
            cart.items = cart.items.filter(i => String(i.id) !== String(itemId));
            this.saveLocalCart(cart);
            this.triggerRefresh();
            return of(cart);
        }
    }

    clearCart(): Observable<any> {
        // Optimistic clear
        this.cartCountSubject.next(0);
        localStorage.removeItem(this.STORAGE_KEY);

        const userId = this.authService.currentUserId;
        if (userId) {
            // Check if backend has a dedicated clean endpoint or we just assume success because Order Service handles it via events.
            // But to be safe, we can try to empty it if an endpoint existed.
            // Assuming no bulk delete endpoint, we just reset local state which handles the visual "Cart Cleared".
            // Ideally, we'd call DELETE /api/v1/cart but we don't have that spec confirmation.
            // We will just return OF(true) and rely on the fact that an ORDER was placed.
            return of(true);
        }
        return of(true);
    }

    mergeGuestCart(): void {
        const localCart = this.getLocalCart();
        if (localCart.items.length === 0) return;

        const userId = this.authService.currentUserId;
        if (!userId) return;

        // Simply iterate and add each item to the backend cart
        // In a real prod app, use a bulk upload endpoint endpoint like POST /cart/merge
        localCart.items.forEach(item => {
            const req: AddToCartRequest = {
                productId: String(item.productId),
                quantity: item.quantity,
                skuCode: item.skuCode,
                price: item.price,
                imageUrl: item.imageUrl,
                productName: item.productName,
                merchantId: item.merchantId
            };
            this.addToCart(req).subscribe();
        });

        // Clear local cart after attempting merge
        localStorage.removeItem(this.STORAGE_KEY);
        this.triggerRefresh();
    }

    private addToLocalCart(req: AddToCartRequest): Observable<any> {
        const cart = this.getLocalCart();

        const existingItem = cart.items.find(i => i.skuCode === req.skuCode);
        if (existingItem) {
            existingItem.quantity += req.quantity;
        } else {
            cart.items.push({
                id: Math.floor(Math.random() * 10000),
                productId: req.productId,
                skuCode: req.skuCode,
                quantity: req.quantity,
                price: req.price,
                imageUrl: req.imageUrl,
                productName: req.productName
            });
        }

        this.saveLocalCart(cart);
        return of(cart);
    }

    private getLocalCart(): Cart {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            const cart: Cart = JSON.parse(stored);
            this.recalculateTotal(cart);
            return cart;
        }
        return { id: 0, userId: 0, items: [], total: 0 };
    }

    private saveLocalCart(cart: Cart) {
        this.recalculateTotal(cart);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
    }

    private recalculateTotal(cart: Cart) {
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // Round to 2 decimals
        cart.total = Math.round(cart.total * 100) / 100;
    }
}
