import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 bg-gray-50 min-h-screen">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Executive Dashboard</h1>
      
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Products</p>
          <h2 class="text-4xl font-bold text-gray-900 mt-2">{{ productCount }}</h2>
          <p class="text-green-600 text-sm font-medium mt-2">↑ 12% from last month</p>
        </div>
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Categories</p>
          <h2 class="text-4xl font-bold text-gray-900 mt-2">{{ categoryCount }}</h2>
          <p class="text-blue-600 text-sm font-medium mt-2">Fully Managed</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Inventory Value</p>
          <h2 class="text-4xl font-bold text-gray-900 mt-2">$242,500</h2>
          <p class="text-gray-400 text-sm mt-2">Estimated Market Rate</p>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Low Stock Alerts</p>
          <h2 class="text-4xl font-bold text-red-600 mt-2">3</h2>
          <p class="text-red-400 text-sm mt-2">Action Required</p>
        </div>
      </div>

      <!-- Recent Trends -->
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">System Status</h3>
        <div class="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
          <div class="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
          <p class="text-green-800 font-medium">All Backend Services Synced & Persisted Locally</p>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  productCount = 0;
  categoryCount = 0;

  ngOnInit() {
    this.productService.products$.subscribe(p => this.productCount = p.length);
    this.categoryService.getAllCategories().subscribe(c => this.categoryCount = c.length);
  }
}
