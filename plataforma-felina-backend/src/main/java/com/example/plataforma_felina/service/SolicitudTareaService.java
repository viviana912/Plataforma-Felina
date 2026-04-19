package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.SolicitudTarea;
import com.example.plataforma_felina.domain.SolicitudTareaId;
import com.example.plataforma_felina.repository.SolicitudTareaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolicitudTareaService {

    private final SolicitudTareaRepository solicitudTareaRepository;
    private final UsuarioService usuarioService;
    private final TareaService tareaService;

    public SolicitudTareaService(SolicitudTareaRepository solicitudTareaRepository,
                                 UsuarioService usuarioService,
                                 TareaService tareaService) {
        this.solicitudTareaRepository = solicitudTareaRepository;
        this.usuarioService = usuarioService;
        this.tareaService = tareaService;
    }

    public List<SolicitudTarea> getAll() {
        return solicitudTareaRepository.findAll();
    }

    public SolicitudTarea findOne(SolicitudTareaId id) {
        return solicitudTareaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud de tarea no encontrada"));
    }

    public SolicitudTarea save(SolicitudTarea solicitudTarea) {
        var usuario = usuarioService.findOne(solicitudTarea.getId().getUsuarioId());
        var tarea = tareaService.findOne(solicitudTarea.getId().getTareaId());

        solicitudTarea.setUsuario(usuario);
        solicitudTarea.setTarea(tarea);

        return solicitudTareaRepository.save(solicitudTarea);
    }

    public void delete(SolicitudTareaId id) {
        solicitudTareaRepository.deleteById(id);
    }
}