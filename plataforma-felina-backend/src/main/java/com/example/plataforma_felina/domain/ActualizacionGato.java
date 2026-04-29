package com.example.plataforma_felina.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "actualizacion_gato")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActualizacionGato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_gato", nullable = false)
    @JsonIgnoreProperties({"vacunas", "caracter", "notas"})
    private Gato gato;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String mensaje;

    @Column(name = "foto_url")
    private String fotoUrl;

    @PrePersist
    protected void onCreate() {
        if (this.fecha == null) {
            this.fecha = LocalDateTime.now();
        }
    }
}
