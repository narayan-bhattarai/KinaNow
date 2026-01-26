import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-account-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-slate-200 hidden md:block">
        <div class="p-8">
            <h2 class="text-xl font-black text-slate-900 tracking-tighter">My Account</h2>
        </div>
        <nav class="group px-4 space-y-2">
            <a routerLink="/account/orders" routerLinkActive="bg-slate-50 text-blue-600" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-500 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <span>📦</span> Orders
            </a>
            <a routerLink="/account/wishlist" routerLinkActive="bg-slate-50 text-blue-600" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-500 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <span>❤️</span> Wishlist
            </a>
            <a routerLink="/account/profile" routerLinkActive="bg-slate-50 text-blue-600" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-500 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <span>👤</span> Profile
            </a>
             <a routerLink="/account/addresses" routerLinkActive="bg-slate-50 text-blue-600" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-500 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <span>📍</span> Addresses
            </a>
            <div class="pt-8 mt-8 border-t border-slate-100">
                <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 rounded-xl hover:bg-rose-50 transition-colors text-left">
                    <span>🚪</span> Logout
                </button>
            </div>
        </nav>
      </aside>

      <!-- Mobile Nav Header -->
      
      <!-- Main Content -->
      <main class="flex-1 p-6 md:p-12 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AccountLayoutComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
