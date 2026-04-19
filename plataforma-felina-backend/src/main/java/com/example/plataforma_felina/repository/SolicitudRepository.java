package com.example.plataforma_felina.repository;

import com.example.plataforma_felina.domain.Solicitud;
import com.example.plataforma_felina.domain.SolicitudId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, SolicitudId> {
}
