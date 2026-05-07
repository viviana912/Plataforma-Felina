package com.example.plataforma_felina.repository;

import com.example.plataforma_felina.domain.Solicitud;
import com.example.plataforma_felina.domain.SolicitudId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, SolicitudId> {

    @Query("SELECT COUNT(s) > 0 FROM Solicitud s WHERE s.id.usuarioId = :usuarioId AND UPPER(s.estado) = :estado")
    boolean existsByUsuarioIdAndEstado(@Param("usuarioId") Long usuarioId, @Param("estado") String estado);

    List<Solicitud> findByIdUsuarioId(Long usuarioId);
}
