import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, MensajeChat } from '../../services/chat';
import { AuthService } from '../../services/auth.service';

const STORAGE_KEY = 'chat_bigotin_historia';

const MENSAJE_INICIAL = '¡Hola! Soy Bigotín. Cuéntame cómo es tu casa, si tienes niños, otros animales o cualquier cosa que te haga ilusión, y te recomendaré gatitos que pueden encajar contigo.';

const SUGERENCIAS = [
  'Vivo en un piso pequeño',
  'Tengo niños pequeños',
  'Es mi primer gato'
];

@Component({
  selector: 'app-chat-asistente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-asistente.html',
  styleUrls: ['./chat-asistente.css']
})
export class ChatAsistenteComponent implements OnInit, AfterViewChecked {
  abierto = false;
  mensajes: MensajeChat[] = [];
  textoInput = '';
  esperandoRespuesta = false;
  sugerenciasVisibles = SUGERENCIAS;

  @ViewChild('mensajesScroll') mensajesScroll?: ElementRef<HTMLDivElement>;
  private debeScrollear = false;

  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const guardado = sessionStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        this.mensajes = JSON.parse(guardado);
      } catch {
        this.mensajes = [];
      }
    }
    if (this.mensajes.length === 0) {
      this.mensajes.push({ rol: 'asistente', texto: MENSAJE_INICIAL });
    }
  }

  ngAfterViewChecked() {
    if (this.debeScrollear && this.mensajesScroll) {
      this.mensajesScroll.nativeElement.scrollTop = this.mensajesScroll.nativeElement.scrollHeight;
      this.debeScrollear = false;
    }
  }

  abrir() {
    this.abierto = true;
    this.debeScrollear = true;
  }

  cerrar() {
    this.abierto = false;
  }

  get mostrarSugerencias(): boolean {
    return this.mensajes.length <= 1;
  }

  enviarSugerencia(s: string) {
    this.textoInput = s;
    this.enviar();
  }

  enviar() {
    const texto = this.textoInput.trim();
    if (!texto || this.esperandoRespuesta) return;
    this.mensajes.push({ rol: 'usuario', texto });
    this.textoInput = '';
    this.esperandoRespuesta = true;
    this.debeScrollear = true;
    this.persistir();

    const todos = this.mensajes.slice(0, -1);
    const idxPrimerUsuario = todos.findIndex(m => m.rol === 'usuario');
    const historia = idxPrimerUsuario === -1 ? [] : todos.slice(idxPrimerUsuario);
    const usuarioId = this.authService.user()?.id;

    this.chatService.enviar({ usuarioId, historia, mensaje: texto }).subscribe({
      next: (res) => {
        this.mensajes.push({ rol: 'asistente', texto: res.respuesta });
        this.esperandoRespuesta = false;
        this.debeScrollear = true;
        this.persistir();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error chat', err);
        const msg = err?.error?.respuesta || 'Bigotín no ha podido responderte. Inténtalo de nuevo.';
        this.mensajes.push({ rol: 'asistente', texto: msg });
        this.esperandoRespuesta = false;
        this.debeScrollear = true;
        this.persistir();
        this.cdr.markForCheck();
      }
    });
  }

  reiniciar() {
    this.mensajes = [{ rol: 'asistente', texto: MENSAJE_INICIAL }];
    this.persistir();
  }

  private persistir() {
    if (!isPlatformBrowser(this.platformId)) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.mensajes));
  }

  onEnter(event: Event) {
    event.preventDefault();
    this.enviar();
  }
}
