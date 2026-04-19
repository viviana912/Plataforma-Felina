package com.example.plataforma_felina.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // Clave para firmar los tokens y tiempo de vida (1 día)
    private final String SECRET = "Plataform4-Felin4-Proyect0-Llave-segurid4d";
    private final long EXPIRATION = 1000 * 60 * 60 * 24;

    // Genera la llave de cifrado a partir del string secreto
    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // Crea el JWT metiendo el email y el rol del usuario
    public String generateToken(String email, String rol) {
        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Abre el token para ver qué trae dentro (los claims)
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Saca el email del usuario directamente del token
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    // Verifica que el token sea auténtico y no haya caducado
    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            // Si algo falla o el token es falso, no pasa la validación
            return false;
        }
    }
}