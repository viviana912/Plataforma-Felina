package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.domain.SolicitudTarea;
import com.example.plataforma_felina.service.SolicitudTareaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes-tarea")
@CrossOrigin(origins = "*")
public class SolicitudTareaController {

    private final SolicitudTareaService solicitudTareaService;

    public SolicitudTareaController(SolicitudTareaService solicitudTareaService) {
        this.solicitudTareaService = solicitudTareaService;
    }

    @GetMapping
    public List<SolicitudTarea> getAll() {
        return solicitudTareaService.getAll();
    }

    @PostMapping
    public SolicitudTarea create(@RequestBody SolicitudTarea solicitud) {
        return solicitudTareaService.save(solicitud);
    }
}
