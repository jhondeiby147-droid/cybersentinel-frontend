import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { UserBase } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID); // Inyectamos el ID de plataforma
  private apiUrl = 'https://jahnnnn-cybersentinel.hf.space/api/v1/users';

  // Helper para saber si estamos en el navegador
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(credentials: any): Observable<UserBase> {
    return this.http.post<UserBase>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        if (this.isBrowser()) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      })
    );
  }

  getCurrentUser(): UserBase | null {
    if (this.isBrowser()) {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('currentUser');
    }
  }

  isLoggedIn(): boolean {
    if (this.isBrowser()) {
      return localStorage.getItem('currentUser') !== null;
    }
    return false; // En el servidor, siempre asumimos que no está logueado para evitar el error
  }
}