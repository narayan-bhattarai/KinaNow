import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-inventory',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-800">Inventory Management</h1>
          <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Sync Stock
          </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
               <p class="text-gray-500 text-sm font-medium">In Stock Items</p>
               <h3 class="text-2xl font-bold text-gray-800">1,245</h3>
           </div>
           <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
               <p class="text-gray-500 text-sm font-medium">Low Stock Alerts</p>
               <h3 class="text-2xl font-bold text-gray-800">12</h3>
           </div>
           <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
               <p class="text-gray-500 text-sm font-medium">Out of Stock</p>
               <h3 class="text-2xl font-bold text-gray-800">5</h3>
           </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Stock Movement</h3>
          <p class="text-gray-500 text-sm italic">Stock history visualization coming soon...</p>
      </div>
    </div>
  `
})
export class InventoryComponent { }
