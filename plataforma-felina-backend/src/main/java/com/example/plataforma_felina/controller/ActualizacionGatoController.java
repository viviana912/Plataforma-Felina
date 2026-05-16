package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.domain.ActualizacionGato;
import com.example.plataforma_felina.security.SecurityUtils;
import com.example.plataforma_felina.service.ActualizacionGatoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actualizaciones")
@CrossOrigin(origins = "*")
public class ActualizacionGatoController {

    private final ActualizacionGatoService service;

    public ActualizacionGatoController(ActualizacionGatoService service) {
        this.service = service;
    }

    @GetMapping("/gato/{gatoId}")
    public List<ActualizacionGato> listarDeGato(@PathVariable Long gatoId) {
        return service.listarDeGato(gatoId);
    }

    @GetMapping("/feed/usuario/{usuarioId}")
    public List<ActualizacionGato> feedDeUsuario(@PathVariable Long usuarioId) {
        SecurityUtils.requireAccessToUser(usuarioId);
        return service.feedDeUsuario(usuarioId);
    }

    @PostMapping("/gato/{gatoId}")
    public ActualizacionGato crear(@PathVariable Long gatoId, @RequestBody ActualizacionGato datos) {
        return service.crear(gatoId, datos);
    }

    @DeleteMapping("/{id}")
    public void borrar(@PathVariable Long id) {
        service.borrar(id);
    }
}
