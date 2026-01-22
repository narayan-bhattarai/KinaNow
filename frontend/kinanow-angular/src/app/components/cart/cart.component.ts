import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Shopping Cart</h2>
      <p class="text-gray-600">Your cart is empty (Placeholder).</p>
    </div>
  `
})
export class CartComponent { }
