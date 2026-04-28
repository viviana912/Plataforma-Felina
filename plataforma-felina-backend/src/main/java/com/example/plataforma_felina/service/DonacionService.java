package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.Donacion;
import com.example.plataforma_felina.repository.DonacionRepository;
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

    public List<Donacion> getByUsuario(Long usuarioId) {
        return donacionRepository.findByUsuarioIdOrderByFechaDonacionDesc(usuarioId);
    }

    public void delete(Long id){
        donacionRepository.deleteById(id);
    }
}
