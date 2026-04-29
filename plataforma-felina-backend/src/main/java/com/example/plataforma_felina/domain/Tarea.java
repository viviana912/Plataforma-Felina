package com.example.plataforma_felina.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "tarea")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descripcion;
    private String estado;
    private String urgencia;

    @Column(name = "tipo")
    private String tipo;

    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;

    @OneToMany(mappedBy = "tarea")
    @JsonIgnore
    private List<SolicitudTarea> solicitudes;
}
