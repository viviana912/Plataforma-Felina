package com.example.plataforma_felina.service;

import com.example.plataforma_felina.dto.ChatDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GeminiClient {

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String modelo;

    private static final String ENDPOINT_BASE =
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean configurado() {
        return apiKey != null && !apiKey.isBlank();
    }

    public String generar(String systemInstruction, List<ChatDTO.Mensaje> historia, String mensajeNuevo) {
        if (!configurado()) {
            throw new IllegalStateException("GEMINI_API_KEY no configurada");
        }

        List<Map<String, Object>> contents = new ArrayList<>();
        boolean vistoUsuario = false;
        if (historia != null) {
            for (ChatDTO.Mensaje m : historia) {
                boolean esModel = "asistente".equalsIgnoreCase(m.getRol());
                if (!vistoUsuario && esModel) continue;
                if (!esModel) vistoUsuario = true;
                contents.add(Map.of(
                        "role", esModel ? "model" : "user",
                        "parts", List.of(Map.of("text", m.getTexto()))
                ));
            }
        }
        contents.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", mensajeNuevo))
        ));

        Map<String, Object> body = Map.of(
                "contents", contents,
                "systemInstruction", Map.of(
                        "parts", List.of(Map.of("text", systemInstruction))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.8,
                        "maxOutputTokens", 600
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        String url = String.format(ENDPOINT_BASE, modelo, apiKey);
        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);

        if (response == null) return "";
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
        if (candidates == null || candidates.isEmpty()) return "";
        @SuppressWarnings("unchecked")
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        if (content == null) return "";
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) return "";
        Object texto = parts.get(0).get("text");
        return texto != null ? texto.toString() : "";
    }
}
