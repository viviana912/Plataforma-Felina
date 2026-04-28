package com.example.plataforma_felina.repository;

import com.example.plataforma_felina.domain.Donacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonacionRepository extends JpaRepository<Donacion,Long> {

    boolean existsByUsuarioId(Long usuarioId);

    List<Donacion> findByUsuarioIdOrderByFechaDonacionDesc(Long usuarioId);
}
