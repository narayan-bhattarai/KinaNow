import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';

export interface AuthenticationRequest {
    email?: string;
    password?: string;
}

export interface AuthenticationResponse {
    access_token: string;
    refresh_token: string;
    user_id: string;
    email: string;
    role: string;
    full_name: string;
    merchant_id?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = '/api/v1/auth';

    private currentUserSubject = new BehaviorSubject<AuthenticationResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor() {
        if (typeof localStorage !== 'undefined') {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                this.currentUserSubject.next(JSON.parse(storedUser));
            }
        }
    }

    login(credentials: AuthenticationRequest): Observable<AuthenticationResponse> {
        return this.http.post<AuthenticationResponse>(`${this.apiUrl}/authenticate`, credentials)
            .pipe(
                // timeout(2000), // Optional: timeout can be kept or removed if real backend might be slow
                tap(user => this.setSession(user))
            );
    }

    register(user: any): Observable<AuthenticationResponse> {
        return this.http.post<AuthenticationResponse>(`${this.apiUrl}/register`, user).pipe(
            tap(res => this.setSession(res))
        );
    }

    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }

    private setSession(user: AuthenticationResponse) {
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } catch (e) {
                console.error('Error saving to localStorage', e);
            }
        }
        this.currentUserSubject.next(user);
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    get currentUserId(): string | undefined {
        return this.currentUserSubject.value?.user_id;
    }

    get currentUserValue(): AuthenticationResponse | null {
        return this.currentUserSubject.value;
    }

    getUsers(merchantId?: string): Observable<any[]> {
        let url = `${this.apiUrl}/users`;
        if (merchantId) url += `?merchantId=${merchantId}`;
        return this.http.get<any[]>(url);
    }

    createUser(user: any): Observable<AuthenticationResponse> {
        return this.http.post<AuthenticationResponse>(`${this.apiUrl}/users`, user);
    }

    updateUser(id: string | number, user: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/users/${id}`, user);
    }

    deleteUser(id: string | number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/users/${id}`);
    }
}
