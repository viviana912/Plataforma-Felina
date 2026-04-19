package com.example.plataforma_felina.repository;

import com.example.plataforma_felina.domain.SolicitudColaborador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudColaboradorRepository extends JpaRepository<SolicitudColaborador, Long> {
}
