import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router'; // Import Router
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <div class="h-full w-64 bg-white text-slate-600 flex flex-col border-r border-slate-100 font-sans shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      
      <!-- Brand Header: Pro-Compact Fit -->
      <div class="flex items-center justify-center pt-6 pb-4 px-2 border-b border-slate-50">
          <img src="assets/logo-full.png" alt="KinaNow" 
               class="w-full h-auto object-contain transition-transform duration-500 hover:scale-[1.01]">
      </div>

      <nav class="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
        
        <!-- Dashboard Link -->
        <a routerLink="/admin/dashboard" routerLinkActive="bg-blue-50 text-blue-600 font-black" 
           class="flex items-center px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-all group">
            <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="text-[11px] font-bold uppercase tracking-wider">Dashboard</span>
        </a>

        <ng-container *ngIf="currentUser$ | async as user">
             <!-- Cast user to valid type or check role safely. For now assume user has role property -->
             <ng-container *ngIf="user && (user.role === 'ADMIN' || user.role === 'MERCHANT')">
                
                <a routerLink="/admin/analytics" routerLinkActive="bg-blue-50 text-blue-600 font-black" 
                   class="flex items-center px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-all group">
                    <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    <span class="text-[11px] font-bold uppercase tracking-wider">Analytics</span>
                </a>

                <!-- Catalog Menu -->
                <div class="mt-2 text-slate-300">
                    <button (click)="isCatalogMenuOpen = !isCatalogMenuOpen" 
                            class="w-full flex items-center justify-between px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-all group">
                        <div class="flex items-center">
                             <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                             <span class="text-[11px] font-bold uppercase tracking-wider">Catalog</span>
                        </div>
                        <svg class="w-3 h-3 transition-transform duration-300 text-slate-300" [class.rotate-180]="isCatalogMenuOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div *ngIf="isCatalogMenuOpen" class="pl-12 pr-4 space-y-0 mt-0.5 animate-fade-in-down">
                        <a routerLink="/admin/products" routerLinkActive="text-blue-600 font-black" class="block py-1.5 text-[10px] uppercase font-black text-slate-400 hover:text-blue-600 transition-all">Products</a>
                        <a routerLink="/admin/categories" routerLinkActive="text-blue-600 font-black" class="block py-1.5 text-[10px] uppercase font-black text-slate-400 hover:text-blue-600 transition-all">Categories</a>
                        <a routerLink="/admin/inventory" routerLinkActive="text-blue-600 font-black" class="block py-1.5 text-[10px] uppercase font-black text-slate-400 hover:text-blue-600 transition-all">Inventory</a>
                    </div>
                </div>

                <!-- Sales Menu -->
                <div class="mt-1">
                    <button (click)="isSalesMenuOpen = !isSalesMenuOpen" 
                            class="w-full flex items-center justify-between px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-all group">
                        <div class="flex items-center">
                             <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             <span class="text-[11px] font-bold uppercase tracking-wider">Sales</span>
                        </div>
                        <svg class="w-3 h-3 transition-transform duration-300 text-slate-300" [class.rotate-180]="isSalesMenuOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div *ngIf="isSalesMenuOpen" class="pl-12 pr-4 space-y-0 mt-0.5">
                        <a routerLink="/admin/orders" routerLinkActive="text-blue-600 font-black" class="block py-1.5 text-[10px] uppercase font-black text-slate-400 hover:text-blue-600 transition">Orders</a>
                        <a routerLink="/admin/offers" routerLinkActive="text-blue-600 font-black" class="block py-1.5 text-[10px] uppercase font-black text-slate-400 hover:text-blue-600 transition">Offers</a>
                    </div>
                </div>

                <!-- Users Menu -->
                <div class="mt-1">
                    <button (click)="isUsersMenuOpen = !isUsersMenuOpen" 
                            class="w-full flex items-center justify-between px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-all group">
                        <div class="flex items-center">
                             <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                             <span class="text-[11px] font-bold uppercase tracking-wider">Users</span>
                        </div>
                        <svg class="w-3 h-3 transition-transform duration-300 text-slate-300" [class.rotate-180]="isUsersMenuOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div *ngIf="isUsersMenuOpen" class="pl-12 pr-4 space-y-0 mt-0.5">
                        <a routerLink="/admin/users/staff" routerLinkActive="text-blue-600 font-black" class="block py-1.5 text-[10px] uppercase font-black text-slate-400 hover:text-blue-600 transition">Staff</a>
                        <a routerLink="/admin/users/customers" routerLinkActive="text-blue-600 font-black" class="block py-1.5 text-[10px] uppercase font-black text-slate-400 hover:text-blue-600 transition">Customers</a>
                    </div>
                </div>

                <!-- Settings Menu -->
                <div class="mt-1">
                     <a routerLink="/admin/settings" routerLinkActive="bg-blue-50 text-blue-600 font-black"
                        class="flex items-center px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-all group">
                        <svg class="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span class="text-[11px] font-bold uppercase tracking-wider">Settings</span>
                    </a>
                </div>

             </ng-container>
        </ng-container>
      </nav>

      <!-- Logout Section -->
      <div class="p-4 border-t border-slate-50">
         <button (click)="logout()" 
                 class="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-300 text-[11px] font-black uppercase tracking-widest active:scale-95 shadow-sm shadow-red-100">
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
         </button>
      </div>
    </div>
  `
})
export class SidebarComponent implements OnInit {
    authService = inject(AuthService);
    private router = inject(Router); // Inject Router
    currentUser$ = this.authService.currentUser$;

    // Menu States
    isCatalogMenuOpen = false;
    isSalesMenuOpen = false;
    isUsersMenuOpen = false;
    isConfigMenuOpen = false;

    ngOnInit() {
        this.currentUser$.subscribe(user => console.log('Sidebar User:', user));
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
