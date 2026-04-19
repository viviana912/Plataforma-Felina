package com.example.plataforma_felina.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tarea_solicitud")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudTarea {

    @EmbeddedId
    private SolicitudTareaId id;

    private LocalDate fechaSolicitud;
    private String estadoSolicitud;

    @ManyToOne
    @MapsId("usuarioId")
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties({"solicitudesTarea", "solicitudes", "password"})
    private Usuario usuario;

    @ManyToOne
    @MapsId("tareaId")
    @JoinColumn(name = "id_tarea")
    @JsonIgnoreProperties({"solicitudesTarea"})
    private Tarea tarea;

    @PrePersist
    protected void onCreate() {
        this.fechaSolicitud = LocalDate.now();
    }
}
