package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.domain.Solicitud;
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
}
