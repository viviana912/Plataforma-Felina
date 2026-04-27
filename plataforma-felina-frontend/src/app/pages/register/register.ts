import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['../login/login.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  public usuarioService = inject(UsuarioService);
  private router = inject(Router);

  errorMsg = '';

  form = this.fb.group({
    nombre:    ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    apellido:  ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    email:     ['', [Validators.required, Validators.email]],
    telefono:  ['', [Validators.required, Validators.pattern(/^[6-9]\d{8}$/)]],
    password:  ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
    confirmar: ['', [Validators.required]]
  }, { validators: coincidenPasswords });

  onRegister() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMsg = '';

    const raw = this.form.getRawValue();
    const datos: Usuario = {
      nombre: raw.nombre!,
      apellido: raw.apellido!,
      email: raw.email!,
      telefono: raw.telefono!,
      password: raw.password!
    };

    this.usuarioService.registrarUsuario(datos).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err: HttpErrorResponse) => {
        console.error('[Register] error:', err);
        if (err.status === 409) {
          this.errorMsg = 'Este email ya está registrado. Inicia sesión o usa otro distinto.';
        } else if (err.status === 0) {
          this.errorMsg = 'No se puede contactar con el servidor. ¿Está activo el backend?';
        } else {
          this.errorMsg = `Error ${err.status}: no se pudo completar el registro.`;
        }
      }
    });
  }
}

function coincidenPasswords(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const conf = group.get('confirmar')?.value;
  return pass === conf ? null : { passwordsNoCoinciden: true };
}
