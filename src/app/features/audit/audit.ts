import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Api } from '../../core/services/api';
import { AuditLogResponse } from '../../core/models/models';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './audit.html',
  styleUrl: './audit.scss'
})
export class Audit implements OnInit {
  private apiService = inject(Api);

  logs: AuditLogResponse[] = [];
  isLoading = true;

  // --- VARIABLES DE PAGINACIÓN ---
  currentPage: number = 1;
  pageSize: number = 5;

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.isLoading = true;
    this.apiService.getAuditLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.currentPage = 1; // Reiniciar a la página 1 al recargar
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar logs:', err);
        this.isLoading = false;
      }
    });
  }

  // --- LÓGICA DE PAGINACIÓN ---
  get totalPages(): number {
    return Math.ceil(this.logs.length / this.pageSize);
  }

  get paginatedLogs(): AuditLogResponse[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.logs.slice(startIndex, endIndex);
  }

  get currentStartIndex(): number {
    return this.logs.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get currentEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.logs.length);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // RF-09: Exportación de Reportes a Excel (Individual o Global)
  exportToExcel(singleLog?: AuditLogResponse) {
    const dataToExport = singleLog ? [singleLog] : this.logs; // Usa this.logs para exportar TODOS

    if (dataToExport.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const formattedData = dataToExport.map(log => ({
      'ID Registro': log.id,
      'Fecha y Hora': new Date(log.timestamp).toLocaleString(),
      'Analista': log.username,
      'Nivel de Severidad': log.severity,
      'Confianza IA (%)': `${(log.confidence_score * 100).toFixed(0)}%`,
      'Entidades Detectadas': this.formatEntitiesForExcel(log.entities_json),
      'Resumen Técnico': log.summary,
      'Log Original': log.original_text
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);

    const columnWidths = [
      { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 40 }, { wch: 80 }, { wch: 60 }
    ];
    worksheet['!cols'] = columnWidths;

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Auditoria_CyberSentinel');

    const timestamp = new Date().getTime();
    const fileName = singleLog
      ? `Reporte_Auditoria_${singleLog.id}_${timestamp}.xlsx`
      : `Reporte_Auditoria_Global_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  }

  private formatEntitiesForExcel(entitiesData: any): string {
    try {
      const entities = typeof entitiesData === 'string' ? JSON.parse(entitiesData) : entitiesData;
      if (!entities || entities.length === 0) return 'Ninguna';
      return entities.map((e: any) => `${e.entity} (${e.category})`).join(' | ');
    } catch (error) {
      return 'Error al leer entidades';
    }
  }

  getSeverityClass(severity: string) {
    switch (severity.toLowerCase()) {
      case 'crítica': return 'text-sev-critical bg-sev-critical/10';
      case 'alta': return 'text-sev-high bg-sev-high/10';
      case 'media': return 'text-sev-medium bg-sev-medium/10';
      case 'baja': return 'text-sev-low bg-sev-low/10';
      default: return 'text-slate-400 bg-slate-800';
    }
  }
}