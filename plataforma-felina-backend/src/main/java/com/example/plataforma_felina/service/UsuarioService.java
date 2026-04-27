package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.Rol;
import com.example.plataforma_felina.domain.Usuario;
import com.example.plataforma_felina.dto.InsigniasDTO;
import com.example.plataforma_felina.dto.Registro;
import com.example.plataforma_felina.dto.UsuarioDTO;
import com.example.plataforma_felina.repository.DonacionRepository;
import com.example.plataforma_felina.repository.RolRepository;
import com.example.plataforma_felina.repository.SolicitudRepository;
import com.example.plataforma_felina.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final RolRepository rolRepository;
    private final SolicitudRepository solicitudRepository;
    private final DonacionRepository donacionRepository;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          RolRepository rolRepository,
                          SolicitudRepository solicitudRepository,
                          DonacionRepository donacionRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.rolRepository = rolRepository;
        this.solicitudRepository = solicitudRepository;
        this.donacionRepository = donacionRepository;
    }

    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Usuario findOne(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public UsuarioDTO getDTOById(Long id) {
        return toDTO(findOne(id));
    }

    public UsuarioDTO register(Registro request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }

        Rol rolUser = rolRepository.findByNombre("USER")
                .orElseThrow(() -> new RuntimeException("Rol USER no encontrado en la base de datos"));

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .telefono(request.getTelefono())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fotoUrl("assets/default-avatar.png")
                .rol(rolUser)
                .build();

        return toDTO(usuarioRepository.save(usuario));
    }

    public UsuarioDTO update(Long id, Usuario usuarioActualizado) {
        Usuario existente = findOne(id);

        existente.setNombre(usuarioActualizado.getNombre());
        existente.setApellido(usuarioActualizado.getApellido());
        existente.setTelefono(usuarioActualizado.getTelefono());

        return toDTO(usuarioRepository.save(existente));
    }

    public UsuarioDTO login(String email, String password) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, usuario.getPasswordHash())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return toDTO(usuario);
    }

    public void delete(Long id) {
        usuarioRepository.deleteById(id);
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .email(usuario.getEmail())
                .telefono(usuario.getTelefono())
                .rol(usuario.getRol())
                .fotoUrl(usuario.getFotoUrl())
                .build();
    }

    public void cambiarRolUsuario(Long id, Long nuevoRolId) {
        Usuario usuario = findOne(id);

        Rol nuevoRol = rolRepository.findById(nuevoRolId)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        usuario.setRol(nuevoRol);
        usuarioRepository.save(usuario);
    }

    public void actualizarFotoUsuario(Long id, String nuevaFotoUrl) {
        Usuario usuario = findOne(id);
        usuario.setFotoUrl(nuevaFotoUrl);
        usuarioRepository.save(usuario);
    }

    public InsigniasDTO getInsignias(Long usuarioId) {
        Usuario usuario = findOne(usuarioId);

        boolean familia = solicitudRepository.existsByUsuarioIdAndEstado(usuarioId, "APROBADA");
        boolean donante = donacionRepository.existsByUsuarioId(usuarioId);
        boolean veterano = usuario.getFechaRegistro() != null
                && usuario.getFechaRegistro().isBefore(LocalDateTime.now().minusYears(1));

        return new InsigniasDTO(familia, donante, veterano);
    }
}