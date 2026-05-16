package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.domain.Apadrinamiento;
import com.example.plataforma_felina.security.SecurityUtils;
import com.example.plataforma_felina.service.ApadrinamientoService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/apadrinamientos")
@CrossOrigin(origins = "*")
public class ApadrinamientoController {

    private final ApadrinamientoService apadrinamientoService;

    public ApadrinamientoController(ApadrinamientoService apadrinamientoService) {
        this.apadrinamientoService = apadrinamientoService;
    }

    @PostMapping
    public Apadrinamiento create(@RequestBody Apadrinamiento req) {
        Long bodyUsuarioId = req.getUsuario() == null ? null : req.getUsuario().getId();
        SecurityUtils.requireAccessToUser(bodyUsuarioId);
        return apadrinamientoService.crear(req);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Apadrinamiento> getByUsuario(@PathVariable Long usuarioId) {
        SecurityUtils.requireAccessToUser(usuarioId);
        return apadrinamientoService.getByUsuario(usuarioId);
    }

    @PutMapping("/{id}/cancelar")
    public Apadrinamiento cancelar(@PathVariable Long id) {
        SecurityUtils.requireAccessToUser(apadrinamientoService.getOwnerId(id));
        return apadrinamientoService.cancelar(id);
    }

    @PutMapping("/{id}/importe")
    public Apadrinamiento actualizarImporte(@PathVariable Long id, @RequestBody Map<String, BigDecimal> body) {
        SecurityUtils.requireAccessToUser(apadrinamientoService.getOwnerId(id));
        return apadrinamientoService.actualizarImporte(id, body.get("importeMensual"));
    }

    @PostMapping("/usuario/{usuarioId}/procesar-cobros")
    public Map<String, Integer> procesarCobros(@PathVariable Long usuarioId) {
        SecurityUtils.requireAccessToUser(usuarioId);
        int generados = apadrinamientoService.procesarCobrosPendientes(usuarioId);
        return Map.of("cobrosGenerados", generados);
    }
}
