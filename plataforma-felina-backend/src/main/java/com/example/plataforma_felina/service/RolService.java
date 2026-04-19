package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.Rol;
import com.example.plataforma_felina.repository.RolRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService {

    private final RolRepository rolRepository;
    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    public List<Rol> getAllRoles() {
        return rolRepository.findAll();
    }

    public Rol findOne(Long id) {
        return rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
    }

    public Rol save(Rol rol) {
        return rolRepository.save(rol);
    }

    public void delete(Long id) {
        rolRepository.deleteById(id);
    }
}
