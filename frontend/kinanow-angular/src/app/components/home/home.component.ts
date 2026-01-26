import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  router = inject(Router);
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  lastUpdate: Date | null = null; // Debug

  ngOnInit() {
    this.loading = true;

    // Load Categories for name resolution
    this.categoryService.getAllCategories().subscribe(cats => {
      this.categories = cats;
    });

    // Subscribe to the live stream
    this.productService.products$.subscribe(products => {
      if (products && products.length > 0) {
        console.log('Home received products:', products);
        this.products = products;
        this.lastUpdate = new Date();
        this.loading = false;
      } else {
        // Initial load trigger
        this.loadProducts();
      }
    });

    // Force an initial refresh
    this.loadProducts();
  }

  getCategoryName(id: any): string {
    if (!id) return 'General';
    const cat = this.categories.find(c => c.id == id);
    return cat ? cat.name : 'Category';
  }

  // DEBUG METHODS
  testUpdatePrice() {
    this.productService.updatePrice('101', 9999, 'Debug Update').subscribe(() => console.log('Debug update sent'));
  }

  forceReload() {
    // Logic to trigger reload
    this.productService.getPaginatedProducts(0, 50, null).subscribe();
  }

  navigateToProduct(id: string) {
    console.log('CLICKED PRODUCT:', id);
    // Explicitly using window.location to bypass router issues
    if (id) {
      window.location.href = '/shop/' + id;
    } else {
      console.error('Missing ID for navigation');
    }
    // this.router.navigate(['/shop', id]);
    // NUCLEAR OPTION:
    window.location.href = '/shop/' + id;
  }

  resetData() {
    localStorage.removeItem('mock_products_v2');
    localStorage.removeItem('mock_updated_at');
    location.reload();
  }

  loadProducts() {
    // This triggers the service to re-read storage and emit to the stream
    this.productService.getPaginatedProducts(0, 50, null).subscribe({
      next: (data) => {
        // The stream subscription above will handle the data assignment
        // But we can double check here
        if (data.content) {
          this.products = data.content;
          this.loading = false;
        }
      },
      error: (err) => this.loading = false
    });
  }
}
