package com.example.plataforma_felina.repository;

import com.example.plataforma_felina.domain.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuarioIdOrderByFechaAnadidoDesc(Long usuarioId);

    boolean existsByUsuarioIdAndGatoId(Long usuarioId, Long gatoId);

    @Modifying
    @Transactional
    void deleteByUsuarioIdAndGatoId(Long usuarioId, Long gatoId);
}
