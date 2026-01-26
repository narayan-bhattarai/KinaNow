import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoryService, Category } from '../../services/category.service';
import { ProductService, Product } from '../../services/product.service';
import { SnackbarService } from '../../services/snackbar.service';
import { AuthService } from '../../services/auth.service';

interface ProductAttribute {
  key: string;
  value: string;
}

@Component({
  selector: 'app-products-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="p-4 bg-gray-50 min-h-screen">
      <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h1 class="text-xl font-bold text-gray-800">Product Management</h1>
        
        <div class="flex items-center space-x-3 w-full md:w-auto">
            <!-- Category Filter -->
            <select [(ngModel)]="filterCategoryId" (change)="onFilterChange()" class="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                <option [ngValue]="null">All Categories</option>
                <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
            </select>

            <button (click)="openAddModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm whitespace-nowrap">
                <span class="mr-2 text-xl font-bold">+</span> Add Product
            </button>
        </div>
      </div>

       <!-- Product Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                  <tr>
                      <th class="px-3 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest w-12">#</th>
                      <th class="px-3 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest w-20">Image</th>
                      <th class="px-3 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                      <th class="px-3 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                      <th class="px-3 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                      <th class="px-3 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                      <th class="px-3 py-2 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Specs</th>
                      <th class="px-3 py-2 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                  <tr *ngFor="let product of products; let i = index" class="hover:bg-gray-50/50 transition duration-200">
                      <td class="px-3 py-2 whitespace-nowrap text-gray-400 text-[11px] font-mono">
                          {{ (page * size) + i + 1 }}
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap">
                          <div class="h-10 w-10 rounded-lg bg-gray-100 border border-gray-100 flex items-center justify-center overflow-hidden">
                              <img *ngIf="product.imageUrl" [src]="product.imageUrl" class="h-full w-full object-cover">
                              <span *ngIf="!product.imageUrl" class="text-lg">📦</span>
                          </div>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap">
                          <div class="flex items-center">
                              <div class="ml-0">
                                  <div class="text-[12px] font-bold text-gray-700 leading-tight">{{ product.name }}</div>
                              </div>
                          </div>
                      </td>
                       <td class="px-3 py-2 whitespace-nowrap">
                           <span class="px-2 py-0.5 inline-flex text-[10px] leading-4 font-black rounded-full bg-blue-50 text-blue-600 uppercase tracking-tighter">
                               {{ getCategoryName(product.category) }}
                           </span>
                       </td>
                       <td class="px-3 py-2 whitespace-nowrap">
                          <div class="flex flex-col">
                              <span class="text-[12px] font-black text-gray-800 tracking-tight">{{ product.price | currency }}</span>
                              <!-- Price Trend -->
                              <span *ngIf="product.previousPrice && product.price > product.previousPrice" class="text-[9px] font-bold text-rose-600 flex items-center bg-rose-50 px-1 py-0.5 rounded mt-0.5 w-fit">
                                  ↑ {{ (product.price - product.previousPrice) | currency }}
                              </span>
                              <span *ngIf="product.previousPrice && product.price < product.previousPrice" class="text-[9px] font-bold text-emerald-600 flex items-center bg-emerald-50 px-1 py-0.5 rounded mt-0.5 w-fit">
                                  ↓ {{ (product.previousPrice - product.price) | currency }}
                              </span>
                          </div>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-[11px] font-bold text-gray-500">
                          {{ product.stock || 0 }}
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-[10px] text-gray-400 max-w-[140px]">
                          <div class="truncate font-medium text-gray-400" [title]="getSpecsSummary(product)">
                              {{ getSpecsSummary(product) }}
                          </div>
                      </td>
                      <td class="px-3 py-2 whitespace-nowrap text-right text-[11px] font-medium space-x-1">
                            <button (click)="viewHistory(product)" class="bg-gray-50 text-gray-400 hover:text-purple-600 hover:bg-purple-50 p-1.5 rounded transition" title="Price History">
                                📊
                            </button>
                            <button (click)="openEditModal(product)" class="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition">Edit</button>
                            <button (click)="initDelete(product)" class="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition">Delete</button>
                      </td>
                  </tr>
                  <tr *ngIf="products.length === 0">
                      <td colspan="8" class="px-6 py-10 text-center text-sm text-gray-500">
                          No products found.
                      </td>
                  </tr>
              </tbody>
          </table>
          
          <!-- Pagination Controls -->
          <div class="flex justify-between items-center bg-white p-4 border-t border-gray-200">
             <span class="text-sm text-gray-600">
                 Showing range {{ (page * size) + 1 }} - {{ Math.min((page + 1) * size, totalElements) }} of {{ totalElements }}
             </span>
             <div class="flex space-x-2">
                <button (click)="changePage(page - 1)" [disabled]="page === 0" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Prev
                </button>
                <span class="px-3 py-1 bg-gray-100 rounded text-sm font-bold">{{ page + 1 }}</span>
                <button (click)="changePage(page + 1)" [disabled]="(page + 1) * size >= totalElements" class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                </button>
             </div>
          </div>
      </div>

       <!-- Price History Modal -->
      <div *ngIf="showHistoryModal" class="fixed inset-0 z-[70] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity backdrop-blur-sm" (click)="closeHistoryModal()"></div>
        <div class="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
            <div class="relative bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-3xl sm:w-full">
                <div class="bg-white px-8 pt-8 pb-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-2xl font-bold text-gray-900">
                             Price History: <span class="text-blue-600">{{ historyProduct?.name }}</span>
                        </h3>
                         <button (click)="closeHistoryModal()" class="text-gray-400 hover:text-gray-600">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                         </button>
                    </div>

                    <div *ngIf="priceHistory.length > 0; else noHistory">
                        <div class="relative w-full h-64 bg-slate-50 rounded-lg border border-slate-200 p-4">
                            <!-- SVG Chart -->
                            <svg viewBox="0 0 500 200" class="w-full h-full overflow-visible">
                                <line x1="0" y1="20" x2="500" y2="20" stroke="#e2e8f0" stroke-width="1" />
                                <line x1="0" y1="100" x2="500" y2="100" stroke="#e2e8f0" stroke-width="1" />
                                <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" stroke-width="1" />
                                <path [attr.d]="chartPath" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-sm" />
                                <g *ngFor="let p of chartPoints" class="group">
                                    <circle [attr.cx]="p.x" [attr.cy]="p.y" r="6" class="fill-white stroke-blue-600 stroke-2 hover:fill-blue-100 cursor-pointer transition-colors" />
                                    <g class="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <rect [attr.x]="p.x - 40" [attr.y]="p.y - 45" width="80" height="35" rx="4" fill="#1e293b" />
                                        <text [attr.x]="p.x" [attr.y]="p.y - 22" text-anchor="middle" fill="white" font-size="12" font-weight="bold">{{ p.price | currency }}</text>
                                        <text [attr.x]="p.x" [attr.y]="p.y - 52" text-anchor="middle" fill="#64748b" font-size="10">{{ p.date | date:'shortDate' }}</text>
                                    </g>
                                </g>
                            </svg>
                        </div>

                         <!-- Info Message -->
                         <div class="mt-4 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100 flex items-center">
                             <span class="mr-2">ℹ️</span> To update the price, please use the "Edit" button in the management grid.
                         </div>
                        
                         <div class="mt-6">
                            <h4 class="font-semibold text-gray-700 mb-3">Change Log</h4>
                            <div class="max-h-40 overflow-y-auto border rounded-lg">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50">Date</th>
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50">Price</th>
                                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50">Occasion</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr *ngFor="let h of priceHistory">
                                            <td class="px-4 py-2 text-sm text-gray-600">{{ h.changedAt | date:'medium' }}</td>
                                            <td class="px-4 py-2 text-sm font-bold text-gray-800">{{ h.price | currency }}</td>
                                            <td class="px-4 py-2 text-sm text-gray-500 italic">{{ h.occasion || '-' }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                    <ng-template #noHistory>
                        <div class="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                            <p>No price history available for this product.</p>
                        </div>
                    </ng-template>

                </div>
                 <div class="bg-gray-50 px-8 py-4 flex flex-row-reverse">
                   <button type="button" (click)="closeHistoryModal()" class="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm">
                     Close
                   </button>
                 </div>
            </div>
        </div>
      </div>

       <!-- Add/Edit Product Modal -->
        <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-md" (click)="closeModal()"></div>

        <div class="flex items-center justify-center p-4">
          <div class="relative bg-white rounded-2xl text-left shadow-xl transform transition-all sm:max-w-2xl sm:w-full flex flex-col max-h-[90vh] overflow-hidden">
             <button (click)="closeModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>

             <!-- Scrollable Modal Body -->
             <div class="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
              <h3 class="text-2xl leading-6 font-bold text-gray-900 mb-6">
                  {{ isEditing ? 'Edit Product' : 'Add New Product' }}
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Learn: Basic Info -->
                  <div class="col-span-2 space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input type="text" [(ngModel)]="currentProduct.name" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border">
                      </div>
                      
                      <div class="grid grid-cols-2 gap-4">
                          <div>
                            <div class="flex justify-between">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                 <span *ngIf="isEditing && originalProduct && currentProduct.price !== originalProduct.price" class="text-xs text-orange-600 font-semibold animate-pulse">
                                    Was: {{ originalProduct.price | currency }}
                                </span>
                            </div>
                             <div class="relative rounded-md shadow-sm">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span class="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input type="number" [(ngModel)]="currentProduct.price" class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md p-2.5 border" placeholder="0.00">
                             </div>
                          </div>
                           <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input type="number" [(ngModel)]="currentProduct.stock" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border">
                          </div>
                      </div>

                       <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Model Name / Number</label>
                        <input type="text" [(ngModel)]="currentProduct.model" 
                               class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                               placeholder="e.g. iPhone 16 Pro Max, WH-1000XM5">
                      </div>

                      <!-- OCCASION / OFFER FIELD -->
                      <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <label class="block text-sm font-bold text-blue-800 mb-1 flex items-center">
                            <span class="mr-2">🎉</span> Special Occasion Offer Label
                        </label>
                        <p class="text-[10px] text-blue-500 mb-2 font-medium uppercase tracking-tighter">Display a special badge like "Dashain Special" or "Season Offer"</p>
                        <input type="text" [(ngModel)]="currentProduct.occasion" 
                               class="block w-full bg-white border-blue-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border" 
                               placeholder="e.g. Dashain Blast, Winter Sale, Fresh Stock">
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select [(ngModel)]="currentProduct.categoryId" (change)="onCategoryChange()" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border">
                            <option [value]="null">Select Category...</option>
                            <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                        </select>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <div class="flex gap-2">
                             <input type="text" [(ngModel)]="currentProduct.imageUrl" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border" placeholder="https://example.com/item.jpg">
                             <div class="h-10 w-10 shrink-0 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                 <img *ngIf="currentProduct.imageUrl" [src]="currentProduct.imageUrl" class="h-full w-full object-cover" onerror="this.src=''">
                                 <span *ngIf="!currentProduct.imageUrl" class="text-xs text-gray-400">IMG</span>
                             </div>
                        </div>
                      </div>
                  </div>

                   <!-- Truly Dynamic Specifications Section -->
                   <div class="col-span-2 bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-inner">
                       <h4 class="text-sm font-black text-slate-700 mb-4 flex items-center uppercase tracking-wider">
                           <span class="mr-2">⚡</span> Specifications
                       </h4>
                       
                       <!-- Add New Spec Form -->
                       <div class="flex gap-2 mb-6 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                           <div class="flex-1">
                               <input type="text" [(ngModel)]="newSpecKey" placeholder="Attribute (e.g. Color)" 
                                      class="w-full text-xs p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none">
                           </div>
                           <div class="flex-1">
                               <input type="text" [(ngModel)]="newSpecValue" placeholder="Value (e.g. Black)" 
                                      class="w-full text-xs p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none">
                           </div>
                           <button (click)="addSpecification()" class="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700 transition shadow-sm">
                               + Add
                           </button>
                       </div>

                       <!-- List of current Specs -->
                       <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                           <div *ngFor="let spec of specList; let i = index" class="flex items-center gap-2 group animate-fade-in">
                               <div class="bg-white border border-slate-200 rounded flex flex-1 items-center px-3 py-2 shadow-sm">
                                   <span class="text-[11px] font-bold text-slate-500 w-24 truncate border-r border-slate-100 mr-2">{{ spec.key }}</span>
                                   <input type="text" [(ngModel)]="spec.value" 
                                          class="flex-1 text-xs text-slate-800 outline-none bg-transparent font-semibold">
                               </div>
                               <button (click)="removeSpecification(i)" 
                                       class="text-slate-300 hover:text-red-500 transition-colors p-1" title="Remove">
                                   ✕
                               </button>
                           </div>
                           
                           <div *ngIf="specList.length === 0" class="text-center py-4 bg-white/50 rounded-lg border border-dashed border-slate-200">
                               <p class="text-[11px] text-slate-400 italic">No specifications added yet.</p>
                           </div>
                       </div>
                   </div>
              </div>

            </div>
             <!-- Modal Footer (Fixed at bottom) -->
             <div class="bg-gray-50 px-8 py-4 flex flex-row-reverse gap-3 border-t border-gray-100 sticky bottom-0 z-10 w-full">
              <button type="button" (click)="saveProduct()" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:w-auto sm:text-sm">
                {{ isEditing ? 'Update Product' : 'Add Product' }}
              </button>
              <button type="button" (click)="closeModal()" class="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="itemToDelete" class="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity backdrop-blur-sm"></div>
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 class="text-lg leading-6 font-medium text-gray-900">Delete Product</h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">Are you sure you want to delete <span class="font-bold">{{ itemToDelete.name }}</span>? This action cannot be undone.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" (click)="confirmDelete()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                        Delete
                    </button>
                    <button type="button" (click)="itemToDelete = null" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  `
})
export class ProductsAdminComponent implements OnInit {
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  snackbar = inject(SnackbarService);
  authService = inject(AuthService);

  products: Product[] = [];
  categories: Category[] = [];
  showModal = false;
  isEditing = false;

  filterCategoryId: string | null = null;

  itemToDelete: any | null = null;

  currentProduct: any = {};
  originalProduct: any = null;
  specList: ProductAttribute[] = [];

  // Pagination
  page = 0;
  size = 10;
  totalElements = 0;
  Math = Math;

  // New Spec Temp Fields
  newSpecKey = '';
  newSpecValue = '';

  addSpecification() {
    if (!this.newSpecKey || !this.newSpecValue) {
      this.snackbar.show('Please provide both name and value', 'info');
      return;
    }

    // Immutable update for reactivity
    this.specList = [...this.specList, {
      key: this.newSpecKey,
      value: this.newSpecValue
    }];

    this.newSpecKey = '';
    this.newSpecValue = '';
  }

  removeSpecification(index: number) {
    const list = [...this.specList];
    list.splice(index, 1);
    this.specList = list;
  }

  getCategoryName(id: any): string {
    if (!id) return 'Uncategorized';
    const cat = this.categories.find(c => c.id == id);
    return cat ? cat.name : 'General';
  }

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
      },
      error: (err) => {
        console.warn('Backend unavailable, used seed data in service');
      }
    });

    this.loadProducts();
  }

  loadProducts() {
    const user = this.authService.currentUserValue;
    const merchantId = user?.role === 'MERCHANT' ? user.merchant_id : null;

    this.productService.getPaginatedProducts(this.page, this.size, this.filterCategoryId, merchantId).subscribe({
      next: (data) => {
        this.products = data.content;
        this.totalElements = data.totalElements;
      },
      error: (err) => {
        console.error(err);
        this.snackbar.show('Failed to load products', 'error');
      }
    });
  }

  onFilterChange() {
    this.page = 0; // Reset to page 0 on filter change
    this.loadProducts();
  }

  changePage(newPage: number) {
    if (newPage < 0) return;
    this.page = newPage;
    this.loadProducts();
  }

  openAddModal() {
    this.isEditing = false;
    this.currentProduct = { name: '', price: null, stock: 0, categoryId: null, model: '' };
    this.originalProduct = null;
    this.specList = [];
    this.showModal = true;
  }

  openEditModal(product: any) {
    this.isEditing = true;
    this.currentProduct = {
      ...product,
      categoryId: product.categoryId || product.category
    };
    this.originalProduct = { ...this.currentProduct };

    // Map object to list for easier management
    let specs = product.specifications || {};
    if (typeof specs === 'string') {
      try { specs = JSON.parse(specs); } catch (e) { specs = {}; }
    }
    this.specList = Object.entries(specs).map(([key, value]) => ({
      key,
      value: String(value)
    }));

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onCategoryChange() {
    if (!this.isEditing) {
      this.specList = [];
    }
  }

  isCategory(keyword: string): boolean {
    if (!this.currentProduct.categoryId) return false;
    const cat = this.categories.find(c => c.id == this.currentProduct.categoryId);
    if (!cat) return false;
    if (cat.name.includes(keyword)) return true;
    if (cat.parentId) {
      const parent = this.categories.find(p => p.id == cat.parentId);
      if (parent && parent.name.includes(keyword)) return true;
    }
    return false;
  }

  saveProduct() {
    const categoryName = this.categories.find(c => c.id == this.currentProduct.categoryId)?.name;

    // Convert list back to object for API
    const specsObj: any = {};
    this.specList.forEach(s => {
      if (s.key && s.value) {
        specsObj[s.key] = s.value;
      }
    });

    // Explicitly construct the request to avoid stale fields
    const productToSave = {
      ...this.currentProduct,
      specifications: specsObj,
      category: this.currentProduct.categoryId || this.currentProduct.category,
      categoryName: categoryName,
      type: this.currentProduct.type || 'Standard',
      model: this.currentProduct.model,
      merchantId: this.currentProduct.merchantId || this.authService.currentUserValue?.merchant_id
    };

    console.log('[ProductsAdmin] Attempting to save product:', productToSave);

    this.productService.createProduct(productToSave).subscribe({
      next: (savedProduct) => {
        console.log('[ProductsAdmin] Save successful:', savedProduct);
        this.loadProducts();
        this.closeModal();
        this.snackbar.show(this.isEditing ? 'Product updated successfully' : 'Product created successfully', 'success');
      },
      error: (err) => {
        console.error('[ProductsAdmin] Save error:', err);
        const msg = err.error?.message || 'Failed to save product';
        this.snackbar.show(msg, 'error');
      }
    });
  }

  initDelete(product: any) {
    this.itemToDelete = product;
  }

  confirmDelete() {
    if (this.itemToDelete && this.itemToDelete.id) {
      this.productService.deleteProduct(this.itemToDelete.id).subscribe({
        next: () => {
          this.loadProducts();
          this.itemToDelete = null;
          this.snackbar.show('Product deleted successfully', 'success');
        },
        error: (err) => {
          console.error(err);
          this.snackbar.show('Failed to delete product', 'error');
        }
      });
    }
  }

  // History State
  showHistoryModal = false;
  historyProduct: any = null;
  priceHistory: any[] = [];
  chartPath = '';
  chartPoints: { x: number, y: number, price: number, date: string }[] = [];

  // Add Event State
  newHistoryPrice: number | null = null;
  newHistoryOccasion: string = '';

  // ... existing methods ...

  viewHistory(product: any) {
    if (!product.id) return;
    this.historyProduct = product;
    this.newHistoryPrice = product.price;
    this.newHistoryOccasion = '';

    this.productService.getPriceHistory(product.id).subscribe({
      next: (history) => {
        this.priceHistory = history;
        this.generateChart();
        this.showHistoryModal = true;
      },
      error: () => {
        this.snackbar.show('Failed to load price history', 'error');
      }
    });
  }

  savePriceEvent() {
    if (!this.historyProduct || this.newHistoryPrice === null) return;

    this.productService.updatePrice(this.historyProduct.id, this.newHistoryPrice, this.newHistoryOccasion).subscribe({
      next: () => {
        this.snackbar.show('Price updated & event logged', 'success');
        // Refresh history and product list
        this.viewHistory(this.historyProduct);
        this.loadProducts();
      },
      error: (err) => {
        console.error(err);
        this.snackbar.show('Failed to save price event', 'error');
      }
    });
  }

  closeHistoryModal() {
    this.showHistoryModal = false;
    this.historyProduct = null;
    this.priceHistory = [];
  }

  generateChart() {
    if (!this.priceHistory || this.priceHistory.length === 0) {
      this.chartPath = '';
      this.chartPoints = [];
      return;
    }

    const prices = this.priceHistory.map(h => h.price);
    const minPrice = Math.min(...prices) * 0.9;
    const maxPrice = Math.max(...prices) * 1.1;
    const width = 500;
    const height = 200;
    const padding = 20;

    const count = this.priceHistory.length;

    this.chartPoints = this.priceHistory.map((h, index) => {
      const x = count > 1 ? padding + (index / (count - 1)) * (width - 2 * padding) : width / 2;
      const normalizedPrice = (h.price - minPrice) / (maxPrice - minPrice);
      const y = height - (padding + normalizedPrice * (height - 2 * padding));
      return { x, y, price: h.price, date: h.changedAt };
    });

    if (this.chartPoints.length > 1) {
      this.chartPath = 'M' + this.chartPoints.map(p => `${p.x},${p.y}`).join(' L');
    } else if (this.chartPoints.length === 1) {
      // Single point, draw a small horizontal line or circle handled by point rendering
      const p = this.chartPoints[0];
      this.chartPath = `M${p.x - 5},${p.y} L${p.x + 5},${p.y}`;
    }
  }

  // ... existing methods ...

  getAttributes(product: any): ProductAttribute[] {
    const attrs: ProductAttribute[] = [];

    // 1. Show Model as the first "spec" if it exists
    if (product.model) {
      attrs.push({ key: 'Model', value: product.model });
    }

    // 2. Add dynamic specifications
    let specs = product.specifications;

    // Handle potential stringified JSON (defensive coding)
    if (typeof specs === 'string') {
      try { specs = JSON.parse(specs); } catch (e) { specs = {}; }
    }

    if (specs && typeof specs === 'object') {
      Object.entries(specs).forEach(([key, value]) => {
        // Skip hidden fields or model if already shown
        if (key.toLowerCase() === 'model' || !value) return;

        attrs.push({
          key: key.charAt(0).toUpperCase() + key.slice(1),
          value: String(value)
        });
      });
    }

    return attrs;
  }

  getSpecsSummary(product: any): string {
    const attrs = this.getAttributes(product);
    if (attrs.length === 0) return 'No specifications';
    return attrs.map(a => `${a.key}: ${a.value}`).join(', ');
  }
}
