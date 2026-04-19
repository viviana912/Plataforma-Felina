package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.Rol;
import com.example.plataforma_felina.domain.Usuario;
import com.example.plataforma_felina.dto.Registro;
import com.example.plataforma_felina.dto.UsuarioDTO;
import com.example.plataforma_felina.repository.RolRepository;
import com.example.plataforma_felina.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final RolRepository rolRepository;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.rolRepository = rolRepository;
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
            throw new RuntimeException("El email ya está registrado");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .telefono(request.getTelefono())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fotoUrl("assets/default-avatar.png")
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
}