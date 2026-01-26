import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center" style="background-image: url('assets/login-bg.png');">
      <div class="px-8 py-6 text-left bg-white shadow-lg rounded-lg w-full max-w-md opacity-95">
        <div class="flex justify-center mb-4">
            <img src="assets/logo.png" alt="KinaNow" class="h-16 w-auto">
        </div>
        <h3 class="text-2xl font-bold text-center">Create Account</h3>
        <div *ngIf="returnUrl" class="bg-blue-50 text-blue-700 p-3 rounded-md text-sm mt-4 text-center">
             Create an account to continue.
        </div>
        <form (ngSubmit)="onRegister()">
          <div class="mt-4 space-y-4">
             <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700">First Name</label>
                  <input type="text" [(ngModel)]="user.firstname" name="firstname" class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700">Last Name</label>
                  <input type="text" [(ngModel)]="user.lastname" name="lastname" class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
                </div>
             </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-700" for="email">Email</label>
              <input type="email" id="email" [(ngModel)]="user.email" name="email"
                class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
            </div>
            
            <div>
              <label class="block text-sm font-bold text-gray-700">Password</label>
              <input type="password" [(ngModel)]="user.password" name="password"
                class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
            </div>

            <div class="flex items-baseline justify-between mt-6">
              <button [disabled]="loading" class="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900 disabled:opacity-70 disabled:cursor-not-allowed">
                  {{ loading ? 'Creating...' : 'Register' }}
              </button>
              <a href="#" routerLink="/login" [queryParams]="{ returnUrl: returnUrl }" class="text-sm text-blue-600 hover:underline">Already have an account?</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackbar = inject(SnackbarService);

  user = { firstname: '', lastname: '', email: '', password: '' };
  loading = false;
  returnUrl = '';

  constructor() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  onRegister() {
    if (!this.user.email || !this.user.password) {
      this.snackbar.show('Please fill all fields', 'error');
      return;
    }

    this.loading = true;
    this.authService.register(this.user).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.snackbar.show('Account created successfully!', 'success');

        this.cartService.mergeGuestCart();

        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.snackbar.show('Registration failed', 'error');
      }
    });
  }
}
