package com.example.plataforma_felina.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsuarioDTO {

    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String fotoUrl;
    private String codigoPostal;
    private String portada;
    private com.example.plataforma_felina.domain.Rol rol;
}