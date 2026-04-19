package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.Gato;
import com.example.plataforma_felina.repository.GatoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GatoService {

    private final GatoRepository gatoRepository;

    public GatoService(GatoRepository gatoRepository) {
        this.gatoRepository = gatoRepository;
    }

    public List<Gato> getAllGatos() {
        return gatoRepository.findAll();
    }

    public Gato findOne(Long id){
        return gatoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gato no encontrado"));
    }

    public Gato save(Gato gato){
        return gatoRepository.save(gato);
    }

    public void delete(Long id){
        gatoRepository.deleteById(id);
    }
}
