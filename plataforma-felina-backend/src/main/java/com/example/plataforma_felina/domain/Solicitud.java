package com.example.plataforma_felina.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Entity
@Table(name = "solicitud")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Solicitud {

    @EmbeddedId
    private SolicitudId id;

    // Hibernate convertirá automáticamente fechaSolicitud a fecha_solicitud
    // Si quieres asegurar el nombre, úsalo así pero ASEGÚRATE de no tenerlo repetido
    @Column(name = "fecha_solicitud")
    private LocalDateTime fechaSolicitud;

    @Column(name = "tipo_solicitud")
    private String tipoSolicitud;

    private String estado;

    @Column(name = "experiencia_previa", columnDefinition = "TEXT")
    private String experienciaPrevia;

    @Column(name = "motivo_adopcion", columnDefinition = "TEXT")
    private String motivoAdopcion;

    @Column(name = "condiciones_vivienda")
    private String condicionesVivienda;


    @ManyToOne
    @MapsId("usuarioId")
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @MapsId("gatoId")
    @JoinColumn(name = "id_gato")
    private Gato gato;

    @PrePersist
    protected void onCreate() {
        this.fechaSolicitud = LocalDateTime.now();
    }
}