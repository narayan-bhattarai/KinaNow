import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message$ | async as msg" 
         class="fixed bottom-5 right-5 px-6 py-3 rounded shadow-lg text-white z-[9999] transition-all transform animate-in slide-in-from-bottom duration-300"
         [ngClass]="{
           'bg-green-600': msg.type === 'success',
           'bg-red-600': msg.type === 'error',
           'bg-blue-600': msg.type === 'info'
         }">
      {{ msg.text }}
    </div>
  `
})
export class SnackbarComponent {
  private snackbarService = inject(SnackbarService);
  message$ = this.snackbarService.message$;
}
