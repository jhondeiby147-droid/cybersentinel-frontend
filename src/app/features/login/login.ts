import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  // Inyección de dependencias moderna (Angular 21)
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(Auth);

  // Definición del formulario reactivo
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required]]
  });

  // Estados de la interfaz
  isLoading = false;
  errorMessage = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = this.loginForm.value;

      // Llamada real al servicio Auth que conecta con FastAPI
      this.authService.login(credentials).subscribe({
        next: (response) => {
          // Si el login es exitoso, el servicio ya guardó al usuario en localStorage
          console.log('Login exitoso:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          // Manejo de errores basado en la respuesta de FastAPI
          if (error.status === 401) {
            this.errorMessage = 'Usuario o contraseña incorrectos.';
          } else if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor. Verifique que el backend esté corriendo.';
          } else {
            this.errorMessage = 'Ocurrió un error inesperado. Intente más tarde.';
          }
          // Limpiamos la contraseña por seguridad al fallar
          this.loginForm.get('password')?.reset();
        }
      });

    } else {
      // Si el formulario no es válido, marcamos los campos para mostrar el feedback visual (Regla UI/UX)
      this.loginForm.markAllAsTouched();
    }
  }
}