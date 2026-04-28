package com.example.plataforma_felina.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "apadrinamiento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Apadrinamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_gato", nullable = false)
    private Gato gato;

    @Column(name = "importe_mensual", nullable = false)
    private BigDecimal importeMensual;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "proximo_cobro", nullable = false)
    private LocalDate proximoCobro;

    @Column(nullable = false)
    private String estado;

    @Column(name = "tarjeta_ultimos4", length = 4)
    private String tarjetaUltimos4;

    @PrePersist
    protected void onCreate() {
        if (this.fechaInicio == null) {
            this.fechaInicio = LocalDate.now();
        }
        if (this.estado == null) {
            this.estado = "ACTIVO";
        }
        if (this.proximoCobro == null) {
            this.proximoCobro = this.fechaInicio.plusMonths(1);
        }
    }
}
