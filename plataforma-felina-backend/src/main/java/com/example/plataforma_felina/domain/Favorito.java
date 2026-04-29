package com.example.plataforma_felina.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "favorito",
        uniqueConstraints = @UniqueConstraint(columnNames = {"id_usuario", "id_gato"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_gato", nullable = false)
    private Gato gato;

    @Column(name = "fecha_anadido", nullable = false)
    private LocalDateTime fechaAnadido;

    @PrePersist
    protected void onCreate() {
        if (this.fechaAnadido == null) {
            this.fechaAnadido = LocalDateTime.now();
        }
    }
}
