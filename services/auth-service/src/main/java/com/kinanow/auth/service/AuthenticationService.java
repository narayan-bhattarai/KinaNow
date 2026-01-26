package com.kinanow.auth.service;

import com.kinanow.auth.dto.AuthenticationRequest;
import com.kinanow.auth.dto.AuthenticationResponse;
import com.kinanow.auth.dto.RegisterRequest;
import com.kinanow.auth.model.Role;
import com.kinanow.auth.model.User;
import com.kinanow.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        // Public registration: ALWAYS Customer, ignores request role/merchantId
        public AuthenticationResponse register(RegisterRequest request) {
                var user = User.builder()
                                .fullName(request.getFullName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.CUSTOMER) // Strict Enforcement: Public register = Customer
                                .merchantId(null) // Strict Enforcement: Customers don't have merchantId
                                .build();
                repository.save(user);
                var jwtToken = jwtService.generateToken(user);
                var refreshToken = jwtService.generateToken(new HashMap<>(), user);
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                .refreshToken(refreshToken)
                                .userId(user.getId())
                                .role(user.getRole().name())
                                .fullName(user.getFullName())
                                .merchantId(user.getMerchantId())
                                .email(user.getEmail())
                                .build();
        }

        // Internal creation (Portal): Enforces hierarchy
        public AuthenticationResponse createUser(RegisterRequest request, User creator) {
                System.out.println("CreateUser called by: " + creator.getEmail() + " (" + creator.getRole() + ")");
                Role targetRole = request.getRole();
                System.out.println("Target Role: " + targetRole);

                if (targetRole == null)
                        throw new IllegalArgumentException("Role is required.");

                if (creator.getRole() == Role.ADMIN) {
                        if (targetRole == Role.CUSTOMER) {
                                throw new SecurityException("Admins cannot create Customers.");
                        }
                        // Admin creating Merchant or Admin
                } else if (creator.getRole() == Role.MERCHANT) {
                        if (targetRole != Role.MERCHANT) {
                                throw new SecurityException("Merchants can only create other Merchant users.");
                        }
                        java.util.UUID assignedMerchantId = creator.getMerchantId() != null ? creator.getMerchantId()
                                        : creator.getId();
                        request.setMerchantId(assignedMerchantId);
                } else {
                        throw new SecurityException("Unauthorized to create users.");
                }

                var user = User.builder()
                                .fullName(request.getFullName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(targetRole)
                                .merchantId(request.getMerchantId())
                                .build();

                System.out.println("Saving user: " + user.getEmail() + " with MerchantID: " + user.getMerchantId());
                repository.save(user);

                return AuthenticationResponse.builder()
                                .userId(user.getId())
                                .role(user.getRole().name())
                                .fullName(user.getFullName())
                                .merchantId(user.getMerchantId())
                                .email(user.getEmail())
                                .build();
        }

        // ... authenticate ...
        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow();
                var jwtToken = jwtService.generateToken(user);
                var refreshToken = jwtService.generateToken(new HashMap<>(), user);
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                .refreshToken(refreshToken)
                                .userId(user.getId())
                                .role(user.getRole().name())
                                .fullName(user.getFullName())
                                .merchantId(user.getMerchantId())
                                .email(user.getEmail())
                                .build();
        }

        public User updateUser(java.util.UUID id, RegisterRequest request) {
                var user = repository.findById(id)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                if (request.getFullName() != null)
                        user.setFullName(request.getFullName());
                if (request.getEmail() != null)
                        user.setEmail(request.getEmail());
                if (request.getRole() != null)
                        user.setRole(request.getRole());
                if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                        user.setPassword(passwordEncoder.encode(request.getPassword()));
                }
                return repository.save(user);
        }

        public void deleteUser(java.util.UUID id) {
                repository.deleteById(id);
        }

        public java.util.List<User> getUsers(java.util.UUID merchantId) {
                if (merchantId != null) {
                        return repository.findByMerchantId(merchantId);
                }
                return repository.findAll();
        }
}
