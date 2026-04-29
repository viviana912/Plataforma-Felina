package com.example.plataforma_felina.dto;

import lombok.*;

import java.util.List;

public class ChatDTO {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Mensaje {
        private String rol; // "usuario" o "asistente"
        private String texto;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Peticion {
        private Long usuarioId;
        private List<Mensaje> historia;
        private String mensaje;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Respuesta {
        private String respuesta;
    }
}
