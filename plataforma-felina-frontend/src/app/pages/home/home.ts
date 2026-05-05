import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GatoService, Gato } from '../../services/gato';
import { RevealDirective } from '../../directives/reveal.directive';

interface HomeStat {
  value: number;
  suffix: string;
  label: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, RevealDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private gatoService = inject(GatoService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  gatosAdoptados: Gato[] = [];

  heroSlides: string[] = [
    '/assets/portadas/pexels-pixabay-45170.jpg',
    '/assets/portadas/cuidadorGato.jpg',
    '/assets/portadas/gatoEnCasa.jpg',
    '/assets/portadas/GatoCariño.jpg',
  ];
  heroIndex = 0;
  private heroTimer?: ReturnType<typeof setInterval>;

  stats: HomeStat[] = [
    { value: 1500, suffix: '+', label: 'Vidas Rescatadas' },
    { value: 10, suffix: '+', label: 'Colonias Cuidadas' },
    { value: 1500, suffix: '+', label: 'Adopciones Felices' },
    { value: 8000, suffix: '€+', label: 'Fondos Recaudados' },
  ];
  displayedStats: number[] = [0, 0, 0, 0];

  @ViewChild('statsSection') statsSection?: ElementRef<HTMLElement>;
  private statsObserver?: IntersectionObserver;
  private statsAnimated = false;

  ngOnInit() {
    this.gatoService.getGatosAdoptados().subscribe({
      next: (data) => {
        this.gatosAdoptados = data.slice(0, 4);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error cargando gatos adoptados:', err),
    });

    if (!isPlatformBrowser(this.platformId)) {
      this.displayedStats = this.stats.map((s) => s.value);
      return;
    }

    if (this.prefersReducedMotion()) {
      this.displayedStats = this.stats.map((s) => s.value);
      return;
    }

    this.heroTimer = setInterval(() => {
      this.heroIndex = (this.heroIndex + 1) % this.heroSlides.length;
      this.cdr.markForCheck();
    }, 7000);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.prefersReducedMotion()) return;
    if (typeof IntersectionObserver === 'undefined') {
      this.displayedStats = this.stats.map((s) => s.value);
      return;
    }
    if (!this.statsSection) return;

    this.statsObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !this.statsAnimated) {
            this.statsAnimated = true;
            this.animateStats();
            this.statsObserver?.disconnect();
            this.statsObserver = undefined;
            break;
          }
        }
      },
      { threshold: 0.3 }
    );

    this.statsObserver.observe(this.statsSection.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.heroTimer) clearInterval(this.heroTimer);
    this.statsObserver?.disconnect();
  }

  formatStat(n: number, suffix: string): string {
    return new Intl.NumberFormat('es-ES').format(Math.round(n)) + suffix;
  }

  private prefersReducedMotion(): boolean {
    return (
      typeof window !== 'undefined' &&
      !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    );
  }

  private animateStats(): void {
    const duration = 1800;
    const start = performance.now();
    const targets = this.stats.map((s) => s.value);

    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);
      this.displayedStats = targets.map((v) => v * eased);
      this.cdr.markForCheck();
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        this.displayedStats = targets;
        this.cdr.markForCheck();
      }
    };

    requestAnimationFrame(tick);
  }
}
