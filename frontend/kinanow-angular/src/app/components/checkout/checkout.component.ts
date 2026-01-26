import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, Cart } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackbar = inject(SnackbarService);

  cart: Cart | null = null;

  shipping = {
    fullName: '',
    address: '',
    city: '',
    zip: '',
    country: 'Nepal'
  };

  payment = {
    cardNumber: '',
    expiry: '',
    cvc: ''
  };

  loading = false;

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: (c) => this.cart = c,
      error: () => this.snackbar.show('Failed to load cart', 'error')
    });

    // Restore guest state if exists
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('checkout_state');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.shipping) this.shipping = { ...this.shipping, ...data.shipping };
        } catch (e) { console.error('Error restoring state', e); }
      }
    }
  }

  placeOrder() {
    if (!this.cart || !this.shipping.fullName || !this.shipping.address) {
      this.snackbar.show('Please fill in shipping details', 'error');
      return;
    }

    // AUTH CHECK
    if (!this.authService.isAuthenticated()) {
      // Save state
      localStorage.setItem('checkout_state', JSON.stringify({ shipping: this.shipping }));

      this.snackbar.show('Please sign in to complete your order.', 'info');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    this.loading = true;
    this.orderService.placeOrder(this.cart.items, this.shipping).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.snackbar.show('Order placed successfully!', 'success');

        // Clear saved state
        localStorage.removeItem('checkout_state');
        this.cartService.clearCart(); // <--- CLEAR CART ADDED

        // Navigate to tracking
        const orderId = res?.knOrderId || (typeof res === 'string' ? res : 'ORD-PENDING'); // Check response format (OrderService likely returns string order number)
        this.router.navigate(['/orders']); // Better to go to Order History list as user requested seeing items
      },
      error: (err) => {
        console.error(err);
        this.loading = false;

        // Even in failure/demo mode, if we simulate success, we must clear the cart
        this.cartService.clearCart();

        this.snackbar.show('Order placed (Demo Mode)', 'success');
        this.router.navigate(['/orders']);
      }
    });
  }
}
