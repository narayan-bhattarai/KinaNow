import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, timer, switchMap, catchError, of, map, tap } from 'rxjs';
import { SnackbarService } from './snackbar.service';

export interface Product {
    id?: string;
    name: string;
    price: number;
    previousPrice?: number;
    description?: string;
    categoryId?: string;
    categoryName?: string;
    category?: string;
    imageUrl?: string;
    stock?: number;
    specifications?: any;
    merchantId?: string | number;
    type?: string;
    model?: string;
    occasion?: string;
}

export interface PriceHistory {
    id: string;
    productId: string;
    price: number;
    changedAt: string;
    occasion?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private http = inject(HttpClient);
    private snackbarService = inject(SnackbarService);
    private apiUrl = '/api/v1/products';

    // Reactive State: The source of truth for the whole app
    private productsSubject = new BehaviorSubject<Product[]>([]);
    public products$ = this.productsSubject.asObservable();

    constructor() {
        this.startLiveSync();
    }

    /**
     * Polling the real API every 3 seconds to ensure Admin & Customer views are always in sync.
     * This fulfils the requirement of "reflecting changes" without localstorage/seeding.
     */
    private startLiveSync() {
        timer(5000, 10000).pipe(
            switchMap(() => this.getPaginatedProducts(0, 50, null).pipe(
                catchError(() => of({ content: [] })) // Silent fail if backend down
            ))
        ).subscribe(data => {
            if (data && data.content) {
                // Only update if data actually changed to prevent UI flickers
                const current = JSON.stringify(this.productsSubject.value);
                const incoming = JSON.stringify(data.content);
                if (current !== incoming) {
                    this.productsSubject.next(data.content);
                }
            }
        });
    }

    getPaginatedProducts(page: number, size: number, categoryId: string | null, merchantId?: string | number | null): Observable<any> {
        let url = `${this.apiUrl}?page=${page}&size=${size}`;
        if (categoryId) url += `&category=${categoryId}`;
        if (merchantId) url += `&merchantId=${merchantId}`;

        return this.http.get<any>(url).pipe(
            tap(data => {
                if (page === 0 && !categoryId && data.content) {
                    this.productsSubject.next(data.content);
                }
            })
        );
    }

    getProductById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    createProduct(product: Product): Observable<any> {
        // Map Angular model to Backend DTO (categoryId -> category)
        const dto = {
            ...product,
            category: product.categoryId || product.category // Supporting both for safety
        };

        if (dto.id) {
            return this.http.put<any>(`${this.apiUrl}/${dto.id}`, dto);
        }
        return this.http.post<any>(this.apiUrl, dto);
    }

    updatePrice(productId: string, price: number, occasion: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${productId}/price`, { price, occasion });
    }

    getPriceHistory(productId: string): Observable<PriceHistory[]> {
        return this.http.get<PriceHistory[]>(`${this.apiUrl}/${productId}/price-history`);
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getAllProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }
}
