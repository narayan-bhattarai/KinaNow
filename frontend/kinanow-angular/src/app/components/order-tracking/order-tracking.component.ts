import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.css'
})
export class OrderTrackingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  orderId = '';
  order: Order | null = null;
  orderHistory: any[] = [];
  currentStep = 0;
  loading = true;
  error = '';

  steps = [
    { label: 'Paid', description: 'Payment confirmed. Preparing order.', status: 'PAID' },
    { label: 'Shipped', description: 'Your order is in transit.', status: 'SHIPPED' },
    { label: 'Delivered', description: 'Package successfully delivered.', status: 'DELIVERED' },
    { label: 'Returned', description: 'Return request processed.', status: 'RETURNED' }
  ];

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      this.loadOrder();
      this.loadHistory();
    }
  }

  loadOrder() {
    this.loading = true;
    this.orderService.getOrderByKnId(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.currentStep = this.mapStatusToStep(order.status);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Order not found or system error';
        this.loading = false;
      }
    });
  }

  loadHistory() {
    this.orderService.getOrderHistory(this.orderId).subscribe({
      next: (history) => {
        this.orderHistory = history;
        
        // Revised Progress logic for new workflow
        if (this.order?.status === 'CANCELLED') {
           const regularStatuses = ['PAID', 'SHIPPED', 'DELIVERED', 'RETURNED'];
           const reachedStatuses = history
             .map((h: any) => h.status)
             .filter((s: string) => regularStatuses.includes(s));
           
           if (reachedStatuses.length > 0) {
             const maxStatus = reachedStatuses.reduce((a, b) => 
               this.mapStatusToStep(a) > this.mapStatusToStep(b) ? a : b
             );
             this.currentStep = this.mapStatusToStep(maxStatus);
           } else {
             this.currentStep = 0;
           }
        }
      },
      error: (err) => {
        console.error('Failed to load history', err);
      }
    });
  }

  mapStatusToStep(status: string): number {
    switch (status) {
      case 'PAID': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      case 'RETURNED': return 4;
      case 'CANCELLED': return 0;
      default: return 0;
    }
  }
}
