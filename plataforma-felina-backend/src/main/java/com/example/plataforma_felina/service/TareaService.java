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

    public Tarea update(Long id, Tarea datos){
        Tarea existente = findOne(id);
        existente.setTitulo(datos.getTitulo());
        existente.setDescripcion(datos.getDescripcion());
        existente.setEstado(datos.getEstado());
        existente.setUrgencia(datos.getUrgencia());
        existente.setTipo(datos.getTipo());
        existente.setCodigoPostal(datos.getCodigoPostal());
        return tareaRepository.save(existente);
    }

    public void delete(Long id){
        tareaRepository.deleteById(id);
    }
}
