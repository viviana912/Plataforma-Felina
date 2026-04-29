package com.example.plataforma_felina.repository;

import com.example.plataforma_felina.domain.ActualizacionGato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ActualizacionGatoRepository extends JpaRepository<ActualizacionGato, Long> {

    List<ActualizacionGato> findByGatoIdOrderByFechaDesc(Long gatoId);

    List<ActualizacionGato> findByGatoIdInOrderByFechaDesc(Collection<Long> gatoIds);
}
