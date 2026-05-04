package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.Apadrinamiento;
import com.example.plataforma_felina.domain.Gato;
import com.example.plataforma_felina.domain.Usuario;
import com.example.plataforma_felina.repository.ApadrinamientoRepository;
import com.example.plataforma_felina.repository.PagoApadrinamientoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApadrinamientoServiceTest {

    @Mock
    private ApadrinamientoRepository apadrinamientoRepository;

    @Mock
    private PagoApadrinamientoRepository pagoRepository;

    @InjectMocks
    private ApadrinamientoService service;

    private Apadrinamiento peticion;

    @BeforeEach
    void setUp() {
        Usuario u = new Usuario();
        u.setId(1L);
        Gato g = new Gato();
        g.setId(2L);

        peticion = new Apadrinamiento();
        peticion.setUsuario(u);
        peticion.setGato(g);
        peticion.setImporteMensual(new BigDecimal("5.00"));
    }

    @Test
    void crear_rechazaImporteMenorQueUnEuro() {
        peticion.setImporteMensual(new BigDecimal("0.50"));

        assertThatThrownBy(() -> service.crear(peticion))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("importe mensual mínimo");
    }

    @Test
    void crear_rechazaCuandoFaltaUsuarioOGato() {
        peticion.setUsuario(null);

        assertThatThrownBy(() -> service.crear(peticion))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Usuario y gato");
    }

    @Test
    void crear_persisteApadrinamientoYPrimerPago() {
        when(apadrinamientoRepository.save(any(Apadrinamiento.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        Apadrinamiento creado = service.crear(peticion);

        assertThat(creado.getEstado()).isEqualTo("ACTIVO");
        assertThat(creado.getFechaInicio()).isEqualTo(LocalDate.now());
        assertThat(creado.getProximoCobro()).isEqualTo(LocalDate.now().plusMonths(1));
        verify(pagoRepository, times(1)).save(any());
    }

    @Test
    void cancelar_marcaEstadoComoCancelado() {
        Apadrinamiento existente = new Apadrinamiento();
        existente.setId(10L);
        existente.setEstado("ACTIVO");
        when(apadrinamientoRepository.findById(10L)).thenReturn(Optional.of(existente));
        when(apadrinamientoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Apadrinamiento cancelado = service.cancelar(10L);

        assertThat(cancelado.getEstado()).isEqualTo("CANCELADO");
    }

    @Test
    void actualizarImporte_rechazaCuandoEstadoNoEsActivo() {
        Apadrinamiento existente = new Apadrinamiento();
        existente.setId(10L);
        existente.setEstado("CANCELADO");
        when(apadrinamientoRepository.findById(10L)).thenReturn(Optional.of(existente));

        assertThatThrownBy(() -> service.actualizarImporte(10L, new BigDecimal("8.00")))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("activo");
    }
}
