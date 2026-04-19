package com.example.plataforma_felina.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private UsuarioDTO usuario;
}