package com.kinanow.payment.controller;

import com.kinanow.payment.model.PaymentMethod;
import com.kinanow.payment.service.PaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/payment-methods")
@RequiredArgsConstructor
public class PaymentMethodController {
    private final PaymentMethodService service;

    @PostMapping
    public ResponseEntity<PaymentMethod> addPaymentMethod(@RequestBody PaymentMethod method) {
        // TODO: Ensure only ADMIN can access this
        return ResponseEntity.ok(service.addPaymentMethod(method));
    }

    @GetMapping
    public ResponseEntity<List<PaymentMethod>> getAllPaymentMethods() {
        // TODO: Perhaps filter active ones for public endpoint, all for admin
        return ResponseEntity.ok(service.getAllPaymentMethods());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<PaymentMethod>> getActivePaymentMethods() {
        return ResponseEntity.ok(service.getActivePaymentMethods());
    }
}
