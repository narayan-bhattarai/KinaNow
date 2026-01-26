package com.kinanow.auth.controller;

import com.kinanow.auth.dto.AuthenticationRequest;
import com.kinanow.auth.dto.AuthenticationResponse;
import com.kinanow.auth.dto.RegisterRequest;
import com.kinanow.auth.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/users")
    public ResponseEntity<AuthenticationResponse> createUser(
            @RequestBody RegisterRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.kinanow.auth.model.User currentUser) {
        return ResponseEntity.ok(service.createUser(request, currentUser));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/users")
    public ResponseEntity<java.util.List<com.kinanow.auth.model.User>> getUsers(
            @RequestParam(required = false) java.util.UUID merchantId) {
        return ResponseEntity.ok(service.getUsers(merchantId));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<com.kinanow.auth.model.User> updateUser(
            @PathVariable java.util.UUID id,
            @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.updateUser(id, request));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable java.util.UUID id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
