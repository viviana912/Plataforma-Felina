package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.domain.PagoApadrinamiento;
import com.example.plataforma_felina.security.SecurityUtils;
import com.example.plataforma_felina.service.PagoApadrinamientoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos-apadrinamiento")
@CrossOrigin(origins = "*")
public class PagoApadrinamientoController {

    private final PagoApadrinamientoService pagoService;

    public PagoApadrinamientoController(PagoApadrinamientoService pagoService) {
        this.pagoService = pagoService;
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<PagoApadrinamiento> getByUsuario(@PathVariable Long usuarioId) {
        SecurityUtils.requireAccessToUser(usuarioId);
        return pagoService.getByUsuario(usuarioId);
    }
}
