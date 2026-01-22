package com.kinanow.cart.controller;

import com.kinanow.cart.dto.AddToCartRequest;
import com.kinanow.cart.model.Cart;
import com.kinanow.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Cart> getCart(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addToCart(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody AddToCartRequest request
    ) {
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Cart> removeFromCart(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String productId
    ) {
        return ResponseEntity.ok(cartService.removeFromCart(userId, productId));
    }
    
    @DeleteMapping
    public ResponseEntity<Void> clearCart(@RequestHeader("X-User-Id") Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }
}
