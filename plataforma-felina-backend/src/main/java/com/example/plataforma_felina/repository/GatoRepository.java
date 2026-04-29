package com.example.plataforma_felina.repository;

import com.example.plataforma_felina.domain.Gato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GatoRepository extends JpaRepository<Gato, Long> {

    @Query("SELECT g FROM Gato g WHERE g.estado IS NULL OR g.estado IN ('ADOPTABLE', 'APADRINABLE', 'ACOGIBLE') ORDER BY g.urgente DESC, g.id ASC")
    List<Gato> findDisponibles();

    @Query("SELECT g FROM Gato g WHERE g.estado = 'ADOPTADO' ORDER BY g.id DESC")
List<Gato> findAdoptados();
}
