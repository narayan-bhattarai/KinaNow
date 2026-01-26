import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
    selector: 'app-account-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="max-w-2xl">
        <h1 class="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Profile</h1>
        <p class="text-slate-500 text-sm font-bold uppercase tracking-widest mb-10">Manage your personal information</p>

        <div class="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-slate-100">
            <div class="space-y-6">
                <div class="flex gap-6">
                    <div class="w-full">
                        <label class="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                        <input type="text" [(ngModel)]="user.full_name" class="w-full h-12 px-4 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-colors">
                    </div>
                </div>
                 <div>
                    <label class="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" [value]="user.email" disabled class="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 font-bold text-slate-500 cursor-not-allowed">
                     <p class="text-[10px] text-slate-400 mt-2 font-bold">Email cannot be changed</p>
                </div>
                 <div>
                    <label class="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                    <input type="tel" [(ngModel)]="user.phone" placeholder="+977" class="w-full h-12 px-4 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-blue-500 transition-colors">
                </div>

                <div class="pt-6 border-t border-slate-50">
                    <button (click)="save()" class="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-black transition-all active:scale-95">Save Changes</button>
                </div>
            </div>
        </div>
    </div>
  `
})
export class AccountProfileComponent {
    private authService = inject(AuthService);
    private snackbar = inject(SnackbarService);

    user: any = {
        full_name: '',
        email: '',
        phone: ''
    };

    constructor() {
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
            this.user.full_name = currentUser.full_name;
            // Mock data for demo
            this.user.email = 'user' + currentUser.user_id + '@example.com';
            this.user.phone = '+977 9800000000';
        }
    }

    save() {
        this.snackbar.show('Profile updated successfully', 'success');
        // logic to call backend API would go here
    }
}
