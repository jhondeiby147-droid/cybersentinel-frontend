import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(Auth);
    const router = inject(Router);
    const user = authService.getCurrentUser();

    // Obtenemos los roles permitidos definidos en la ruta
    const allowedRoles = route.data['roles'] as Array<string>;

    if (user && allowedRoles.includes(user.role)) {
        return true;
    }

    // Si no tiene el rol, lo mandamos al dashboard (o podrías crear una página de 403)
    console.warn('Acceso denegado: Rol insuficiente');
    return router.parseUrl('/dashboard');
};