import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentMethod } from '../models/payment-method';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClientPaymentService {
    private http = inject(HttpClient);
    private apiUrl = '/api/v1/payment-methods';

    getAllMethods(): Observable<PaymentMethod[]> {
        return this.http.get<PaymentMethod[]>(this.apiUrl);
    }

    addMethod(method: PaymentMethod): Observable<PaymentMethod> {
        return this.http.post<PaymentMethod>(this.apiUrl, method);
    }
}
