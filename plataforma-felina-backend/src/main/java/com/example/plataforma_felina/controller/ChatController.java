package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.domain.Gato;
import com.example.plataforma_felina.dto.ChatDTO;
import com.example.plataforma_felina.service.GatoService;
import com.example.plataforma_felina.service.GeminiClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private static final String SYSTEM_PROMPT_BASE = """
            Eres Bigotín, el asistente virtual de Plataforma Felina, una protectora de gatos.
            Tu tarea es ayudar al usuario a encontrar el gato más adecuado para él entre los disponibles.
            Habla en español, con tono cercano y cariñoso, sin emojis (o muy pocos).
            Solo recomiendas gatos del catálogo que te paso a continuación, llamándolos por su nombre.
            Cuando recomiendes, indica el nombre y por qué encaja con lo que ha dicho el usuario.
            Si te preguntan por temas no relacionados, redirige amablemente a la búsqueda del gato perfecto.
            Sé conciso (máximo 4-5 frases por respuesta).
            """;

    private static final long COOLDOWN_MS = 3000;
    private static final int MAX_HISTORIA = 8;
    private static final int MAX_CATALOGO = 30;

    private final GeminiClient geminiClient;
    private final GatoService gatoService;
    private final Map<Long, Long> ultimoCallPorUsuario = new HashMap<>();

    public ChatController(GeminiClient geminiClient, GatoService gatoService) {
        this.geminiClient = geminiClient;
        this.gatoService = gatoService;
    }

    @PostMapping
    public ResponseEntity<ChatDTO.Respuesta> chatear(@RequestBody ChatDTO.Peticion peticion) {
        if (!geminiClient.configurado()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ChatDTO.Respuesta("Bigotín está echando una siesta. Vuelve más tarde."));
        }

        if (peticion.getUsuarioId() != null) {
            long ahora = Instant.now().toEpochMilli();
            Long ultimo = ultimoCallPorUsuario.get(peticion.getUsuarioId());
            if (ultimo != null && (ahora - ultimo) < COOLDOWN_MS) {
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(new ChatDTO.Respuesta("Espera un momento antes de enviar otro mensaje."));
            }
            ultimoCallPorUsuario.put(peticion.getUsuarioId(), ahora);
        }

        String catalogo = construirCatalogo();
        String systemPrompt = SYSTEM_PROMPT_BASE + "\n\nCATÁLOGO DE GATOS DISPONIBLES (formato JSON):\n" + catalogo;

        List<ChatDTO.Mensaje> historia = peticion.getHistoria() == null
                ? List.of()
                : peticion.getHistoria();
        if (historia.size() > MAX_HISTORIA) {
            historia = historia.subList(historia.size() - MAX_HISTORIA, historia.size());
        }

        try {
            String respuesta = geminiClient.generar(systemPrompt, historia, peticion.getMensaje());
            if (respuesta == null || respuesta.isBlank()) {
                respuesta = "Bigotín no ha sabido qué responder. ¿Puedes contarme algo más?";
            }
            return ResponseEntity.ok(new ChatDTO.Respuesta(respuesta));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(new ChatDTO.Respuesta("Bigotín se ha despistado un momento. Inténtalo de nuevo en unos segundos."));
        }
    }

    private String construirCatalogo() {
        List<Gato> disponibles = gatoService.getDisponibles();
        return disponibles.stream()
                .limit(MAX_CATALOGO)
                .map(this::resumirGato)
                .collect(Collectors.joining("\n"));
    }

    private String resumirGato(Gato g) {
        return String.format(
                "- %s (id %d): %s, %d años, raza %s. Estado: %s. Vacunado: %s. Castrado: %s. Apto niños: %s. Apto otros gatos: %s. Apto perros: %s. Urgente: %s. Carácter: %s",
                safe(g.getNombre()),
                g.getId(),
                safe(g.getSexo()),
                g.getEdad(),
                safe(g.getRaza()),
                safe(g.getEstado()),
                bool(g.getVacunado()),
                bool(g.getCastrado()),
                bool(g.getAptoNinos()),
                bool(g.getAptoOtrosGatos()),
                bool(g.getAptoPerros()),
                g.isUrgente() ? "sí" : "no",
                resumirTexto(g.getCaracter(), 80)
        );
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }

    private String bool(Boolean b) {
        if (b == null) return "desconocido";
        return b ? "sí" : "no";
    }

    private String resumirTexto(String texto, int max) {
        if (texto == null) return "";
        String limpio = texto.replaceAll("\\s+", " ").trim();
        return limpio.length() > max ? limpio.substring(0, max) + "..." : limpio;
    }
}
