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

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
}
