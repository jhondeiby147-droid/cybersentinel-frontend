import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(Auth);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    // Si no está logueado, lo mandamos al login
    return router.parseUrl('/login');
};