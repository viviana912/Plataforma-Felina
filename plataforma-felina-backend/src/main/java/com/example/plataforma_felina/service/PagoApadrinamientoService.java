package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.PagoApadrinamiento;
import com.example.plataforma_felina.repository.PagoApadrinamientoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PagoApadrinamientoService {

    private final PagoApadrinamientoRepository pagoRepository;

    public PagoApadrinamientoService(PagoApadrinamientoRepository pagoRepository) {
        this.pagoRepository = pagoRepository;
    }

    public List<PagoApadrinamiento> getByUsuario(Long usuarioId) {
        return pagoRepository.findByApadrinamientoUsuarioIdOrderByFechaCobroDesc(usuarioId);
    }
}
