package com.example.plataforma_felina.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "gato")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String sexo;

    private LocalDate fechaNacimiento;

    private String raza;

    private String color;

    private String vacunas;

    private String caracter;

    private String notas;

    private String estado; //ADOPTABLE, APADRINABLE, ADOPTADO

    private boolean urgente;

    private int edad;

    @Column(name = "foto_url")
    private String fotoUrl;

    @Column(name = "vacunado")
    private Boolean vacunado;

    @Column(name = "castrado")
    private Boolean castrado;

    @Column(name = "desparasitado")
    private Boolean desparasitado;

    @Column(name = "microchip")
    private Boolean microchip;

    @Column(name = "apto_ninos")
    private Boolean aptoNinos;

    @Column(name = "apto_otros_gatos")
    private Boolean aptoOtrosGatos;

    @Column(name = "apto_perros")
    private Boolean aptoPerros;

}
