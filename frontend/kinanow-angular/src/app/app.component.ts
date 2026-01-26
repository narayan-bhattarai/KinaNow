import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, SnackbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'kinanow-client';
  authService = inject(AuthService);
  cartService = inject(CartService);
  router = inject(Router);
  currentUser$ = this.authService.currentUser$;
  cartCount$ = this.cartService.cartCount$;
  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  get showNavbar(): boolean {
    return this.router.url !== '/login' && this.router.url !== '/register';
  }

  logout() {
    this.authService.logout();
  }

  get role(): string | undefined {
    // Current user subject might only have minimal info, but verify actual object structure
    // We might need to extend what is stored or decoded.
    // For now assuming the stored object has 'role' property if updated.
    return (this.currentUser$ as any)?.source?._value?.role;
  }
}
