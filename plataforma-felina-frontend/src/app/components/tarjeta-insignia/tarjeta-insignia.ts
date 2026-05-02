import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import html2canvas from 'html2canvas';

export interface InsigniaTarjeta {
  clave: string;
  titulo: string;
  descripcion: string;
  imagen: string;
}

export interface UsuarioTarjeta {
  nombre?: string;
  apellido?: string;
}

const MENSAJES: Record<string, string> = {
  familia: 'He acogido a un gato gracias al Refugio del Sol.',
  donante: 'He apoyado al Refugio del Sol con una donación.',
  veterano: 'Llevo más de un año transformando vidas felinas en el Refugio del Sol.'
};

@Component({
  selector: 'app-tarjeta-insignia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-insignia.html',
  styleUrls: ['./tarjeta-insignia.css']
})
export class TarjetaInsigniaComponent {
  @Input() insignia!: InsigniaTarjeta;
  @Input() usuario: UsuarioTarjeta | null = null;
  @Input() fecha: Date | string | null = null;
  @Output() cerrar = new EventEmitter<void>();

  @ViewChild('tarjeta', { static: false }) tarjetaRef!: ElementRef<HTMLDivElement>;

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  generando = false;
  toast: string | null = null;

  get mensaje(): string {
    return MENSAJES[this.insignia?.clave] || '¡He conseguido una insignia en el Refugio del Sol!';
  }

  get fechaDate(): Date | null {
    if (!this.fecha) return null;
    return typeof this.fecha === 'string' ? new Date(this.fecha) : this.fecha;
  }

  get nombreCompleto(): string {
    if (!this.usuario) return '';
    return `${this.usuario.nombre || ''} ${this.usuario.apellido || ''}`.trim();
  }

  puedeCompartirNativo(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  }

  cerrarModal() {
    if (this.generando) return;
    this.cerrar.emit();
  }

  private async generarBlob(): Promise<Blob | null> {
    if (!isPlatformBrowser(this.platformId) || !this.tarjetaRef) return null;
    const canvas = await html2canvas(this.tarjetaRef.nativeElement, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      logging: false
    });
    return await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
  }

  private nombreArchivo(): string {
    return `insignia-${this.insignia?.clave || 'refugio-del-sol'}.png`;
  }

  private mostrarToast(msg: string) {
    this.toast = msg;
    setTimeout(() => {
      this.toast = null;
      this.cdr.markForCheck();
    }, 2400);
  }

  async descargar() {
    if (this.generando) return;
    this.generando = true;
    this.cdr.markForCheck();
    try {
      const blob = await this.generarBlob();
      if (!blob) throw new Error('No blob');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.nombreArchivo();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      this.mostrarToast('Tarjeta descargada');
    } catch (err) {
      console.error('Error generando tarjeta', err);
      this.mostrarToast('No se pudo generar la imagen');
    } finally {
      this.generando = false;
      this.cdr.markForCheck();
    }
  }

  async compartir() {
    if (this.generando) return;
    this.generando = true;
    this.cdr.markForCheck();
    try {
      const blob = await this.generarBlob();
      if (!blob) throw new Error('No blob');
      const file = new File([blob], this.nombreArchivo(), { type: 'image/png' });
      const shareData: ShareData = {
        title: `Insignia ${this.insignia.titulo} — Refugio del Sol`,
        text: this.mensaje,
        files: [file]
      };
      const nav = navigator as Navigator & { canShare?: (data?: ShareData) => boolean };
      if (nav.canShare && !nav.canShare(shareData)) {
        await this.copiarAlPortapapeles(blob);
        this.mostrarToast('Imagen copiada al portapapeles');
      } else {
        await navigator.share(shareData);
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('Error compartiendo', err);
        this.mostrarToast('No se pudo compartir');
      }
    } finally {
      this.generando = false;
      this.cdr.markForCheck();
    }
  }

  private async copiarAlPortapapeles(blob: Blob) {
    if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) return;
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  }
}
