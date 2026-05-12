import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AnalysisResponse,
  AuditLogResponse,
  DashboardStats,
  UserBase,
  UserResponse,
  UserUpdate
} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api/v1';

  // --- ANÁLISIS DE IA (RF-02 al RF-05) ---
  analyzeVulnerability(text: string, username: string): Observable<AnalysisResponse> {
    // Coincide con VulnerabilityRequest del backend
    return this.http.post<AnalysisResponse>(`${this.baseUrl}/analyze`, { text, username });
  }

  // --- AUDITORÍA (RF-07) ---
  getAuditLogs(): Observable<AuditLogResponse[]> {
    return this.http.get<AuditLogResponse[]>(`${this.baseUrl}/audit`);
  }

  // --- DASHBOARD (RF-06) ---
  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/stats`);
  }

  // --- GESTIÓN DE USUARIOS (RF-08) ---
  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.baseUrl}/users`);
  }

  registerUser(userData: any): Observable<UserBase> {
    return this.http.post<UserBase>(`${this.baseUrl}/users/register`, userData);
  }

  updateUser(id: number, data: UserUpdate): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.baseUrl}/users/${id}`, data);
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/users/${id}`);
  }
}