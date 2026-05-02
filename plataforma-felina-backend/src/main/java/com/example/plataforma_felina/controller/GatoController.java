package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.domain.Gato;
import com.example.plataforma_felina.service.GatoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gatos")
@CrossOrigin(origins = "*")
public class GatoController {

    private final GatoService gatoService;

    public GatoController(GatoService gatoService) {
        this.gatoService = gatoService;
    }

    @GetMapping
    public List<Gato> getAll() {
        return gatoService.getAllGatos();
    }

    @GetMapping("/disponibles")
    public List<Gato> getDisponibles() {
        return gatoService.getDisponibles();
    }

    @GetMapping("/{id}")
    public Gato getById(@PathVariable Long id) {
        return gatoService.findOne(id);
    }

    @PostMapping
    public Gato create(@RequestBody Gato gato) {
        return gatoService.save(gato);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        gatoService.delete(id);
    }

    @PutMapping("/{id}")
    public Gato update(@PathVariable Long id, @RequestBody Gato gato) {
        Gato existing = gatoService.findOne(id);

        existing.setNombre(gato.getNombre());
        existing.setSexo(gato.getSexo());
        existing.setFechaNacimiento(gato.getFechaNacimiento());
        existing.setRaza(gato.getRaza());
        existing.setColor(gato.getColor());
        existing.setVacunas(gato.getVacunas());
        existing.setCaracter(gato.getCaracter());
        existing.setNotas(gato.getNotas());


        existing.setEstado(gato.getEstado());
        existing.setFotoUrl(gato.getFotoUrl());
        existing.setUrgente(gato.isUrgente());

        existing.setVacunado(gato.getVacunado());
        existing.setCastrado(gato.getCastrado());
        existing.setDesparasitado(gato.getDesparasitado());
        existing.setMicrochip(gato.getMicrochip());
        existing.setAptoNinos(gato.getAptoNinos());
        existing.setAptoOtrosGatos(gato.getAptoOtrosGatos());
        existing.setAptoPerros(gato.getAptoPerros());

        return gatoService.save(existing);
    }

    @GetMapping("/adoptados")
public List<Gato> getAdoptados() {
    return gatoService.getAdoptados();
}
}
