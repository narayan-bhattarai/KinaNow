import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { OnInit } from '@angular/core';

interface User {
  id: string | number; // Support UUIDs
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 bg-gray-50 min-h-screen font-sans">
      <!-- Header with Add Button -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">{{ pageTitle }}</h1>
        <button *ngIf="currentFilter !== 'customer'" (click)="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm">
            <span class="mr-2 text-xl font-bold">+</span> Add User
        </button>
      </div>

      <!-- Users Grid/Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let user of users" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {{ getInitials(user.name) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.role }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [ngClass]="user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <ng-container *ngIf="currentFilter !== 'customer'">
                    <button (click)="editUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button (click)="deleteUser(user)" class="text-red-600 hover:text-red-900">Delete</button>
                </ng-container>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add User Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="closeModal()"></div>

        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {{ isEditing ? 'Edit User' : 'Add New User' }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" [(ngModel)]="newUser.fullName" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" [(ngModel)]="newUser.email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Role</label>
                        <select [(ngModel)]="newUser.role" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white text-gray-900 appearance-auto">
                            <option value="" disabled selected class="text-gray-400">Select a Role</option>
                            <option *ngFor="let role of roleOptions" [value]="role" class="text-gray-900 bg-white">{{ role }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" [(ngModel)]="newUser.password" placeholder="{{ isEditing ? 'Leave blank to keep current' : '' }}" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" (click)="saveUser()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                {{ isEditing ? 'Update User' : 'Add User' }}
              </button>
              <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private snackbar = inject(SnackbarService);

  showModal = false;
  showDeleteModal = false;
  userToDelete: User | null = null;

  isEditing = false;
  currentUserId: string | number | null = null;
  currentFilter = 'all';

  // Displayed users
  allUsers: User[] = [];

  // Displayed users
  users: User[] = [];

  pageTitle = 'Users Management';

  newUser: any = {
    fullName: '',
    email: '',
    password: '',
    role: 'MERCHANT', // Default to valid option
    merchantId: null
  };

  debugRole: string | undefined = ''; // Debug

  roleOptions: string[] = [];

  ngOnInit() {
    // Read the type from the route data (defined in app.routes.ts)
    this.route.data.subscribe(data => {
      if (data['type']) {
        this.currentFilter = data['type'];
        // Update title based on filter
        if (this.currentFilter === 'staff') this.pageTitle = 'Staff Management';
        if (this.currentFilter === 'customer') this.pageTitle = 'Customer Management';
      }
      this.loadUsers();
    });
  }

  loadUsers() {
    const currentUser = this.authService.currentUserValue;
    const merchantId = currentUser?.role === 'MERCHANT' ? currentUser.merchant_id : undefined;

    this.authService.getUsers(merchantId).subscribe({
      next: (users) => {
        console.log('API returned users (RAW):', users);
        // Map backend User to frontend model
        this.allUsers = users.map(u => ({
          id: u.id,
          name: u.fullName || u.email, // Fallback if name is missing
          email: u.email,
          role: u.role,
          status: 'Active',
          merchantId: u.merchantId
        }));
        console.log('Mapped Users:', this.allUsers);
        this.filterUsers();
      },
      error: (err) => {
        console.error(err);
        this.snackbar.show('Failed to load users', 'error');
      }
    });
  }

  filterUsers() {
    if (this.currentFilter === 'staff') {
      this.users = this.allUsers.filter(u => ['Admin', 'Merchant', 'ADMIN', 'MERCHANT'].includes(u.role));
    } else if (this.currentFilter === 'customer') {
      this.users = this.allUsers.filter(u => ['Customer', 'CUSTOMER'].includes(u.role));
    } else {
      this.users = [...this.allUsers];
    }
  }

  // Prepares modal for adding new user
  openModal() {
    this.isEditing = false;
    this.currentUserId = null;
    this.showModal = true;
    this.initModalData();
    // Reset form
    this.newUser = {
      fullName: '',
      email: '',
      password: 'Password123!',
      role: this.roleOptions.length > 0 ? this.roleOptions[0] : '', // Default to first available option
      merchantId: this.authService.currentUserValue?.merchant_id
    };
  }

  // Prepares modal for editing existing user
  editUser(user: User) {
    this.isEditing = true;
    this.currentUserId = user.id;
    this.showModal = true;
    this.initModalData();
    // Populate form
    this.newUser = {
      fullName: user.name,
      email: user.email,
      password: '', // Empty to indicate no change unless typed
      role: user.role,
      merchantId: (user as any).merchantId
    };
  }

  deleteUser(user: User) {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.userToDelete) {
      this.authService.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          this.snackbar.show('User deleted successfully', 'success');
          this.loadUsers();
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error(err);
          this.snackbar.show('Failed to delete user', 'error');
        }
      });
    }
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  initModalData() {
    let currentUser = this.authService.currentUserValue;

    // RESTORED: Ensure we have fresh user data
    if (!currentUser && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('currentUser');
      if (stored) currentUser = JSON.parse(stored);
    }

    // Determine allowed roles
    let role = currentUser?.role;
    this.debugRole = role; // For UI debugging

    if (role === 'ADMIN' || role === 'Admin') {
      this.roleOptions = ['ADMIN', 'MERCHANT'];
    } else if (role === 'MERCHANT' || role === 'Merchant') {
      this.roleOptions = ['MERCHANT'];
    } else {
      // Fallback or unauthorized
      console.warn('Current user role not recognized for user creation:', role);
      this.roleOptions = [];
    }
    console.log('Role Options set to:', this.roleOptions);
  }

  closeModal() {
    this.showModal = false;
  }

  saveUser() {
    if (this.newUser.fullName && this.newUser.email) {
      if (this.isEditing && this.currentUserId) {
        // UPDATE
        this.authService.updateUser(this.currentUserId, this.newUser).subscribe({
          next: () => {
            this.snackbar.show('User updated successfully', 'success');
            this.loadUsers();
            this.closeModal();
          },
          error: (err) => {
            console.error(err);
            this.snackbar.show('Failed to update user', 'error');
          }
        });
      } else {
        // CREATE
        this.authService.createUser(this.newUser).subscribe({
          next: () => {
            this.snackbar.show('User added successfully', 'success');
            this.loadUsers();
            this.closeModal();
          },
          error: (err) => {
            console.error(err);
            this.snackbar.show('Failed to add user: ' + (err.error?.message || 'Unknown error'), 'error');
          }
        });
      }
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}
