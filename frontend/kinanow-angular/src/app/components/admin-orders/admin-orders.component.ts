import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-8 bg-gray-50 min-h-screen">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Order Management</h1>
        <div class="flex space-x-2 items-center">
             <!-- Search Input -->
             <div class="relative">
                <input type="text" [(ngModel)]="searchTerm" placeholder="Search orders..." 
                       class="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white shadow-sm placeholder-slate-400 font-medium">
                <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </div>
            <span class="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-bold text-slate-600 border border-slate-200">Total: {{ orders.length }}</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">#</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">KinaNow Order ID</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">User</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Items</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Total</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th class="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr *ngFor="let order of filteredOrders; let i = index" class="hover:bg-slate-50 transition-colors">
                <td class="p-4 text-xs font-bold text-slate-400">{{ i + 1 }}</td>
                <td class="p-4 font-mono text-sm font-medium text-slate-800 tracking-wider">
                    <div class="font-bold text-base text-blue-600">{{ order.knOrderId }}</div>
                </td>
                <td class="p-4 text-sm font-semibold text-slate-700">
                    <div class="flex items-center gap-2">
                        <div class="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                             {{ (order.fullName || 'U').charAt(0).toUpperCase() }}
                        </div>
                        <span>{{ order.fullName || 'User #' + order.userId }}</span>
                    </div>
                </td>
                <td class="p-4 text-sm text-slate-600">
                    <div class="flex flex-col gap-1">
                        <span *ngFor="let item of order.orderItems" class="text-xs">
                           <span class="font-bold">{{ item.quantity }}x</span> {{ item.skuCode }}
                        </span>
                    </div>
                </td>
                <td class="p-4 font-bold text-slate-900">{{ order.totalAmount | currency }}</td>
                <td class="p-4">
                   <select [ngModel]="order.status" (ngModelChange)="onStatusChange(order, $event)" 
                           class="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-1 uppercase">
                       <option value="CREATED">Created</option>
                       <option value="PAID">Paid</option>
                       <option value="SHIPPED">Shipped</option>
                       <option value="DELIVERED">Delivered</option>
                       <option value="RETURNED">Returned</option>
                       <option value="CANCELLED">Cancelled</option>
                   </select>
                </td>
                <td class="p-4">
                    <button (click)="viewHistory(order)" 
                            class="text-blue-600 hover:text-blue-800 text-[10px] font-black uppercase tracking-widest bg-blue-50/50 px-3 py-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-all">
                        View History
                    </button>
                </td>
              </tr>
              <tr *ngIf="orders.length === 0">
                <td colspan="7" class="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No orders found in database</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- PREMIUM HISTORY MODAL -->
      <div *ngIf="showHistoryModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" (click)="closeHistory()"></div>
          
          <!-- Modal Content -->
          <div class="bg-white rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-bounce-in border border-slate-100">
              <div class="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                  <div>
                      <h2 class="text-xl font-black text-slate-900 tracking-tight">Order Lifecycle</h2>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ref: {{ selectedOrder?.knOrderId }}</p>
                  </div>
                  <button (click)="closeHistory()" class="p-2 hover:bg-white rounded-xl transition text-slate-400">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
              </div>

              <div class="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div *ngIf="loadingHistory" class="flex justify-center py-12">
                      <div class="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  </div>

                  <div *ngIf="!loadingHistory && history.length > 0" class="space-y-8 relative">
                      <!-- Timeline Line -->
                      <div class="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-300"></div>

                      <div *ngFor="let entry of history; let i = index" class="relative pl-12 group">
                          <!-- Point Display -->
                          <div class="absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-700 z-10"
                               [ngClass]="{
                                   'bg-blue-600 border-4 border-blue-100 shadow-md': i === 0,
                                   'bg-white border-4 border-slate-400': i !== 0
                               }">
                          </div>
                          
                          <div class="p-4 rounded-3xl transition-all duration-500"
                               [ngClass]="{'bg-slate-50 border border-slate-200 shadow-sm' : i === 0}">
                              <div class="flex items-center justify-between mb-1.5">
                                  <span class="text-sm font-black tracking-widest uppercase transition-colors"
                                        [ngClass]="i === 0 ? 'text-blue-700' : 'text-slate-900'">
                                      {{ entry.status }}
                                  </span>
                                  <span class="text-[10px] font-black text-slate-500 uppercase font-mono tracking-tighter">{{ entry.createdAt | date:'MMM d, HH:mm' }}</span>
                              </div>
                              <p class="text-[13px] font-bold leading-relaxed transition-colors"
                                 [ngClass]="i === 0 ? 'text-slate-800' : 'text-slate-600'">
                                  Transaction status transitioned to {{ entry.status | lowercase }}. 
                                  Auto-logged by system core.
                              </p>
                          </div>
                      </div>
                  </div>

                  <div *ngIf="!loadingHistory && history.length === 0" class="text-center py-12">
                      <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">No history logs currently available.</p>
                  </div>
              </div>

              <div class="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-end">
                  <button (click)="closeHistory()" class="btn-premium bg-slate-950 text-white text-[10px] py-3 px-8">Close View</button>
              </div>
          </div>
      </div>


    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private snackbar = inject(SnackbarService);
  orders: Order[] = [];
  searchTerm: string = '';
  
  // History Modal Logic
  showHistoryModal = false;
  loadingHistory = false;
  selectedOrder: Order | null = null;
  history: any[] = [];

  debugStatus = 'Initializing...';
  debugError = '';

  get filteredOrders() {
    if (!this.searchTerm) return this.orders;
    const term = this.searchTerm.toLowerCase();
    return this.orders.filter(order =>
      (order.knOrderId && order.knOrderId.toLowerCase().includes(term)) ||
      (order.fullName && order.fullName.toLowerCase().includes(term))
    );
  }

  ngOnInit() {
    this.loadOrders();
  }

  onStatusChange(order: Order, newStatus: string) {
    const currentStatus = order.status;

    // BUSINESS RULES VALIDATION
    if (newStatus === 'CANCELLED' && (currentStatus === 'SHIPPED' || currentStatus === 'DELIVERED')) {
        this.snackbar.show('Forbidden: Order cannot be cancelled once shipped.', 'error');
        return;
    }

    if (newStatus === 'RETURNED' && currentStatus !== 'DELIVERED') {
        this.snackbar.show('Forbidden: Order must be delivered before initiating a return.', 'error');
        return;
    }

    this.orderService.updateOrderStatus(order.knOrderId, newStatus).subscribe({
      next: () => {
        order.status = newStatus;
        this.snackbar.show(`Order status updated to ${newStatus}`, 'success');
      },
      error: (err) => {
        console.error(err);
        this.snackbar.show('Failed to update status', 'error');
      }
    });
  }

  loadOrders() {
    this.debugStatus = 'Loading...';
    this.debugError = '';

    console.log('AdminOrders: Fetching orders...');
    const user = this.authService.currentUserValue;
    const orderRequest = user?.role === 'MERCHANT' ? this.orderService.getMerchantOrders() : this.orderService.getAllOrders();

    orderRequest.subscribe({
      next: (data) => {
        console.log('AdminOrders: Received data', data);
        this.orders = data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()); // Sort by newest first
        this.debugStatus = `Success. Loaded ${data.length} orders.`;
      },
      error: (err) => {
        console.error('AdminOrders: Failed to load orders', err);
        this.debugError = JSON.stringify(err);
        this.debugStatus = 'Failed.';
      }
    });
  }

  viewHistory(order: Order) {
    this.selectedOrder = order;
    this.showHistoryModal = true;
    this.loadingHistory = true;
    this.history = [];

    this.orderService.getOrderHistory(order.knOrderId).subscribe({
        next: (data) => {
            this.history = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            this.loadingHistory = false;
        },
        error: (err) => {
            console.error('Failed to load history', err);
            this.loadingHistory = false;
            this.snackbar.show('Failed to load order history', 'error');
        }
    });
  }

  closeHistory() {
    this.showHistoryModal = false;
    this.selectedOrder = null;
    this.history = [];
  }
}
