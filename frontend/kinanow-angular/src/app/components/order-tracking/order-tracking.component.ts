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
  currentStep = 1;
  loading = true;
  error = '';

  steps = [
    { label: 'Order Confirmed', description: 'We have received your order.' },
    { label: 'Processing', description: 'Your order is being prepared.' },
    { label: 'Shipped', description: 'Your order is on the way.' },
    { label: 'Delivered', description: 'Package delivered.' }
  ];

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      this.loadOrder();
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

  mapStatusToStep(status: string): number {
    switch (status) {
      case 'CREATED': return 1;
      case 'PAID': return 2;
      case 'SHIPPED': return 3;
      case 'DELIVERED': return 4;
      default: return 1;
    }
  }
}
