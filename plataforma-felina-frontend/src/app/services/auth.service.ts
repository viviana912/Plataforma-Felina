
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<any | null>(null);

  user = computed(() => this.currentUser());
  isLoggedIn = computed(() => !!this.currentUser());

  constructor() {
    this.checkSession();
  }

  // Recibe la respuesta completa de Java (token + usuario)
  setSession(authResponse: any) {
    this.currentUser.set(authResponse.usuario);
    localStorage.setItem('user_session', JSON.stringify(authResponse.usuario));
    localStorage.setItem('auth_token', authResponse.token); // 👈 ¡CLAVE! Guardar el token
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user_session');
    localStorage.removeItem('auth_token'); // 👈 Limpiar token
  }

  checkSession() {
    const saved = localStorage.getItem('user_session');
    if (saved) {
      this.currentUser.set(JSON.parse(saved));
    }
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
