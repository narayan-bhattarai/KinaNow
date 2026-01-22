package com.kinanow.order.service;

import com.kinanow.order.dto.OrderRequest;
import com.kinanow.order.event.OrderPlacedEvent;
import com.kinanow.order.model.Order;
import com.kinanow.order.model.OrderItem;
import com.kinanow.order.model.OrderStatus;
import com.kinanow.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;

    public String placeOrder(Long userId, OrderRequest orderRequest) {
        String orderNumber = UUID.randomUUID().toString();
        
        List<OrderItem> orderItems = orderRequest.getItems().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        
        BigDecimal totalAmount = orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .userId(userId)
                .orderItems(orderItems)
                .totalAmount(totalAmount)
                .status(OrderStatus.CREATED)
                .build();

        orderRepository.save(order);
        
        // Publish Event to Kafka
        OrderPlacedEvent event = OrderPlacedEvent.builder()
                .orderNumber(order.getOrderNumber())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .email("user@example.com") // Placeholder, fetch from User Service/Auth context
                .build();
                
        kafkaTemplate.send("kinanow-order-events", event);
        log.info("Order placed successfully: {}", orderNumber);
        
        return orderNumber;
    }
    
    public List<Order> getOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    private OrderItem mapToDto(com.kinanow.order.dto.OrderItemDto itemDto) {
        return OrderItem.builder()
                .price(itemDto.getPrice())
                .quantity(itemDto.getQuantity())
                .skuCode(itemDto.getSkuCode())
                .productId(itemDto.getProductId())
                .build();
    }
}
