package com.kinanow.order.controller;

import com.kinanow.order.dto.OrderRequest;
import com.kinanow.order.model.*;
import com.kinanow.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String placeOrder(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody OrderRequest orderRequest) {
        return orderService.placeOrder(userId, orderRequest);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Order> getOrders(@RequestHeader("X-User-Id") UUID userId) {
        return orderService.getOrders(userId);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/merchant")
    @ResponseStatus(HttpStatus.OK)
    public List<Order> getMerchantOrders(@RequestHeader("X-Merchant-Id") UUID merchantId) {
        return orderService.getMerchantOrders(merchantId);
    }

    @PatchMapping("/{knOrderId}/status")
    @ResponseStatus(HttpStatus.OK)
    public void updateStatus(
            @PathVariable String knOrderId,
            @RequestParam OrderStatus status) {
        orderService.updateStatus(knOrderId, status);
    }

    @PatchMapping("/{knOrderId}/shipping-status")
    @ResponseStatus(HttpStatus.OK)
    public void updateShippingStatus(
            @PathVariable String knOrderId,
            @RequestParam ShippingStatus status) {
        orderService.updateShippingStatus(knOrderId, status);
    }

    @GetMapping("/track/{knOrderId}")
    @ResponseStatus(HttpStatus.OK)
    public Order getOrderByKnId(@PathVariable String knOrderId) {
        return orderService.getOrderByKnId(knOrderId);
    }

    @GetMapping("/{knOrderId}/history")
    @ResponseStatus(HttpStatus.OK)
    public List<OrderHistory> getOrderHistory(@PathVariable String knOrderId) {
        return orderService.getOrderHistory(knOrderId);
    }
}
