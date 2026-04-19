import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario'; // Asegúrate de que la ruta sea correcta
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['../login/login.css']
})
export class RegisterComponent {
  usuario: Usuario = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: ''
  };

  public usuarioService = inject(UsuarioService); // Lo ponemos public para que el HTML pueda verlo
  private router = inject(Router);

  onRegister() {
    this.usuarioService.registrarUsuario(this.usuario).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: any) => { // Añadido :any aquí para corregir el error TS7006
        console.error(err);
      }
    });
  }
}
