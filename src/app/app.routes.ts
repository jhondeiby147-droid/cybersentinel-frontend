import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { Scanner } from './features/scanner/scanner';
import { Audit } from './features/audit/audit';
import { Users } from './features/users/users';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },

    // Rutas protegidas
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'scanner',
        component: Scanner,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Administrador', 'Analista'] }
    },
    {
        path: 'audit',
        component: Audit,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Administrador', 'Gerente'] }
    },
    {
        path: 'users',
        component: Users,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Administrador'] }
    },

    { path: '**', redirectTo: 'login' }
];