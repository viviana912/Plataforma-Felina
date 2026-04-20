import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareaService } from '../../../services/tarea';

@Component({
  selector: 'app-admin-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-tareas.html',
  styleUrls: ['./admin-tareas.css']
})
export class AdminTareasComponent implements OnInit {
  private tareaService = inject(TareaService);
  private cdr = inject(ChangeDetectorRef);

  tareas: any[] = [];

  tareaParaBorrar: any = null;
  mostrarConfirmarGuardar: boolean = false;
  cambiosGuardadosExito: boolean = false;

  errorBorrado: string | null = null;

  mostrarModalCrear: boolean = false;
  nuevaTarea: any = {
    titulo: '',
    descripcion: '',
    urgencia: 'Media',
    estado: 'Pendiente'
  };

  ngOnInit() {
    this.cargarTareas();
  }

  cargarTareas() {
    this.tareaService.getTareas().subscribe({
      next: (data) => {
        this.tareas = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar misiones:', err)
    });
  }

  abrirModalCrear() {
    this.nuevaTarea = { titulo: '', descripcion: '', urgencia: 'Media', estado: 'Pendiente' };
    this.mostrarModalCrear = true;
  }

  crearTarea() {
    if (!this.nuevaTarea.titulo) {
      alert('El título es obligatorio');
      return;
    }

    this.tareaService.createTarea(this.nuevaTarea).subscribe({
      next: () => {
        this.mostrarModalCrear = false;
        this.cargarTareas();
        this.cambiosGuardadosExito = true;
      },
      error: (err) => console.error('Error al crear tarea:', err)
    });
  }

  abrirModalConfirmarCambios() {
    this.mostrarConfirmarGuardar = true;
  }

  confirmarGuardarTodo() {
    if (this.tareas.length === 0) return;

    let peticionesFinalizadas = 0;

    this.tareas.forEach(tarea => {
      this.tareaService.createTarea(tarea).subscribe({
        next: () => {
          peticionesFinalizadas++;
          if (peticionesFinalizadas === this.tareas.length) {
            this.finalizarProcesoGuardado();
          }
        },
        error: (err) => {
          peticionesFinalizadas++;
          console.error(`Error en tarea ${tarea.id}:`, err);
          if (peticionesFinalizadas === this.tareas.length) {
            this.finalizarProcesoGuardado();
          }
        }
      });
    });
  }

  private finalizarProcesoGuardado() {
    this.mostrarConfirmarGuardar = false;
    this.cambiosGuardadosExito = true;
    this.cargarTareas();
  }

  abrirModalBorrar(tarea: any) {
    this.tareaParaBorrar = tarea;
    this.errorBorrado = null;
  }

  confirmarBorrado() {
    if (!this.tareaParaBorrar) return;

    const id = this.tareaParaBorrar.id;

    this.tareaService.deleteTarea(id).subscribe({
      next: () => {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.tareaParaBorrar = null;
        this.errorBorrado = null;
        this.cambiosGuardadosExito = true;
      },
      error: (err) => {
        console.error('Error de integridad:', err);
        this.errorBorrado = 'Esta misión tiene voluntarios asignados o solicitudes vinculadas.';
      }
    });
  }

  cerrarModales() {
    this.tareaParaBorrar = null;
    this.mostrarConfirmarGuardar = false;
    this.cambiosGuardadosExito = false;
    this.errorBorrado = null;
  }
}
