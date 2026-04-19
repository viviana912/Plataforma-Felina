package com.example.plataforma_felina.repository;

import com.example.plataforma_felina.domain.SolicitudTarea;
import com.example.plataforma_felina.domain.SolicitudTareaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudTareaRepository extends JpaRepository<SolicitudTarea, SolicitudTareaId> {
}
