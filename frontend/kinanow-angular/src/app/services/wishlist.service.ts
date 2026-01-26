import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface WishlistItem {
    productId: string;
    productName: string;
    price: number;
    imageUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private itemsSubject = new BehaviorSubject<WishlistItem[]>([]);
    items$ = this.itemsSubject.asObservable();
    private STORAGE_KEY = 'kinanow_wishlist';

    constructor() {
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                this.itemsSubject.next(JSON.parse(stored));
            }
        }
    }

    addToWishlist(item: WishlistItem) {
        const current = this.itemsSubject.value;
        if (!current.find(i => i.productId === item.productId)) {
            const updated = [...current, item];
            this.updateState(updated);
        }
    }

    removeFromWishlist(productId: string) {
        const current = this.itemsSubject.value;
        const updated = current.filter(i => i.productId !== productId);
        this.updateState(updated);
    }

    isInWishlist(productId: string): boolean {
        return !!this.itemsSubject.value.find(i => i.productId === productId);
    }

    private updateState(items: WishlistItem[]) {
        this.itemsSubject.next(items);
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        }
    }
}
