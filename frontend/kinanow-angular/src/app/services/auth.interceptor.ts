import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.access_token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.access_token}`
                }
            });
        }
    }
    return next(req);
};
