package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.Tarea;
import com.example.plataforma_felina.repository.TareaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;

    public TareaService(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    public List<Tarea> getAllTareas() {
        return tareaRepository.findAll();
    }

    public Tarea findOne(Long id){
        return tareaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
    }

    public Tarea save(Tarea tarea){
        return tareaRepository.save(tarea);
    }

    public void delete(Long id){
        tareaRepository.deleteById(id);
    }
}
