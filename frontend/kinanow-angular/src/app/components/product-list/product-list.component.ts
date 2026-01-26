import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
    private productService = inject(ProductService);
    private cartService = inject(CartService);
    products$: Observable<Product[]> = this.productService.getAllProducts();

    addToCart(product: Product) {
        if (!product.id) return;
        this.cartService.addToCart({
            productId: product.id,
            quantity: 1,
            skuCode: 'SKU-' + product.id,
            price: product.price
        }).subscribe({
            next: () => alert('Added to cart!'),
            error: (err) => {
                console.error(err);
                alert('Failed to add to cart. Are you logged in?');
            }
        });
    }
}
