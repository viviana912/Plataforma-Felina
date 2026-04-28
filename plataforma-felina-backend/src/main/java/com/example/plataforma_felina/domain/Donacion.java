package com.example.plataforma_felina.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "donacion")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Donacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fechaDonacion;

    private BigDecimal cantidad;

    @Column(columnDefinition = "TEXT")
    private String mensaje;

    @Column(name = "tarjeta_ultimos4", length = 4)
    private String tarjetaUltimos4;

    private boolean anonima;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @PrePersist
    protected void onCreate() {
        if (this.fechaDonacion == null) {
            this.fechaDonacion = LocalDate.now();
        }
    }
}
