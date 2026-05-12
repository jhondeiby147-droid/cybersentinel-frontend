import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  private authService = inject(Auth);
  private router = inject(Router);

  user = this.authService.getCurrentUser();

  // Estado para el menú móvil
  isOpen = false;

  // Añadimos los roles permitidos según tu archivo de rutas
  navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard', roles: [] }, // Vacío = Todos tienen acceso
    { label: 'Analizador', route: '/scanner', icon: 'security', roles: ['Administrador', 'Analista'] },
    { label: 'Auditoría', route: '/audit', icon: 'history', roles: ['Administrador', 'Gerente'] },
    { label: 'Usuarios', route: '/users', icon: 'people', roles: ['Administrador'] }
  ];

  // Getter dinámico para filtrar el menú según el rol del usuario actual
  get filteredNavItems() {
    const userRole = this.user?.role;

    return this.navItems.filter(item => {
      // Si el ítem no requiere roles específicos, se muestra a todos
      if (!item.roles || item.roles.length === 0) {
        return true;
      }
      // Si requiere roles específicos, verificamos si el usuario tiene uno de ellos
      return userRole && item.roles.includes(userRole);
    });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}