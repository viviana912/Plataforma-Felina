package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.domain.Favorito;
import com.example.plataforma_felina.domain.Gato;
import com.example.plataforma_felina.security.SecurityUtils;
import com.example.plataforma_felina.service.FavoritoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favoritos")
@CrossOrigin(origins = "*")
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Gato> listar(@PathVariable Long usuarioId) {
        SecurityUtils.requireAccessToUser(usuarioId);
        return favoritoService.listarGatosDeUsuario(usuarioId);
    }

    @PostMapping
    public Favorito agregar(@RequestBody Map<String, Long> body) {
        Long usuarioId = body.get("usuarioId");
        Long gatoId = body.get("gatoId");
        SecurityUtils.requireAccessToUser(usuarioId);
        return favoritoService.agregar(usuarioId, gatoId);
    }

    @DeleteMapping("/usuario/{usuarioId}/gato/{gatoId}")
    public void quitar(@PathVariable Long usuarioId, @PathVariable Long gatoId) {
        SecurityUtils.requireAccessToUser(usuarioId);
        favoritoService.quitar(usuarioId, gatoId);
    }
}
