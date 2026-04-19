package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.Donacion;
import com.example.plataforma_felina.domain.Gato;
import com.example.plataforma_felina.repository.DonacionRepository;
import com.example.plataforma_felina.repository.GatoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonacionService {

    private final DonacionRepository donacionRepository;

    public DonacionService(DonacionRepository donacionRepository) {
        this.donacionRepository = donacionRepository;
    }

    public List<Donacion> getAllDonacion() {
        return donacionRepository.findAll();
    }

    public Donacion findOne(Long id){
        return donacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donación no encontrada"));
    }

    public Donacion save(Donacion donacion){
        return donacionRepository.save(donacion);
    }

    public void delete(Long id){
        donacionRepository.deleteById(id);
    }
}
