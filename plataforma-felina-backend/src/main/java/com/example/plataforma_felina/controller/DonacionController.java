package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.domain.Donacion;
import com.example.plataforma_felina.service.DonacionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donaciones")
@CrossOrigin(origins = "*")
public class DonacionController {

    private final DonacionService donacionService;

    public DonacionController(DonacionService donacionService) {
        this.donacionService = donacionService;
    }

    @GetMapping
    public List<Donacion> getAll() {
        return donacionService.getAllDonacion();
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<Donacion> getByUsuario(@PathVariable Long usuarioId) {
        return donacionService.getByUsuario(usuarioId);
    }

    @PostMapping
    public Donacion create(@RequestBody Donacion donacion) {
        return donacionService.save(donacion);
    }
}
