package com.kinanow.cart.controller;

import com.kinanow.cart.dto.AddToCartRequest;
import com.kinanow.cart.model.Cart;
import com.kinanow.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // TODO: Get USER_ID from Security Context (JWT)
    // For now, we accept it as a header or param for testing,
    // or assume we extract it in a real implementation.
    // Let's assume a temporary header "X-User-Id" for MVP simplicity
    // before integrating full Security Context Holder.

    @GetMapping
    public ResponseEntity<Cart> getCart(@RequestHeader("X-User-Id") String userIdStr) {
        UUID userId = UUID.fromString(userIdStr);
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addToCart(
            @RequestHeader("X-User-Id") String userIdStr,
            @RequestBody AddToCartRequest request) {
        UUID userId = UUID.fromString(userIdStr);
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Cart> removeFromCart(
            @RequestHeader("X-User-Id") String userIdStr,
            @PathVariable String productId) {
        UUID userId = UUID.fromString(userIdStr);
        return ResponseEntity.ok(cartService.removeFromCart(userId, productId));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<Cart> updateQuantity(
            @RequestHeader("X-User-Id") String userIdStr,
            @PathVariable String productId,
            @RequestParam Integer quantity) {
        UUID userId = UUID.fromString(userIdStr);
        return ResponseEntity.ok(cartService.updateQuantity(userId, productId, quantity));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@RequestHeader("X-User-Id") String userIdStr) {
        UUID userId = UUID.fromString(userIdStr);
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }
}
