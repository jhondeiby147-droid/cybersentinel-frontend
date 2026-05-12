import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Api } from '../../core/services/api';
import { Auth } from '../../core/services/auth';
import { AnalysisResponse } from '../../core/models/models';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './scanner.html',
  styleUrl: './scanner.scss'
})
export class Scanner {
  private apiService = inject(Api);
  private authService = inject(Auth);

  loadingMessage: string = 'Iniciando análisis...';

  // Datos de entrada
  logText: string = '';

  // Estados del análisis
  isLoading: boolean = false;
  results: AnalysisResponse | null = null;

  // Efecto Typewriter
  displayText: string = '';
  private typingSpeed: number = 30; // milisegundos por palabra

  analyze() {
    if (!this.logText.trim()) return;

    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isLoading = true;
    this.loadingMessage = 'Iniciando análisis...';
    this.results = null;
    this.displayText = '';
    // Cambiar el mensaje tras 4 segundos
    setTimeout(() => {
      if (this.isLoading) this.loadingMessage = 'Procesando gran volumen de datos...';
    }, 4000);

    // Cambiar tras 8 segundos
    setTimeout(() => {
      if (this.isLoading) this.loadingMessage = 'Casi listo, el motor de IA está finalizando...';
    }, 8000);

    this.apiService.analyzeVulnerability(this.logText, user.username).subscribe({
      next: (res) => {
        this.results = res;
        this.isLoading = false;
        this.startTypewriter(res.summary);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // Lógica para escribir palabra por palabra
  private startTypewriter(fullText: string) {
    const words = fullText.split(' ');
    let i = 0;
    this.displayText = '';

    const interval = setInterval(() => {
      if (i < words.length) {
        this.displayText += words[i] + ' ';
        i++;
      } else {
        clearInterval(interval);
      }
    }, this.typingSpeed);
  }

  getSeverityClass(severity: string) {
    switch (severity.toLowerCase()) {
      case 'crítica': return 'text-sev-critical bg-sev-critical/10 border-sev-critical/30';
      case 'alta': return 'text-sev-high bg-sev-high/10 border-sev-high/30';
      case 'media': return 'text-sev-medium bg-sev-medium/10 border-sev-medium/30';
      case 'baja': return 'text-sev-low bg-sev-low/10 border-sev-low/30';
      default: return 'text-slate-400 bg-slate-800';
    }
  }
}