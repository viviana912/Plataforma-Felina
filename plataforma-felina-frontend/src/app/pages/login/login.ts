import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Login } from '../../services/usuario';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  datos: Login = { email: '', password: '' };
  errorMsg = '';

  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    // login.ts -> dentro de onLogin()
    this.usuarioService.login(this.datos).subscribe({
      next: (response) => {
        // 'response' contiene { token: '...', usuario: {...} }
        this.authService.setSession(response);
        this.router.navigate(['/gatos']);
      },
      error: (err) => {
        this.errorMsg = 'Credenciales incorrectas';
        console.error(err);
      }
    });
  }
}
