import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService, Cart } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-mesh min-h-screen py-6">
      <div class="container mx-auto px-4 lg:px-10">
        <!-- HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <span class="text-[7px] font-black text-blue-600 uppercase tracking-[0.3em] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50">bag</span>
            <h1 class="text-lg md:text-xl font-black text-slate-950 mt-2 tracking-tighter">Review Selection</h1>
          </div>
          <div class="flex items-center space-x-6">
            <div class="flex flex-col text-right">
                <span class="text-[6px] font-black text-slate-400 uppercase tracking-widest">Bag Identity</span>
                <span class="text-[8px] font-black text-slate-900 mt-1">Node #{{ (cart?.id?.toString() || '---').slice(0,8) }}</span>
            </div>
          </div>
        </div>
        
        <!-- EMPTY STATE -->
        <div *ngIf="!cart || cart.items.length === 0" class="bg-white rounded-[32px] card-shadow border border-slate-100 p-16 text-center">
            <div class="w-20 h-20 bg-slate-50 rounded-[24px] flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                <svg class="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </div>
            <h2 class="text-xl font-black text-slate-900 mb-4 tracking-tighter">Your bag is currently empty</h2>
            <p class="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-8">Explore our curated global inventory</p>
            <a routerLink="/" class="inline-flex items-center justify-center bg-slate-950 text-white h-14 px-10 rounded-xl text-[10px] uppercase font-black tracking-widest">Continue Discovery</a>
        </div>

        <!-- CART CONTENT -->
        <div *ngIf="cart && cart.items.length > 0" class="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <!-- Main List -->
          <div class="xl:col-span-8 space-y-4">
            <div *ngFor="let item of cart.items" class="bg-white rounded-[32px] card-shadow border border-slate-100 p-6 flex flex-col lg:flex-row items-center gap-6 group hover:border-blue-100 transition-all duration-700 relative">
                
                <!-- Remove Button (Top Right) -->
                <button (click)="removeItem(item.id)" class="absolute top-4 right-4 p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 active:scale-95 shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>

                <!-- Image -->
                <div class="w-24 h-24 md:w-32 md:h-32 bg-slate-50 group-hover:bg-white rounded-2xl flex items-center justify-center p-4 transition-all duration-700 relative border border-slate-50 group-hover:border-slate-100/50 cursor-pointer"
                     [routerLink]="['/shop', item.productId]">
                    <img [src]="item.imageUrl || 'assets/placeholder.png'" class="max-h-full max-w-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-700" alt="">
                </div>

                <!-- Info -->
                <div class="flex-1 text-center lg:text-left">
                    <span class="text-[7px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1 block">{{ item.skuCode }}</span>
                    <h3 class="text-sm md:text-base font-black text-slate-950 mb-2 tracking-tighter leading-tight group-hover:text-blue-600 transition-colors cursor-pointer" [routerLink]="['/shop', item.productId]">{{ item.productName || 'Premium Article' }}</h3>
                    
                    <div class="flex flex-col lg:flex-row items-center lg:items-center gap-4">
                        <!-- Quantity Selector -->
                        <div class="flex items-center bg-slate-50 border border-slate-200 p-0.5 rounded-lg w-fit shadow-sm">
                            <button (click)="updateQuantity(item.id, item.quantity - 1)" 
                                    [disabled]="item.quantity <= 1 || isLoading(item.id)" 
                                    class="w-8 h-8 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-100 rounded-md transition text-slate-900 font-extrabold text-lg disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 shadow-sm z-20 relative">
                                <span *ngIf="!isLoading(item.id)">−</span>
                                <span *ngIf="isLoading(item.id)" class="animate-spin h-3 w-3 border-2 border-slate-900 border-t-transparent rounded-full"></span>
                            </button>
                            <span class="px-4 text-xs font-black text-slate-900 tracking-tighter w-8 text-center">{{ item.quantity }}</span>
                            <button (click)="updateQuantity(item.id, item.quantity + 1)" 
                                    [disabled]="isLoading(item.id)"
                                    class="w-8 h-8 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-100 rounded-md transition text-slate-900 font-extrabold text-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 shadow-sm z-20 relative">
                                <span *ngIf="!isLoading(item.id)">+</span>
                                <span *ngIf="isLoading(item.id)" class="animate-spin h-3 w-3 border-2 border-slate-900 border-t-transparent rounded-full"></span>
                            </button>
                        </div>
                        
                        <div class="flex items-center gap-3">
                            <span class="px-2 py-0.5 rounded-md bg-slate-50 text-[8px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">Standard Delivery</span>
                            <span class="text-slate-900 text-[9px] font-black tracking-tight">{{ item.price | currency }} / unit</span>
                        </div>
                    </div>
                </div>

                <!-- Total -->
                <div class="lg:text-right flex lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto border-t lg:border-t-0 border-slate-50 pt-4 lg:pt-0">
                    <div class="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Extended Total</div>
                    <div class="text-xl font-black text-slate-950 tracking-tighter transition-colors group-hover:text-blue-600">{{ (item.price * item.quantity) | currency }}</div>
                </div>
            </div>
          </div>

          <!-- Summary Sidebar -->
          <div class="xl:col-span-4">
            <div class="bg-slate-950 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden border border-slate-900/50">
                <div class="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
                <h3 class="text-sm font-bold uppercase tracking-[0.15em] mb-8 text-slate-200">Order Synthesis</h3>
                
                <div class="space-y-4 mb-8">
                    <div class="flex justify-between items-center group/sub">
                        <span class="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Subtotal</span>
                        <span class="text-sm font-bold text-white tracking-tight font-mono">{{ cart.total | currency }}</span>
                    </div>
                    <div class="flex justify-between items-center group/log">
                        <span class="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Logistics</span>
                        <span class="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Free</span>
                    </div>
                </div>

                <div class="border-t border-white/5 pt-8 mb-8 flex justify-between items-end">
                    <div>
                        <div class="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Total</div>
                        <div class="text-2xl font-bold font-mono text-white tracking-tight">{{ cart.total | currency }}</div>
                    </div>
                </div>

                <div class="space-y-4">
                    <button (click)="proceedToCheckout()" class="w-full bg-blue-600 text-white h-10 rounded-md text-[9px] font-black uppercase tracking-[0.25em] hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/30 transition-all active:scale-[0.98]">
                        Pay
                    </button>
                    <p class="text-center text-[7px] font-black text-slate-600 uppercase tracking-[0.2em] mt-4">SSL Encrypted Transaction &bull; PCI DSS Compliant</p>
                </div>
        </div>
      </div>
    </div>
  </div>
</div>

  `
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackbar = inject(SnackbarService);
  cart: Cart | null = null;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (data) => this.cart = data,
      error: (err) => console.error('Failed to load cart', err)
    });
  }

  proceedToCheckout() {
    if (!this.authService.isAuthenticated()) {
      this.snackbar.show('Please login to checkout', 'info');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  loadingItems = new Set<string>();

  isLoading(id: string | number): boolean {
    return this.loadingItems.has(String(id));
  }

  updateQuantity(productId: string | number, quantity: number) {
    const pId = String(productId);
    if (quantity < 1 || this.loadingItems.has(pId)) return;

    this.loadingItems.add(pId);
    console.log('Updating quantity for:', pId, 'to', quantity);

    this.cartService.updateQuantity(productId, quantity).subscribe({
      next: () => {
        this.loadCart();
        this.loadingItems.delete(pId);
        console.log('Update success, set unlocked for:', pId);
      },
      error: (e) => {
        console.error('Update failed', e);
        this.loadingItems.delete(pId);
      }
    });

    // Failsafe: Unlock after 2 seconds regardless of response to prevent freezing
    setTimeout(() => {
      if (this.loadingItems.has(pId)) {
        console.warn('Failsafe unlocking:', pId);
        this.loadingItems.delete(pId);
      }
    }, 2000);
  }

  removeItem(productId: string | number) {
    this.cartService.removeItem(productId).subscribe({
      next: () => this.loadCart()
    });
  }
}
