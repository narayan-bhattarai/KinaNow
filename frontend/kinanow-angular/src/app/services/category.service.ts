import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Category {
    id?: string;
    name: string;
    description?: string;
    parentId?: string;
    ancestors?: string[]; // IDs of parents
    active: boolean;
    children?: Category[]; // Helper for UI tree structure
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private http = inject(HttpClient);
    private apiUrl = '/api/v1/categories';

    // State management for instant updates across components
    private categoriesSubject = new BehaviorSubject<Category[]>([]);
    public categories$ = this.categoriesSubject.asObservable();
    private loaded = false;

    constructor() {
        // Pure API mode
    }

    private resetToSeedData() {
        this.categoriesSubject.next([]);
    }

    getPaginatedCategories(page: number, size: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`).pipe(
            tap(response => {
                // Optional: Update local cache
            }),
            // Fallback for demo/offline
            catchError(err => {
                console.warn('Backend unavailable for pagination, using seed data');
                const all = this.categoriesSubject.value.length > 0 ? this.categoriesSubject.value : this.getSeedData();
                const start = page * size;
                const end = start + size;
                const content = all.slice(start, end);

                return of({
                    content: content,
                    totalElements: all.length,
                    totalPages: Math.ceil(all.length / size),
                    number: page,
                    size: size
                });
            })
        );
    }

    private getSeedData(): Category[] {
        return [];
    }

    // Keep existing methods for dropdowns/other usages
    getAllCategories(): Observable<Category[]> {
        if (!this.loaded) {
            this.http.get<any>(this.apiUrl).subscribe({
                next: (data) => {
                    // Check if data is array or page
                    const list = Array.isArray(data) ? data : (data.content || []);
                    this.categoriesSubject.next(list);
                    this.loaded = true;
                },
                error: (err) => {
                    console.warn('Backend unavailable, keeping seed data');
                    this.loaded = true;
                }
            });
        }
        return this.categories$;
    }

    createCategory(category: Category): Observable<Category> {
        // Optimistic update
        const current = this.categoriesSubject.value;
        const tempId = category.id || Math.random().toString(36).substr(2, 9);
        const newItem = { ...category, id: tempId };

        if (!category.id) {
            this.categoriesSubject.next([...current, newItem]);
        }

        const request = category.id
            ? this.http.put<Category>(`${this.apiUrl}/${category.id}`, category)
            : this.http.post<Category>(this.apiUrl, category);

        return request.pipe(
            tap(savedCategory => {
                const updatedList = category.id
                    ? this.categoriesSubject.value.map(c => c.id === category.id ? savedCategory : c)
                    : this.categoriesSubject.value.map(c => c.id === tempId ? savedCategory : c);
                this.categoriesSubject.next(updatedList);
            })
        );
    }

    deleteCategory(id: string): Observable<void> {
        const current = this.categoriesSubject.value;
        this.categoriesSubject.next(current.filter(c => c.id !== id));
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
