package com.zahir.contactmanagement.controller;

import com.zahir.contactmanagement.DTOs.LoginRequest;
import com.zahir.contactmanagement.DTOs.RegisterRequest;
import com.zahir.contactmanagement.entity.User;
import com.zahir.contactmanagement.service.AuthService;
import com.zahir.contactmanagement.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request
    ) {
        try {

            User user = authService.register(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "id", user.getId(),
                            "email", user.getEmail(),
                            "phone", user.getPhone()
                    ));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message", e.getMessage()
                    ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {
        try {

            User user = authService.login(request);
            // Generate JWT
            String token = jwtService.generateToken(user.getEmail());

            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "id", user.getId(),
                            "email", user.getEmail(),
                            "phone", user.getPhone()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message", e.getMessage()
                    ));
        }
    }
}