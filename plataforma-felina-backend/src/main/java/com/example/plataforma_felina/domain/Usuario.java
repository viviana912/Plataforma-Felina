package com.example.plataforma_felina.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;

    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String passwordHash;
    private String telefono;
    private String fotoUrl;

    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;

    @Column(name = "portada", length = 30)
    private String portada;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rol")
    @JsonIgnoreProperties({"usuarios"})
    private Rol rol;


    @OneToMany(mappedBy = "usuario")
    @JsonIgnore // Para evitar el bucle
    private List<SolicitudTarea> solicitudesTarea;

    @PrePersist
    protected void onCreate() {
        if (this.fechaRegistro == null) {
            this.fechaRegistro = LocalDateTime.now();
        }
    }
}
