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

}
