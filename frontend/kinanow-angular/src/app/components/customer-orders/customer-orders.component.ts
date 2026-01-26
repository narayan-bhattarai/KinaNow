import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-customer-orders',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Order History</h1>
        <p class="text-slate-500 text-sm font-bold uppercase tracking-widest mb-10">Track and manage your acquisitions</p>

        <div *ngIf="loading" class="flex justify-center py-20">
            <div class="animate-spin h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full"></div>
        </div>

        <div *ngIf="!loading && orders.length === 0" class="bg-white rounded-[32px] p-16 text-center shadow-sm border border-slate-100">
             <div class="text-6xl mb-6 opacity-20">📦</div>
             <h2 class="text-xl font-bold text-slate-900 mb-4">No Orders Yet</h2>
             <a routerLink="/" class="inline-block px-8 py-4 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-black transition-all">Start Shopping</a>
        </div>

        <div *ngIf="!loading && orders.length > 0" class="space-y-8">
            <div *ngFor="let order of orders" class="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <!-- Header -->
                <div class="bg-slate-50/50 p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-6">
                    <div class="flex gap-8">
                        <div>
                            <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Placed</div>
                            <div class="font-bold text-slate-900 text-sm">Today</div>
                        </div>
                        <div>
                            <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</div>
                            <div class="font-bold text-slate-900 text-sm">{{ order.totalAmount | currency }}</div>
                        </div>
                        <div class="hidden sm:block">
                             <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Order #</div>
                             <div class="font-mono text-sm font-black text-slate-900">{{ order.knOrderId }}</div>
                        </div>
                    </div>
                    <div>
                         <span [ngClass]="{
                            'bg-emerald-100 text-emerald-700': order.status === 'PAID',
                            'bg-blue-100 text-blue-700': order.status === 'CREATED',
                            'bg-orange-100 text-orange-700': order.status === 'PENDING'
                        }" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block">
                            {{ order.status }}
                        </span>
                    </div>
                </div>

                <!-- Items -->
                <div class="p-6 md:p-8 space-y-6">
                    <div *ngFor="let item of order.orderItems" class="flex items-start gap-4 sm:gap-6">
                        <div class="h-20 w-20 sm:h-24 sm:w-24 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 flex-shrink-0 overflow-hidden">
                             <!-- Show first 3 letters if no image, or placeholder -->
                            <img [src]="item.imageUrl || 'assets/placeholder.png'" (error)="item.imageUrl = 'assets/placeholder.png'" class="w-full h-full object-contain p-2 mix-blend-multiply" alt="">
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="font-bold text-slate-900 text-sm sm:text-base mb-1 truncate">{{ item.productName || item.skuCode || 'Product #' + item.productId }}</h3>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Color: Standard &bull; SKU: {{ item.skuCode }}</p>
                            
                            <div class="flex items-center gap-2 mt-4">
                                <button class="px-4 py-2 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 transition-colors">Buy Again</button>
                                <button class="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors">Track Package</button>
                            </div>
                        </div>
                        <div class="text-right">
                             <div class="text-sm font-black text-slate-900">{{ item.price | currency }}</div>
                             <div class="text-[10px] font-bold text-slate-400">Qty: {{ item.quantity }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class CustomerOrdersComponent implements OnInit {
    private orderService = inject(OrderService);
    orders: Order[] = [];
    loading = true;

    ngOnInit() {
        this.orderService.getMyOrders().subscribe({
            next: (data) => {
                this.orders = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load orders', err);
                this.loading = false;
            }
        });
    }
}
