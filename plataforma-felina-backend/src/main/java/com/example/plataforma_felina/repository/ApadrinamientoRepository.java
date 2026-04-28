package com.example.plataforma_felina.repository;

import com.example.plataforma_felina.domain.Apadrinamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ApadrinamientoRepository extends JpaRepository<Apadrinamiento, Long> {

    List<Apadrinamiento> findByUsuarioIdOrderByFechaInicioDesc(Long usuarioId);

    List<Apadrinamiento> findByUsuarioIdAndEstadoAndProximoCobroLessThanEqual(
            Long usuarioId, String estado, LocalDate fecha);
}
