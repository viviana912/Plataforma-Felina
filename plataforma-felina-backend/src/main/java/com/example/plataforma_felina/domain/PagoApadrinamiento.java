package com.example.plataforma_felina.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "pago_apadrinamiento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagoApadrinamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_apadrinamiento", nullable = false)
    @JsonIgnoreProperties({"usuario"})
    private Apadrinamiento apadrinamiento;

    @Column(nullable = false)
    private BigDecimal importe;

    @Column(name = "fecha_cobro", nullable = false)
    private LocalDate fechaCobro;

    @PrePersist
    protected void onCreate() {
        if (this.fechaCobro == null) {
            this.fechaCobro = LocalDate.now();
        }
    }
}
