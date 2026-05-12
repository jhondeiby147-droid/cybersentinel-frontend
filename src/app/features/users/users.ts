import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Api } from '../../core/services/api';
import { UserResponse } from '../../core/models/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Sidebar],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  private apiService = inject(Api);
  private fb = inject(FormBuilder);

  // Estados
  users: UserResponse[] = [];
  isLoading = true;
  isSubmitting = false;
  editingUserId: number | null = null; // Nuevo estado para controlar la edición

  // Formulario Base
  userForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    role: ['Analista', [Validators.required]]
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.apiService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.isLoading = false;
      }
    });
  }

  // --- LÓGICA DE EDICIÓN ---
  setEditMode(user: UserResponse) {
    this.editingUserId = user.id;

    this.userForm.patchValue({
      username: user.username,
      password: '', // En blanco por seguridad. Si no escribe nada, no se actualiza.
      role: user.role
    });

    // El nombre de usuario no se debería poder cambiar
    this.userForm.get('username')?.disable();

    // La contraseña ya no es obligatoria al editar, pero si escribe, debe tener mín 4 chars
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.setValidators([Validators.minLength(4)]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  cancelEdit() {
    this.editingUserId = null;
    this.userForm.reset({ role: 'Analista' });

    // Restaurar validaciones originales
    this.userForm.get('username')?.enable();
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(4)]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  // --- SUBMIT UNIFICADO (Crear o Actualizar) ---
  submitForm() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.userForm.getRawValue(); // getRawValue captura también campos disabled (username)

    if (this.editingUserId) {
      // MODO: ACTUALIZAR
      // Solo enviamos la contraseña si el usuario escribió una nueva
      const updatePayload = {
        role: formData.role,
        ...(formData.password ? { password: formData.password } : {})
      };

      this.apiService.updateUser(this.editingUserId, updatePayload).subscribe({
        next: () => {
          this.loadUsers();
          this.cancelEdit();
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error al actualizar usuario:', err);
          this.isSubmitting = false;
        }
      });

    } else {
      // MODO: CREAR
      this.apiService.registerUser(formData).subscribe({
        next: () => {
          this.loadUsers();
          this.userForm.reset({ role: 'Analista' });
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error al crear usuario:', err);
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      this.apiService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  getRoleClass(role: string) {
    switch (role.toLowerCase()) {
      case 'administrador': return 'bg-cyber-accent/20 text-cyber-accent border-cyber-accent/30';
      case 'gerente': return 'bg-sev-medium/20 text-sev-medium border-sev-medium/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  }
}