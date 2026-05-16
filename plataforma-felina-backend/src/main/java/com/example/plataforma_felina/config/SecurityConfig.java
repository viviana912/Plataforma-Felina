package com.example.plataforma_felina.config;

import com.example.plataforma_felina.security.JwtAuthenticationFilter;
import com.example.plataforma_felina.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtService jwtService) throws Exception {
        JwtAuthenticationFilter jwtFilter = new JwtAuthenticationFilter(jwtService);

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Preflight CORS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Públicos
                        .requestMatchers("/api/usuarios/login", "/api/usuarios/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/health").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/gatos",
                                "/api/gatos/disponibles",
                                "/api/gatos/adoptados",
                                "/api/gatos/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/actualizaciones/gato/*").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/donaciones").permitAll()

                        // Solo ADMIN: gestión del catálogo de gatos y actualizaciones
                        .requestMatchers(HttpMethod.POST, "/api/gatos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/gatos/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/gatos/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/actualizaciones/gato/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/actualizaciones/*").hasRole("ADMIN")

                        // Solo ADMIN: paneles globales
                        .requestMatchers(HttpMethod.GET, "/api/donaciones").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/solicitudes").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/solicitudes/*/*/estado").hasRole("ADMIN")

                        // Solo ADMIN: gestión de tareas
                        .requestMatchers(HttpMethod.POST, "/api/tareas").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/tareas/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/tareas/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/solicitudes-tarea").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/solicitudes-tarea/tarea/*").hasRole("ADMIN")

                        // Solo ADMIN: gestión de usuarios
                        .requestMatchers(HttpMethod.GET, "/api/usuarios").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/usuarios/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/usuarios/*/rol").hasRole("ADMIN")

                        // Resto: cualquier usuario autenticado
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "x-auth-token"));
        configuration.setExposedHeaders(Arrays.asList("x-auth-token"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
