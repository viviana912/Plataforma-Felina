import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from './layout/navbar/navbar';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './layout/footer/footer';
import { ChatAsistenteComponent } from './components/chat-asistente/chat-asistente';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, ChatAsistenteComponent],
  templateUrl: './app.html'
})
export class App implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);

  private rutaActual = signal<string>('');
  esRutaAdmin = computed(() => this.rutaActual().startsWith('/admin'));
  mostrarChat = computed(() => this.authService.isLoggedIn() && !this.esRutaAdmin());

  ngOnInit() {
    this.authService.checkSession();
    this.rutaActual.set(this.router.url);
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.rutaActual.set(e.urlAfterRedirects));
  }
}
