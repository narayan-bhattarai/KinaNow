package com.kinanow.order.controller;

import com.kinanow.order.dto.OrderRequest;
import com.kinanow.order.model.Order;
import com.kinanow.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String placeOrder(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody OrderRequest orderRequest
    ) {
        return orderService.placeOrder(userId, orderRequest);
    }
    
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Order> getOrders(@RequestHeader("X-User-Id") Long userId) {
        return orderService.getOrders(userId);
    }
}
