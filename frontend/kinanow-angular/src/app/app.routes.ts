import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderTrackingComponent } from './components/order-tracking/order-tracking.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'shop/:id', component: ProductDetailsComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'order-tracking/:id', component: OrderTrackingComponent },
    { path: 'cart', component: CartComponent },
    {
        path: 'account',
        canActivate: [authGuard],
        loadComponent: () => import('./components/account-layout/account-layout.component').then(m => m.AccountLayoutComponent),
        children: [
            { path: '', redirectTo: 'orders', pathMatch: 'full' },
            { path: 'orders', loadComponent: () => import('./components/customer-orders/customer-orders.component').then(m => m.CustomerOrdersComponent) },
            { path: 'profile', loadComponent: () => import('./components/account-profile/account-profile.component').then(m => m.AccountProfileComponent) },
            { path: 'wishlist', loadComponent: () => import('./components/account-wishlist/account-wishlist.component').then(m => m.AccountWishlistComponent) },
            { path: 'addresses', loadComponent: () => import('./components/account-profile/account-profile.component').then(m => m.AccountProfileComponent) }, // Reuse profile for now
        ]
    },
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },


    // Grouped Admin Routes
    {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
            { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
            { path: 'analytics', loadComponent: () => import('./components/analytics/analytics.component').then(m => m.AnalyticsComponent) },
            { path: 'products', loadComponent: () => import('./components/products-admin/products-admin.component').then(m => m.ProductsAdminComponent) },
            { path: 'add-product', loadComponent: () => import('./components/add-product/add-product.component').then(m => m.AddProductComponent) },
            { path: 'inventory', loadComponent: () => import('./components/inventory/inventory.component').then(m => m.InventoryComponent) },
            { path: 'categories', loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent) },

            // Specific User Routes
            { path: 'users/customers', loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent), data: { type: 'customer' } },
            { path: 'users/staff', loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent), data: { type: 'staff' } },

            // Placeholders for other sidebar items if they exist, else map to dashboard or relevant components
            { path: 'orders', loadComponent: () => import('./components/admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent) },
            { path: 'offers', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) }, // Placeholder
            { path: 'locations', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) }, // Placeholder
            { path: 'areas', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) }, // Placeholder
            { path: 'settings', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) }, // Placeholder

            // Payment Integration
            { path: 'payments', loadComponent: () => import('./components/admin-payment/admin-payment.component').then(m => m.AdminPaymentComponent) },
        ]
    },
];
