import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientPaymentService } from '../../services/client-payment.service';
import { PaymentMethod } from '../../models/payment-method';

@Component({
    selector: 'app-admin-payment',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="px-6 py-8">
      <h2 class="text-2xl font-bold mb-6">Manage Payment Methods</h2>
      
      <!-- Add New Method Form -->
      <div class="bg-white p-6 rounded-lg shadow mb-8">
        <h3 class="text-lg font-semibold mb-4">Add New Method</h3>
        <form (ngSubmit)="addMethod()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" [(ngModel)]="newMethod.name" name="name" class="mt-1 w-full border rounded px-3 py-2" placeholder="e.g. PayPal" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <input type="text" [(ngModel)]="newMethod.type" name="type" class="mt-1 w-full border rounded px-3 py-2" placeholder="e.g. WALLET" required>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <input type="text" [(ngModel)]="newMethod.description" name="description" class="mt-1 w-full border rounded px-3 py-2">
          </div>
          <div class="flex items-center">
             <input type="checkbox" [(ngModel)]="newMethod.enabled" name="enabled" class="h-4 w-4 text-blue-600 rounded">
             <label class="ml-2 block text-sm text-gray-900">Enabled</label>
          </div>
          <div class="md:col-span-2">
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Method</button>
          </div>
        </form>
      </div>

      <!-- List Methods -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let method of methods">
              <td class="px-6 py-4 whitespace-nowrap">{{ method.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ method.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                      [ngClass]="method.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ method.enabled ? 'Active' : 'Disabled' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ method.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminPaymentComponent implements OnInit {
    private paymentService = inject(ClientPaymentService);

    methods: PaymentMethod[] = [];
    newMethod: PaymentMethod = {
        name: '',
        type: '',
        enabled: true,
        description: ''
    };

    ngOnInit() {
        this.loadMethods();
    }

    loadMethods() {
        this.paymentService.getAllMethods().subscribe(data => this.methods = data);
    }

    addMethod() {
        this.paymentService.addMethod(this.newMethod).subscribe(() => {
            this.loadMethods();
            this.newMethod = { name: '', type: '', enabled: true, description: '' }; // Reset
        });
    }
}
