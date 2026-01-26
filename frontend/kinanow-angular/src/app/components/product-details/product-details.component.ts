import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, PriceHistory } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { SnackbarService } from '../../services/snackbar.service';
import { UiAnimationService } from '../../services/ui-animation.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  private snackbar = inject(SnackbarService);
  private uiAnimation = inject(UiAnimationService);

  product: Product | null = null;
  similarProducts: Product[] = [];
  categories: Category[] = [];
  priceHistory: PriceHistory[] = [];
  quantity = 1;
  loading = true;
  Math = Math;

  // Chart State
  chartPath = '';
  chartPoints: { x: number, y: number, price: number, date: string }[] = [];

  viewGraph = false;

  ngOnInit() {
    // Load Categories for name resolution
    this.categoryService.getAllCategories().subscribe(cats => {
      this.categories = cats;
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        // Reset View State on ID change
        this.viewGraph = false;
        window.scrollTo(0, 0);

        this.loadProduct(id);
        this.loadHistory(id);

        // LIVE SYNC: Listen for updates to the global product list
        this.productService.products$.subscribe(products => {
          const updated = products.find(p => String(p.id) === String(id));
          if (updated) {
            // Preserve local state like quantity, but update fields
            this.product = { ...updated };
          }
        });
      }
    });
  }

  loadProduct(id: string) {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (p) => {
        this.product = p;
        this.loading = false;
        if (p.category) {
          this.loadSimilarProducts(p.category, p.id || '');
        }
      },
      error: () => {
        this.snackbar.show('Product not found', 'error');
        this.loading = false;
        this.router.navigate(['/']);
      }
    });
  }

  loadHistory(id: string) {
    this.productService.getPriceHistory(id).subscribe({
      next: (h) => {
        this.priceHistory = h;
        this.priceHistory = h;
        // Don't generate chart immediately - wait for user toggle
      }
    });
  }

  loadSimilarProducts(categoryId: string, currentId: string) {
    // Fetch first 5 and filter current out to get roughly 4
    this.productService.getPaginatedProducts(0, 5, categoryId).subscribe({
      next: (data) => {
        this.similarProducts = data.content.filter((p: Product) => String(p.id) !== String(currentId)).slice(0, 4);
      }
    });
  }

  addToCart(event?: MouseEvent) {
    if (!this.product || !this.product.id) return;

    // Trigger visual animation if event exists
    if (event) {
      this.uiAnimation.flyToCart(event, this.product.imageUrl || '');
    }

    this.cartService.addToCart({
      productId: this.product.id,
      skuCode: this.product.model || this.product.name.substring(0, 5),
      quantity: this.quantity,
      price: this.product.price,
      productName: this.product.name,
      imageUrl: this.product.imageUrl,
      merchantId: this.product.merchantId
    }).subscribe({
      next: () => {
        this.snackbar.show('Added to cart', 'success');
      },
      error: (err) => {
        console.error(err);
        this.snackbar.show('Failed to add to cart. Please login.', 'error');
      }
    });
  }

  buyNow(event?: MouseEvent) {
    this.addToCart(event);
    this.router.navigate(['/cart']);
  }

  generateChart() {
    if (!this.priceHistory || this.priceHistory.length === 0) {
      this.chartPath = '';
      this.chartPoints = [];
      return;
    }

    const prices = this.priceHistory.map(h => h.price);
    const minPrice = Math.min(...prices) * 0.9;
    const maxPrice = Math.max(...prices) * 1.1;
    const width = 600; // Wider for page
    const height = 250;
    const padding = 30;

    const count = this.priceHistory.length;

    this.chartPoints = this.priceHistory.map((h, index) => {
      const x = count > 1 ? padding + (index / (count - 1)) * (width - 2 * padding) : width / 2;
      const normalizedPrice = (h.price - minPrice) / (maxPrice - minPrice);
      const y = height - (padding + normalizedPrice * (height - 2 * padding));
      return { x, y, price: h.price, date: h.changedAt };
    });

    if (this.chartPoints.length > 1) {
      this.chartPath = 'M' + this.chartPoints.map(p => `${p.x},${p.y}`).join(' L');
    } else if (this.chartPoints.length === 1) {
      const p = this.chartPoints[0];
      this.chartPath = `M${p.x - 5},${p.y} L${p.x + 5},${p.y}`;
    }
  }

  togglePriceHistory() {
    this.viewGraph = !this.viewGraph;
    console.log('Toggle Graph:', this.viewGraph);
    if (this.viewGraph && (!this.chartPoints || this.chartPoints.length === 0)) {
      this.generateChart();
    }
  }

  incrementQuantity() {
    const max = (this.product?.stock) ? this.product.stock : 99;
    this.quantity = Math.min(max, this.quantity + 1);
  }

  decrementQuantity() {
    this.quantity = Math.max(1, this.quantity - 1);
  }

  getCategoryName(id: any): string {
    if (!id) return 'Product';
    const cat = this.categories.find(c => c.id == id);
    return cat ? cat.name : 'Category';
  }

  getSpecificationsArray() {
    if (!this.product) return [];

    const specsArr: any[] = [];

    // Explicitly add Model if not already in specifications
    if (this.product.model) {
      specsArr.push({ key: 'Model', value: this.product.model });
    }

    let specs = this.product.specifications;
    if (typeof specs === 'string') {
      try { specs = JSON.parse(specs); } catch (e) { specs = {}; }
    }

    if (specs && typeof specs === 'object') {
      Object.entries(specs).forEach(([key, value]) => {
        // Skip if key is 'model' (already handled)
        if (key.toLowerCase() === 'model' || !value) return;

        specsArr.push({
          key: key.charAt(0).toUpperCase() + key.slice(1),
          value
        });
      });
    }

    return specsArr;
  }
}
