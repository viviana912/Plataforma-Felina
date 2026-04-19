package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.domain.Tarea;
import com.example.plataforma_felina.service.TareaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT, RequestMethod.OPTIONS})
public class TareaController {

    private final TareaService tareaService;

    public TareaController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    @GetMapping
    public List<Tarea> getAll() {
        return tareaService.getAllTareas();
    }

    @GetMapping("/{id}")
    public Tarea getById(@PathVariable Long id) {
        return tareaService.findOne(id);
    }

    @PostMapping
    public Tarea create(@RequestBody Tarea tarea) {
        return tareaService.save(tarea);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        tareaService.delete(id);
    }
}
