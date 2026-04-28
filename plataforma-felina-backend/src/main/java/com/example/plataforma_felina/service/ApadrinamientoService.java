package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.Apadrinamiento;
import com.example.plataforma_felina.domain.Gato;
import com.example.plataforma_felina.domain.PagoApadrinamiento;
import com.example.plataforma_felina.repository.ApadrinamientoRepository;
import com.example.plataforma_felina.repository.GatoRepository;
import com.example.plataforma_felina.repository.PagoApadrinamientoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ApadrinamientoService {

    private static final BigDecimal IMPORTE_MINIMO = new BigDecimal("1.00");

    private final ApadrinamientoRepository apadrinamientoRepository;
    private final PagoApadrinamientoRepository pagoRepository;
    private final GatoRepository gatoRepository;

    public ApadrinamientoService(ApadrinamientoRepository apadrinamientoRepository,
                                  PagoApadrinamientoRepository pagoRepository,
                                  GatoRepository gatoRepository) {
        this.apadrinamientoRepository = apadrinamientoRepository;
        this.pagoRepository = pagoRepository;
        this.gatoRepository = gatoRepository;
    }

    @Transactional
    public Apadrinamiento crear(Apadrinamiento req) {
        if (req.getImporteMensual() == null
                || req.getImporteMensual().compareTo(IMPORTE_MINIMO) < 0) {
            throw new RuntimeException("El importe mensual mínimo es 1 €");
        }
        if (req.getUsuario() == null || req.getGato() == null) {
            throw new RuntimeException("Usuario y gato son obligatorios");
        }

        LocalDate hoy = LocalDate.now();
        req.setFechaInicio(hoy);
        req.setProximoCobro(hoy.plusMonths(1));
        req.setEstado("ACTIVO");

        Apadrinamiento creado = apadrinamientoRepository.save(req);

        PagoApadrinamiento primerPago = PagoApadrinamiento.builder()
                .apadrinamiento(creado)
                .importe(creado.getImporteMensual())
                .fechaCobro(hoy)
                .build();
        pagoRepository.save(primerPago);

        Gato gato = gatoRepository.findById(creado.getGato().getId())
                .orElseThrow(() -> new RuntimeException("Gato no encontrado"));
        gato.setEstado("APADRINADO");
        gatoRepository.save(gato);

        return creado;
    }

    public List<Apadrinamiento> getByUsuario(Long usuarioId) {
        return apadrinamientoRepository.findByUsuarioIdOrderByFechaInicioDesc(usuarioId);
    }

    @Transactional
    public Apadrinamiento cancelar(Long id) {
        Apadrinamiento a = apadrinamientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apadrinamiento no encontrado"));
        a.setEstado("CANCELADO");
        apadrinamientoRepository.save(a);

        Gato gato = a.getGato();
        if (gato != null && "APADRINADO".equals(gato.getEstado())) {
            gato.setEstado("APADRINABLE");
            gatoRepository.save(gato);
        }
        return a;
    }

    @Transactional
    public int procesarCobrosPendientes(Long usuarioId) {
        LocalDate hoy = LocalDate.now();
        List<Apadrinamiento> pendientes = apadrinamientoRepository
                .findByUsuarioIdAndEstadoAndProximoCobroLessThanEqual(usuarioId, "ACTIVO", hoy);

        int cobrosGenerados = 0;
        for (Apadrinamiento a : pendientes) {
            while (!a.getProximoCobro().isAfter(hoy)) {
                PagoApadrinamiento pago = PagoApadrinamiento.builder()
                        .apadrinamiento(a)
                        .importe(a.getImporteMensual())
                        .fechaCobro(a.getProximoCobro())
                        .build();
                pagoRepository.save(pago);
                a.setProximoCobro(a.getProximoCobro().plusMonths(1));
                cobrosGenerados++;
            }
            apadrinamientoRepository.save(a);
        }
        return cobrosGenerados;
    }
}
