import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService, WishlistItem } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
    selector: 'app-account-wishlist',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div>
        <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Your Wishlist</h1>
        <p class="text-slate-500 text-sm font-bold uppercase tracking-widest mb-10">Saved items for later</p>

        <div *ngIf="(wishlistService.items$ | async)?.length === 0" class="bg-white rounded-[32px] p-16 text-center shadow-sm border border-slate-100">
             <div class="text-6xl mb-6 opacity-20">❤️</div>
             <h2 class="text-xl font-bold text-slate-900 mb-4">Your wishlist is empty</h2>
             <a routerLink="/" class="inline-block px-8 py-4 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-black transition-all">Explore Products</a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let item of wishlistService.items$ | async" class="bg-white rounded-[24px] p-4 border border-slate-100 group hover:shadow-xl transition-all">
                <div class="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center relative overflow-hidden mb-4">
                     <img [src]="item.imageUrl || 'assets/placeholder.png'" class="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700">
                     <button (click)="wishlistService.removeFromWishlist(item.productId)" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-rose-500 flex items-center justify-center hover:bg-rose-50 transition-colors shadow-sm">
                        ✕
                     </button>
                </div>
                <div class="px-2 pb-2">
                    <h3 class="font-bold text-slate-900 mb-1 truncate">{{ item.productName }}</h3>
                    <div class="flex items-center justify-between mt-4">
                        <span class="text-lg font-black text-slate-900">{{ item.price | currency }}</span>
                        <button (click)="addToCart(item)" class="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class AccountWishlistComponent {
    wishlistService = inject(WishlistService);
    private cartService = inject(CartService);
    private snackbar = inject(SnackbarService);

    addToCart(item: WishlistItem) {
        this.cartService.addToCart({
            productId: item.productId,
            quantity: 1,
            skuCode: item.productName.slice(0, 3).toUpperCase() + '-' + item.productId,
            price: item.price,
            productName: item.productName,
            imageUrl: item.imageUrl
        }).subscribe(() => {
            this.snackbar.show('Moved to cart', 'success');
            this.wishlistService.removeFromWishlist(item.productId);
        });
    }
}
