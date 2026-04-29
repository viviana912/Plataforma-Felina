package com.example.plataforma_felina.service;

import com.example.plataforma_felina.domain.Favorito;
import com.example.plataforma_felina.domain.Gato;
import com.example.plataforma_felina.domain.Usuario;
import com.example.plataforma_felina.repository.FavoritoRepository;
import com.example.plataforma_felina.repository.GatoRepository;
import com.example.plataforma_felina.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;
    private final GatoRepository gatoRepository;

    public FavoritoService(FavoritoRepository favoritoRepository,
                           UsuarioRepository usuarioRepository,
                           GatoRepository gatoRepository) {
        this.favoritoRepository = favoritoRepository;
        this.usuarioRepository = usuarioRepository;
        this.gatoRepository = gatoRepository;
    }

    @Transactional
    public Favorito agregar(Long usuarioId, Long gatoId) {
        if (favoritoRepository.existsByUsuarioIdAndGatoId(usuarioId, gatoId)) {
            return favoritoRepository.findByUsuarioIdOrderByFechaAnadidoDesc(usuarioId).stream()
                    .filter(f -> f.getGato().getId().equals(gatoId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Estado inconsistente de favoritos"));
        }
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Gato gato = gatoRepository.findById(gatoId)
                .orElseThrow(() -> new RuntimeException("Gato no encontrado"));

        Favorito favorito = Favorito.builder()
                .usuario(usuario)
                .gato(gato)
                .build();
        return favoritoRepository.save(favorito);
    }

    @Transactional
    public void quitar(Long usuarioId, Long gatoId) {
        favoritoRepository.deleteByUsuarioIdAndGatoId(usuarioId, gatoId);
    }

    public List<Gato> listarGatosDeUsuario(Long usuarioId) {
        return favoritoRepository.findByUsuarioIdOrderByFechaAnadidoDesc(usuarioId).stream()
                .map(Favorito::getGato)
                .toList();
    }
}
