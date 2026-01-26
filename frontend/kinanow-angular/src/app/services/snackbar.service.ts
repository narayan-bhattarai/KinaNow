import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SnackbarMessage {
    text: string;
    type: 'success' | 'error' | 'info';
}

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private messageSubject = new BehaviorSubject<SnackbarMessage | null>(null);
    public message$ = this.messageSubject.asObservable();

    show(text: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
        this.messageSubject.next({ text, type });
        setTimeout(() => {
            this.messageSubject.next(null);
        }, duration);
    }
}
