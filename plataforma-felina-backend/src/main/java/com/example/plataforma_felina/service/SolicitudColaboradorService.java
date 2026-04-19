package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.Rol;
import com.example.plataforma_felina.domain.SolicitudColaborador;
import com.example.plataforma_felina.domain.Usuario;
import com.example.plataforma_felina.repository.SolicitudColaboradorRepository;
import com.example.plataforma_felina.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class SolicitudColaboradorService {

    private final SolicitudColaboradorRepository solicitudColaboradorRepository;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final RolService rolService;

    public SolicitudColaboradorService(SolicitudColaboradorRepository solicitudColaboradorRepository,
                                       UsuarioService usuarioService,
                                       UsuarioRepository usuarioRepository,
                                       RolService rolService) {
        this.solicitudColaboradorRepository = solicitudColaboradorRepository;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.rolService = rolService;
    }

    public List<SolicitudColaborador> getAll() {
        return solicitudColaboradorRepository.findAll();
    }

    public SolicitudColaborador findOne(Long usuarioId) {
        return solicitudColaboradorRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Solicitud de colaborador no encontrada"));
    }

    @Transactional
    public SolicitudColaborador save(SolicitudColaborador solicitudColaborador) {
        if (solicitudColaborador.getUsuario() == null || solicitudColaborador.getUsuario().getId() == null) {
            throw new RuntimeException("Se requiere un ID de usuario válido");
        }

        Usuario usuario = usuarioService.findOne(solicitudColaborador.getUsuario().getId());

        solicitudColaborador.setUsuario(usuario);
        solicitudColaborador.setFechaSolicitud(LocalDate.now());

        return solicitudColaboradorRepository.save(solicitudColaborador);
    }

    public void delete(Long usuarioId) {
        solicitudColaboradorRepository.deleteById(usuarioId);
    }

    @Transactional
    public SolicitudColaborador aprobarSolicitud(Long usuarioId) {
        SolicitudColaborador solicitud = solicitudColaboradorRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitud.setEstado("APROBADA");

        Usuario usuario = solicitud.getUsuario();

        Rol rolColaborador = rolService.findOne(2L);

        usuario.setRol(rolColaborador);

        usuarioRepository.save(usuario);

        return solicitudColaboradorRepository.save(solicitud);
    }
    @Transactional
    public SolicitudColaborador actualizarEstado(Long usuarioId, String nuevoEstado) {
        // 1. Buscamos la solicitud
        SolicitudColaborador solicitud = solicitudColaboradorRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        // 2. Actualizamos el estado de la solicitud
        solicitud.setEstado(nuevoEstado);

        // 3. Obtenemos el usuario vinculado
        Usuario usuario = solicitud.getUsuario();

        // 4. Lógica de Roles según tus capturas (ADMIN=1, USUARIO=2)
        if ("APROBADA".equals(nuevoEstado)) {
            Rol rolAdmin = rolService.findOne(1L); // ID 1 según tu imagen
            usuario.setRol(rolAdmin);
        } else {
            Rol rolUsuario = rolService.findOne(2L); // ID 2 según tu imagen
            usuario.setRol(rolUsuario);
        }

        // 5. IMPORTANTE: Guardamos el usuario para que cambie la columna 'id_rol'
        usuarioRepository.save(usuario);

        // 6. Guardamos la solicitud
        return solicitudColaboradorRepository.save(solicitud);
    }
}