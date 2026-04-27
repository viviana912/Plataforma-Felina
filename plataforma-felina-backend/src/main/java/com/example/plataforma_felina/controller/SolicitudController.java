package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.domain.Solicitud;
import com.example.plataforma_felina.domain.SolicitudId;
import com.example.plataforma_felina.service.SolicitudService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "*")
public class SolicitudController {

    private final SolicitudService solicitudService;

    public SolicitudController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @GetMapping
    public List<Solicitud> getAll() {
        return solicitudService.getAll();
    }

    @PostMapping
    public void create(@RequestBody Solicitud solicitud) {
        solicitudService.save(solicitud);
    }

    @PutMapping("/{usuarioId}/{gatoId}/estado")
    public Solicitud actualizarEstado(@PathVariable Long usuarioId,
                                      @PathVariable Long gatoId,
                                      @RequestBody String nuevoEstado) {
        // Limpiamos comillas por si acaso (mismo patrón que SolicitudColaboradorController)
        String estadoLimpio = nuevoEstado.replace("\"", "").trim();
        return solicitudService.actualizarEstado(new SolicitudId(usuarioId, gatoId), estadoLimpio);
    }

    @DeleteMapping("/{usuarioId}/{gatoId}")
    public void delete(@PathVariable Long usuarioId, @PathVariable Long gatoId) {
        solicitudService.delete(new SolicitudId(usuarioId, gatoId));
    }
}
