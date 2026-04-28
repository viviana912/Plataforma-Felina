package com.example.plataforma_felina.repository;

import com.example.plataforma_felina.domain.PagoApadrinamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagoApadrinamientoRepository extends JpaRepository<PagoApadrinamiento, Long> {

    List<PagoApadrinamiento> findByApadrinamientoUsuarioIdOrderByFechaCobroDesc(Long usuarioId);
}
