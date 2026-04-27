package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.Gato;
import com.example.plataforma_felina.domain.Solicitud;
import com.example.plataforma_felina.domain.SolicitudId;
import com.example.plataforma_felina.domain.Usuario;
import com.example.plataforma_felina.repository.SolicitudRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final UsuarioService usuarioService;
    private final GatoService gatoService;

    public SolicitudService(SolicitudRepository solicitudRepository,
                            UsuarioService usuarioService,
                            GatoService gatoService) {
        this.solicitudRepository = solicitudRepository;
        this.usuarioService = usuarioService;
        this.gatoService = gatoService;
    }

    public List<Solicitud> getAll() {
        return solicitudRepository.findAll();
    }

    public Solicitud findOne(SolicitudId id) {
        return solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
    }

    public Solicitud save(Solicitud solicitud) {
        Usuario usuario = usuarioService.findOne(solicitud.getId().getUsuarioId());
        Gato gato = gatoService.findOne(solicitud.getId().getGatoId());

        solicitud.setUsuario(usuario);
        solicitud.setGato(gato);

        return solicitudRepository.save(solicitud);
    }

    public Solicitud actualizarEstado(SolicitudId id, String nuevoEstado) {
        Solicitud solicitud = findOne(id);
        solicitud.setEstado(nuevoEstado);
        Solicitud guardada = solicitudRepository.save(solicitud);

        if ("APROBADA".equalsIgnoreCase(nuevoEstado)) {
            sincronizarEstadoGato(guardada);
        }

        return guardada;
    }

    private void sincronizarEstadoGato(Solicitud solicitud) {
        Gato gato = solicitud.getGato();
        if (gato == null) return;

        String tipo = solicitud.getTipoSolicitud();
        if (tipo == null) return;

        switch (tipo.toUpperCase()) {
            case "ADOPCION" -> gato.setEstado("ADOPTADO");
            case "APADRINAMIENTO" -> gato.setEstado("APADRINADO");
            case "ACOGIDA" -> gato.setEstado("EN_ACOGIDA");
            default -> { return; }
        }
        gatoService.save(gato);
    }

    public void delete(SolicitudId id) {
        solicitudRepository.deleteById(id);
    }
}