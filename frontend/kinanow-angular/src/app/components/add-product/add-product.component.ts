import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-2xl">
        <h3 class="text-2xl font-bold text-center">Add New Product</h3>
        <form (ngSubmit)="onSubmit()">
          <div class="mt-4 grid grid-cols-1 gap-6">
            <div>
              <label class="block">Product Name</label>
              <input type="text" [(ngModel)]="product.name" name="name" class="w-full px-4 py-2 mt-2 border rounded-md" required>
            </div>
            
            <div>
              <label class="block">Description</label>
              <textarea [(ngModel)]="product.description" name="description" class="w-full px-4 py-2 mt-2 border rounded-md" required></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block">Price</label>
                  <input type="number" [(ngModel)]="product.price" name="price" class="w-full px-4 py-2 mt-2 border rounded-md" required>
                </div>
                <div>
                  <label class="block">Category</label>
                  <input type="text" [(ngModel)]="product.category" name="category" class="w-full px-4 py-2 mt-2 border rounded-md" required>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block">Type</label>
                  <input type="text" [(ngModel)]="product.type" name="type" class="w-full px-4 py-2 mt-2 border rounded-md">
                </div>
                <div>
                  <label class="block">Model</label>
                  <input type="text" [(ngModel)]="product.model" name="model" class="w-full px-4 py-2 mt-2 border rounded-md">
                </div>
            </div>

            <div>
              <label class="block">Image URL</label>
              <input type="text" [(ngModel)]="product.imageUrl" name="imageUrl" class="w-full px-4 py-2 mt-2 border rounded-md" placeholder="http://example.com/image.png">
            </div>

            <div class="flex items-baseline justify-between">
              <button class="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Add Product</button>
            </div>
            <div *ngIf="message" class="text-green-600 mt-2">{{ message }}</div>
            <div *ngIf="error" class="text-red-600 mt-2">{{ error }}</div>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddProductComponent {
  private productService = inject(ProductService);
  private authService = inject(AuthService);

  product: Product = {
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    type: '',
    model: '',
    merchantId: 0
  };

  message = '';
  error = '';

  onSubmit() {
    const user = this.authService.currentUserValue;
    if (!user || user.role !== 'MERCHANT' || !user.merchant_id) {
      this.error = 'You must be logged in as a merchant account.';
      return;
    }
    this.product.merchantId = user.merchant_id; // Attach merchant ID

    this.productService.createProduct(this.product).subscribe({
      next: () => {
        this.message = 'Product added successfully!';
        this.error = '';
        // Reset form
        this.product = { name: '', description: '', price: 0, category: '', imageUrl: '', type: '', model: '', merchantId: 0 };
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to add product.';
      }
    });
  }
}
