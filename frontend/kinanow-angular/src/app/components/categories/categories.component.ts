import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../services/category.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-6 bg-gray-50 min-h-screen relative">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Categories</h1>
        
        <div class="flex space-x-3">
             <!-- View Toggles -->
             <div class="bg-white p-1 rounded-lg border border-gray-200 flex">
                 <button (click)="viewMode = 'grid'" [class.bg-gray-100]="viewMode === 'grid'" class="p-2 rounded hover:bg-gray-50 transition" title="Grid View">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                 </button>
                 <button (click)="viewMode = 'list'" [class.bg-gray-100]="viewMode === 'list'" class="p-2 rounded hover:bg-gray-50 transition" title="List View">
                    <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                 </button>
             </div>

            <button (click)="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm">
                 <span class="mr-2 text-xl font-bold">+</span> Add Category
            </button>
        </div>
      </div>
    
      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-10">
         <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
         <p class="mt-4 text-gray-500">Loading categories...</p>
      </div>

      <div *ngIf="!loading && categories.length > 0">
          <!-- GRID VIEW (Cards) -->
          <div *ngIf="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in mb-6">
            <div *ngFor="let cat of categories; let i = index" class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition group cursor-pointer relative overflow-hidden border border-gray-100 h-full flex flex-col items-center text-center">
                <div class="absolute top-2 left-2 text-xs text-gray-400 font-mono">#{{ (page * size) + i + 1 }}</div>
                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition z-10">
                    <button (click)="initDelete(cat)" class="text-red-400 hover:text-red-600 bg-white rounded-full p-1 shadow-sm">🗑️</button>
                </div>
                
                <div class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-xl mb-3 text-blue-500 font-bold flex-shrink-0">
                    {{ cat.name.charAt(0).toUpperCase() }}
                </div>
                <h3 class="font-bold text-gray-800 text-sm leading-tight mb-1">{{ cat.name }}</h3>
                
                <div *ngIf="cat.parentId" class="mt-auto pt-2">
                   <span class="text-[10px] uppercase tracking-wide bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                       In: {{ getCategoryName(cat.parentId) }}
                   </span>
                </div>
            </div>
          </div>

          <!-- LIST VIEW (Table) -->
          <div *ngIf="viewMode === 'list'" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in mb-6">
              <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                      <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                      <tr *ngFor="let cat of categories; let i = index" class="hover:bg-gray-50 transition">
                          <td class="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                              {{ (page * size) + i + 1 }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                              <div class="flex items-center">
                                  <div class="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                      {{ cat.name.charAt(0).toUpperCase() }}
                                  </div>
                                  <div class="ml-4">
                                      <div class="text-sm font-medium text-gray-900">{{ cat.name }}</div>
                                  </div>
                              </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                              <span *ngIf="cat.parentId" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                {{ getCategoryName(cat.parentId) }}
                              </span>
                              <span *ngIf="!cat.parentId" class="text-xs text-gray-400">root</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {{ cat.description || '-' }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button (click)="openEditModal(cat)" class="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition">Edit</button>
                              <button (click)="initDelete(cat)" class="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition">Delete</button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <!-- Pagination Controls (Always Visible) -->
           <div class="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-4">
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
      
      <div *ngIf="!loading && categories.length === 0" class="text-center py-10 text-gray-500">
         No categories found.
      </div>

      <!-- Add/Edit Category Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity backdrop-blur-sm" (click)="closeModal()"></div>

        <div class="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
          <div class="relative bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
             <button (click)="closeModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>

            <div class="bg-white px-8 pt-8 pb-6">
              <h3 class="text-2xl leading-6 font-bold text-gray-900 mb-2">
                {{ isEditing ? 'Edit Category' : 'New Category' }}
              </h3>
              
              <div class="space-y-5 mt-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" [(ngModel)]="currentCategory.name" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border" placeholder="e.g. Smart Phones">
                </div>
                
                 <div class="relative">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                    <input type="text" [(ngModel)]="parentSearch" (focus)="showParentDropdown=true" (blur)="handleBlur()" 
                           class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border" 
                           placeholder="Search parent or leave empty for Root...">
                           
                    <div *ngIf="showParentDropdown" class="absolute z-50 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        <div (mousedown)="selectParent(null)" class="p-2.5 hover:bg-gray-50 cursor-pointer text-gray-500 italic text-sm border-b border-gray-100">
                            None (Root Category)
                        </div>
                        <div *ngFor="let cat of filteredParents" (mousedown)="selectParent(cat)" class="p-2.5 hover:bg-blue-50 cursor-pointer text-sm text-gray-700">
                            {{ cat.name }}
                        </div>
                        <div *ngIf="filteredParents.length === 0" class="p-2.5 text-gray-400 text-sm italic">
                            No matches found.
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea [(ngModel)]="currentCategory.description" rows="3" class="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border" placeholder="Optional description..."></textarea>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-8 py-4 flex flex-row-reverse gap-3">
              <button type="button" (click)="saveCategory()" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:w-auto sm:text-sm">
                {{ isEditing ? 'Update' : 'Create' }}
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
                            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Delete Category</h3>
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
export class CategoriesComponent implements OnInit {
    categoryService = inject(CategoryService);
    categories: Category[] = [];
    allCategoriesForSelect: Category[] = []; // Full list for parent selection

    loading = false;
    showModal = false;

    // Pagination
    page = 0;
    size = 10;
    totalElements = 0;
    Math = Math; // For template

    viewMode: 'grid' | 'list' = 'grid';

    // Edit/Add State
    isEditing = false;
    currentCategory: Partial<Category> = {};

    // Delete State
    itemToDelete: Category | null = null;

    // Autocomplete State
    parentSearch = '';
    showParentDropdown = false;

    ngOnInit() {
        this.loadCategories();
        this.loadAllForSelect();
    }

    snackbar = inject(SnackbarService); // Inject Snackbar

    // ...

    loadCategories() {
        this.loading = true;
        this.categoryService.getPaginatedCategories(this.page, this.size).subscribe({
            next: (data) => {
                this.categories = data.content;
                this.totalElements = data.totalElements;
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load categories', err);
                this.loading = false;
                this.snackbar.show('Failed to load categories', 'error');
            }
        });
    }

    loadAllForSelect() {
        this.categoryService.getAllCategories().subscribe(cats => {
            this.allCategoriesForSelect = cats;
        });
    }

    changePage(newPage: number) {
        this.page = newPage;
        this.loadCategories();
    }

    openModal() {
        this.isEditing = false;
        this.currentCategory = { name: '', description: '', parentId: undefined, active: true };
        this.parentSearch = '';
        this.showModal = true;
    }

    openEditModal(category: Category) {
        this.isEditing = true;
        this.currentCategory = { ...category };
        this.parentSearch = category.parentId ? this.getCategoryName(category.parentId) : '';
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.showParentDropdown = false;
    }

    // Autocomplete Logic
    get filteredParents() {
        return this.allCategoriesForSelect.filter(c =>
            c.id !== this.currentCategory.id && // Avoid self-parenting
            c.name.toLowerCase().includes(this.parentSearch.toLowerCase())
        );
    }

    selectParent(category: Category | null) {
        if (category) {
            this.currentCategory.parentId = category.id;
            this.parentSearch = category.name;
        } else {
            this.currentCategory.parentId = undefined;
            this.parentSearch = '';
        }
        this.showParentDropdown = false;
    }

    handleBlur() {
        // Delay to allow click event to register
        setTimeout(() => {
            this.showParentDropdown = false;
            // If text doesn't match a category, maybe clear or keep valid? 
            // For now let's keep it simple: if valid ID is set, keep name, else clear.
            if (this.currentCategory.parentId) {
                this.parentSearch = this.getCategoryName(this.currentCategory.parentId);
            } else {
                this.parentSearch = '';
            }
        }, 200);
    }

    saveCategory() {
        if (this.currentCategory.name) {
            this.categoryService.createCategory(this.currentCategory as Category).subscribe({
                next: (res) => {
                    this.loadCategories(); // Refresh grid
                    this.loadAllForSelect();
                    this.snackbar.show(this.isEditing ? 'Category updated successfully' : 'Category created successfully', 'success');
                },
                error: (err) => {
                    console.error(err);
                    this.snackbar.show('Failed to save category', 'error');
                }
            });
            this.closeModal();
            this.showParentDropdown = false;
        }
    }

    initDelete(category: Category) {
        this.itemToDelete = category;
    }

    confirmDelete() {
        if (this.itemToDelete && this.itemToDelete.id) {
            this.categoryService.deleteCategory(this.itemToDelete.id).subscribe({
                next: () => {
                    this.loadCategories(); // Refresh grid
                    this.loadAllForSelect();
                    this.snackbar.show('Category deleted successfully', 'success');
                },
                error: (err) => {
                    console.error(err);
                    this.snackbar.show('Failed to delete category', 'error');
                }
            });
            this.itemToDelete = null;
        }
    }

    getCategoryName(id: string): string {
        const cat = this.allCategoriesForSelect.find(c => c.id === id);
        return cat ? cat.name : 'Unknown';
    }
}
