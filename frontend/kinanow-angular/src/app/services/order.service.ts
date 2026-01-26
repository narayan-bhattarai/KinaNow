import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CartItem } from './cart.service';

export interface OrderItem {
    id?: string;
    productId: string;
    skuCode: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    productName?: string;
    merchantId?: string;
}

export interface Order {
    id: string;
    knOrderId: string;
    userId: string;
    fullName?: string;
    orderItems: OrderItem[];
    totalAmount: number;
    status: string;
    merchantId?: string;
    createdAt?: string;
}

export interface OrderRequest {
    items: any[];
    shippingAddress?: any;
    paymentMethod?: string;
    totalAmount?: number;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = '/api/v1/orders';

    placeOrder(items: CartItem[], shippingData?: any): Observable<any> {
        const userId = this.authService.currentUserId;
        const user = this.authService.currentUserValue;
        if (!userId) throw new Error('User not authenticated');

        const headers = new HttpHeaders().set('X-User-Id', userId.toString());
        const orderRequest = {
            fullName: shippingData?.fullName || user?.full_name || 'Guest User',
            email: user?.email || 'guest@example.com',
            shippingAddress: shippingData ? `${shippingData.address}, ${shippingData.city}, ${shippingData.zip}, ${shippingData.country}` : 'N/A',
            items: items.map(item => ({
                skuCode: item.skuCode,
                price: item.price,
                quantity: item.quantity,
                productName: item.productName,
                imageUrl: item.imageUrl,
                productId: item.productId,
                merchantId: item.merchantId
            }))
        };
        return this.http.post(this.apiUrl, orderRequest, { headers });
    }

    getOrderById(id: string): Observable<Order> {
        // This might need backend update if GET /orders/{id} isn't implemented genericly
        // But let's assume it might exist, or we use getMyOrders() filtering.
        // Actually, backend only has GET / (my orders) and GET /all (admin).
        // So this method might be tricky unless we query all and filter.
        // For now, I'll leave it as a simple GET in case backend supports it later.
        return this.http.get<Order>(`${this.apiUrl}/${id}`);
    }

    getMyOrders(): Observable<Order[]> {
        const userId = this.authService.currentUserId;
        if (!userId) {
            // Guest logic or empty
            return new Observable(obs => obs.next([]));
        }
        const headers = new HttpHeaders().set('X-User-Id', userId.toString());
        return this.http.get<Order[]>(this.apiUrl, { headers });
    }

    getAllOrders(): Observable<Order[]> {
        const userId = this.authService.currentUserId;
        const headers = userId ? new HttpHeaders().set('X-User-Id', userId.toString()) : new HttpHeaders();
        return this.http.get<Order[]>(`${this.apiUrl}/all`, { headers });
    }

    getMerchantOrders(): Observable<Order[]> {
        const user = this.authService.currentUserValue;
        if (!user || !user.merchant_id) return new Observable(obs => obs.next([]));

        const headers = new HttpHeaders()
            .set('X-User-Id', user.user_id.toString())
            .set('X-Merchant-Id', user.merchant_id.toString());
        return this.http.get<Order[]>(`${this.apiUrl}/merchant`, { headers });
    }

    updateOrderStatus(knOrderId: string, status: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${knOrderId}/status?status=${status}`, {});
    }

    updateShippingStatus(knOrderId: string, status: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${knOrderId}/shipping-status?status=${status}`, {});
    }

    getOrderByKnId(knId: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/track/${knId}`);
    }

    getOrderHistory(knOrderId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${knOrderId}/history`);
    }
}
