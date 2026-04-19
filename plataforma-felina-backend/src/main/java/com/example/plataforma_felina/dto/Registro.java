package com.example.plataforma_felina.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Registro {

    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private String telefono;
}