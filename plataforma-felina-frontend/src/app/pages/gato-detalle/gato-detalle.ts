import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GatoService } from '../../services/gato';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gato-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gato-detalle.html',
  styleUrl: './gato-detalle.css'
})
export class GatoDetalleComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private authService = inject(AuthService);

  gato: any = null;
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private gatoService: GatoService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.gatoService.getGatoById(id).subscribe({
          next: (data) => {
            this.gato = data;
            this.cdr.markForCheck();
          },
          error: (err) => console.error('Error:', err)
        });
      }
    });
  }

  abrirFormulario() {
    if (this.isLoggedIn) {
      this.router.navigate(['/adoptar', this.gato.id]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
