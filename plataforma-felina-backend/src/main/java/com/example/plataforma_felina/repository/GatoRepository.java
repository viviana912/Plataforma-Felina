package com.example.plataforma_felina.repository;

import com.example.plataforma_felina.domain.Gato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GatoRepository extends JpaRepository<Gato, Long> {
}
