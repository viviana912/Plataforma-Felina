package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.ActualizacionGato;
import com.example.plataforma_felina.domain.Apadrinamiento;
import com.example.plataforma_felina.domain.Gato;
import com.example.plataforma_felina.repository.ActualizacionGatoRepository;
import com.example.plataforma_felina.repository.ApadrinamientoRepository;
import com.example.plataforma_felina.repository.GatoRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ActualizacionGatoService {

    private final ActualizacionGatoRepository actualizacionRepository;
    private final ApadrinamientoRepository apadrinamientoRepository;
    private final GatoRepository gatoRepository;

    public ActualizacionGatoService(ActualizacionGatoRepository actualizacionRepository,
                                    ApadrinamientoRepository apadrinamientoRepository,
                                    GatoRepository gatoRepository) {
        this.actualizacionRepository = actualizacionRepository;
        this.apadrinamientoRepository = apadrinamientoRepository;
        this.gatoRepository = gatoRepository;
    }

    public ActualizacionGato crear(Long gatoId, ActualizacionGato datos) {
        Gato gato = gatoRepository.findById(gatoId)
                .orElseThrow(() -> new RuntimeException("Gato no encontrado"));
        datos.setGato(gato);
        datos.setId(null);
        return actualizacionRepository.save(datos);
    }

    public void borrar(Long id) {
        actualizacionRepository.deleteById(id);
    }

    public List<ActualizacionGato> listarDeGato(Long gatoId) {
        return actualizacionRepository.findByGatoIdOrderByFechaDesc(gatoId);
    }

    public List<ActualizacionGato> feedDeUsuario(Long usuarioId) {
        List<Apadrinamiento> activos = apadrinamientoRepository.findByUsuarioIdAndEstado(usuarioId, "ACTIVO");
        if (activos.isEmpty()) {
            return Collections.emptyList();
        }
        List<Long> gatoIds = activos.stream()
                .map(a -> a.getGato().getId())
                .distinct()
                .toList();
        return actualizacionRepository.findByGatoIdInOrderByFechaDesc(gatoIds);
    }
}
