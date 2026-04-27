package com.example.plataforma_felina.controller;


import com.example.plataforma_felina.dto.InsigniasDTO;
import com.example.plataforma_felina.dto.Login;
import com.example.plataforma_felina.dto.LoginResponse;
import com.example.plataforma_felina.dto.Registro;
import com.example.plataforma_felina.dto.UsuarioDTO;
import com.example.plataforma_felina.security.JwtService;
import com.example.plataforma_felina.service.UsuarioService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    public UsuarioController(UsuarioService usuarioService, JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<UsuarioDTO> getAll() {
        return usuarioService.getAllUsuarios();
    }

    @PostMapping("/register")
    public UsuarioDTO register(@RequestBody Registro request) {
        return usuarioService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody Login request) {

        UsuarioDTO usuario = usuarioService.login(request.getEmail(), request.getPassword());

        String rol = usuario.getRol().getNombre();
        String token = jwtService.generateToken(usuario.getEmail(), rol);

        return new LoginResponse(token, usuario);
    }

    @GetMapping("/{id}")
    public UsuarioDTO getById(@PathVariable Long id) {
        return usuarioService.getDTOById(id);
    }

    @GetMapping("/{id}/insignias")
    public InsigniasDTO getInsignias(@PathVariable Long id) {
        return usuarioService.getInsignias(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        usuarioService.delete(id);
    }

    @PatchMapping("/{id}/rol")
    public void actualizarRol(@PathVariable Long id, @RequestBody java.util.Map<String, Long> payload) {
        Long nuevoRolId = payload.get("rolId");
        usuarioService.cambiarRolUsuario(id, nuevoRolId);


    }
    // Añade esto al final de tu UsuarioController
    @PatchMapping("/{id}/foto")
    public void actualizarFoto(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        String nuevaFotoUrl = payload.get("fotoUrl");
        usuarioService.actualizarFotoUsuario(id, nuevaFotoUrl);
        // 👆 Nota: Deberás añadir este método 'actualizarFotoUsuario' en tu UsuarioService.java
    }
}