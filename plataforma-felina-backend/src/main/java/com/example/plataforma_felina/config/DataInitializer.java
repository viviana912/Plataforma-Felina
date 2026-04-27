package com.example.plataforma_felina.config;

import com.example.plataforma_felina.domain.Rol;
import com.example.plataforma_felina.repository.RolRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedRoles(RolRepository rolRepository) {
        return args -> {
            if (rolRepository.findByNombre("USER").isEmpty()) {
                rolRepository.save(Rol.builder().nombre("USER").build());
            }
            if (rolRepository.findByNombre("ADMIN").isEmpty()) {
                rolRepository.save(Rol.builder().nombre("ADMIN").build());
            }
        };
    }
}
