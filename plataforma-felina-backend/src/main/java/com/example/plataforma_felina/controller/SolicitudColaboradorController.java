package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.domain.SolicitudColaborador;
import com.example.plataforma_felina.service.SolicitudColaboradorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes-colaborador")
@CrossOrigin(origins = "*")
public class SolicitudColaboradorController {

    private final SolicitudColaboradorService solicitudColaboradorService;

    public SolicitudColaboradorController(SolicitudColaboradorService solicitudColaboradorService) {
        this.solicitudColaboradorService = solicitudColaboradorService;
    }

    @GetMapping
    public List<SolicitudColaborador> getAll() {
        return solicitudColaboradorService.getAll();
    }

    @PostMapping
    public SolicitudColaborador create(@RequestBody SolicitudColaborador solicitud) {
        return solicitudColaboradorService.save(solicitud);
    }

    @PatchMapping("/{id}/aprobar")
    public SolicitudColaborador aprobar(@PathVariable Long id) {
        return solicitudColaboradorService.aprobarSolicitud(id);
    }

    @PutMapping("/{id}/estado")
    public SolicitudColaborador actualizarEstado(@PathVariable Long id, @RequestBody String nuevoEstado) {
        // Limpiamos comillas por si acaso
        String estadoLimpio = nuevoEstado.replace("\"", "").trim();
        return solicitudColaboradorService.actualizarEstado(id, estadoLimpio);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        solicitudColaboradorService.delete(id);
    }


}
