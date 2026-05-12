import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Api } from '../../core/services/api';
import { DashboardStats } from '../../core/models/models';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  @ViewChild('severityChart') severityChart!: ElementRef;

  private apiService = inject(Api);

  stats: DashboardStats | null = null;
  isLoading = true;
  chart: any;

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.apiService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        // Esperamos a que el DOM se actualice para renderizar la gráfica
        setTimeout(() => this.initChart(), 0);
      },
      error: (err) => {
        console.error('Error cargando estadísticas:', err);
        this.isLoading = false;
      }
    });
  }

  initChart() {
    if (!this.severityChart || !this.stats) return;

    const ctx = this.severityChart.nativeElement.getContext('2d');
    const data = this.stats.severity_distribution;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Crítica', 'Alta', 'Media', 'Baja'],
        datasets: [{
          data: [data.Critica, data.Alta, data.Media, data.Baja],
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e'],
          hoverBackgroundColor: ['#f87171', '#fb923c', '#facc15', '#4ade80'],
          borderWidth: 0,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              padding: 20,
              font: { family: 'Inter', size: 12, weight: 'bold' }
            }
          }
        },
        cutout: '70%'
      }
    });
  }
}