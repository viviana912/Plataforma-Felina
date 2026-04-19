package com.example.plataforma_felina.domain;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class SolicitudTareaId implements Serializable {

    private Long usuarioId;
    private Long tareaId;

}
