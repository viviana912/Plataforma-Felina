package com.example.plataforma_felina.controller;

import com.example.plataforma_felina.service.GatoService;
import com.example.plataforma_felina.service.GeminiClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ChatController.class)
@AutoConfigureMockMvc(addFilters = false)
class ChatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private GeminiClient geminiClient;

    @MockitoBean
    private GatoService gatoService;

    @Test
    void devuelve503CuandoGeminiNoEstaConfigurado() throws Exception {
        when(geminiClient.configurado()).thenReturn(false);

        var body = Map.of("usuarioId", 99, "mensaje", "hola", "historia", List.of());

        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.respuesta").value(
                        org.hamcrest.Matchers.containsString("siesta")));
    }

    @Test
    void segundaPeticionConsecutivaDelMismoUsuarioDevuelve429() throws Exception {
        when(geminiClient.configurado()).thenReturn(true);
        when(gatoService.getDisponibles()).thenReturn(List.of());
        when(geminiClient.generar(anyString(), any(), anyString())).thenReturn("respuesta ok");

        var body = Map.of("usuarioId", 1, "mensaje", "hola", "historia", List.of());
        var json = objectMapper.writeValueAsString(body);

        // Primera llamada: ok
        mockMvc.perform(post("/api/chat").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isOk());

        // Segunda inmediata del mismo usuario: bloqueada por cooldown
        mockMvc.perform(post("/api/chat").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isTooManyRequests());
    }
}
