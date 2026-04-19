package com.example.plataforma_felina.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity
@Table(name = "solicitud_colaborador")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudColaborador {

    @Id
    private Long usuarioId;

    private LocalDate fechaSolicitud;
    private String estado;

    @OneToOne
    @MapsId
    @JoinColumn(name = "usuarioId")
    private Usuario usuario;
}
