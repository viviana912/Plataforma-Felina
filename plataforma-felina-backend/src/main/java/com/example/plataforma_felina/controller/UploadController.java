package com.example.plataforma_felina.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "*")
public class UploadController {

    @Value("${app.uploads.dir:/app/uploads}")
    private String uploadsDir;

    @Value("${app.uploads.public-base-url:http://localhost:8080}")
    private String publicBaseUrl;

    @PostMapping
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Archivo vacío"));
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Solo se permiten imágenes"));
        }

        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf(".")).toLowerCase();
        }
        String filename = UUID.randomUUID() + ext;

        Path dir = Paths.get(uploadsDir);
        Files.createDirectories(dir);
        Path target = dir.resolve(filename);
        file.transferTo(target);

        String relativeUrl = "/uploads/" + filename;
        String fullUrl = publicBaseUrl + relativeUrl;
        return ResponseEntity.ok(Map.of("url", relativeUrl, "fullUrl", fullUrl));
    }
}
