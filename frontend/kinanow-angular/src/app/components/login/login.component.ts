import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService, AuthenticationRequest } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center" style="background-image: url('assets/login-bg.png');">
      <div class="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-md opacity-95">
        <div class="flex justify-center mb-4">
            <img src="assets/logo.png" alt="KinaNow" class="h-16 w-auto">
        </div>
        <h3 class="text-2xl font-bold text-center">Login to your account</h3>
        <div *ngIf="returnUrl" class="bg-blue-50 text-blue-700 p-3 rounded-md text-sm mt-4 text-center">
            Please sign in to complete your action.
        </div>
        <form (ngSubmit)="onLogin()">
          <div class="mt-4">
            <div class="mt-4">
              <label class="block" for="email">Email</label>
              <input type="text" placeholder="Email" id="email" [(ngModel)]="credentials.email" name="email"
                class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
            </div>
            <div class="mt-4">
              <label class="block">Password</label>
              <input type="password" placeholder="Password" [(ngModel)]="credentials.password" name="password"
                class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600">
            </div>
            <div class="flex items-baseline justify-between">
              <button [disabled]="loading" class="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 disabled:opacity-70 disabled:cursor-not-allowed">
                  {{ loading ? 'Logging in...' : 'Login' }}
              </button>
              <a href="#" routerLink="/register" [queryParams]="{ returnUrl: returnUrl }" class="text-sm text-blue-600 hover:underline">Create Account</a>
            </div>
            <div *ngIf="error" class="text-red-500 mt-2">
                {{ error }}
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackbarService = inject(SnackbarService);

  credentials: AuthenticationRequest = { email: '', password: '' };
  error = '';
  loading = false;
  returnUrl = '';

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  onLogin() {
    this.loading = true;
    this.error = '';
    this.authService.login(this.credentials).subscribe({
      next: (user) => {
        this.loading = false;
        if (user) {
          this.snackbarService.show('Login successful!', 'success');

          // Merge Guest Cart
          this.cartService.mergeGuestCart();

          // Redirect
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else if (user.role === 'ADMIN' || user.role === 'MERCHANT') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        }
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'Login failed. Please check your credentials.';
        this.snackbarService.show('Login failed', 'error');
      }
    });
  }
}
