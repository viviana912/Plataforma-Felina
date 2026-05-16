package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.domain.SolicitudTarea;
import com.example.plataforma_felina.security.SecurityUtils;
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

    @GetMapping("/tarea/{tareaId}")
    public List<SolicitudTarea> getByTarea(@PathVariable Long tareaId) {
        return solicitudTareaService.getByTarea(tareaId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<SolicitudTarea> getByUsuario(@PathVariable Long usuarioId) {
        SecurityUtils.requireAccessToUser(usuarioId);
        return solicitudTareaService.getByUsuario(usuarioId);
    }

    @PostMapping
    public SolicitudTarea create(@RequestBody SolicitudTarea solicitud) {
        Long bodyUsuarioId = solicitud.getUsuario() == null ? null : solicitud.getUsuario().getId();
        SecurityUtils.requireAccessToUser(bodyUsuarioId);
        return solicitudTareaService.save(solicitud);
    }
}
