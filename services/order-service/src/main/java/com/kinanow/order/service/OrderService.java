package com.kinanow.order.service;

import com.kinanow.order.dto.OrderRequest;
import com.kinanow.order.event.OrderPlacedEvent;
import com.kinanow.order.model.Order;
import com.kinanow.order.model.OrderItem;
import com.kinanow.order.model.OrderStatus;
import com.kinanow.order.repository.OrderRepository;
import com.kinanow.order.repository.OrderHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrderService {

        private final OrderHistoryRepository orderHistoryRepository;
        private final OrderRepository orderRepository;
        private final KafkaTemplate<String, OrderPlacedEvent> kafkaTemplate;

        @SuppressWarnings("null")
        public String placeOrder(java.util.UUID userId, OrderRequest orderRequest) {
                // ... same as before until order save ...
                // Re-pasting the start of the method to ensure correctness in replacement
                // context isn't needed if I target carefully,
                // but for safety in this tool I must match exactly.

                String knOrderId = generateKnOrderId();

                List<OrderItem> orderItems = orderRequest.getItems().stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());

                BigDecimal totalAmount = orderItems.stream()
                                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Create Shipping Details
                com.kinanow.order.model.ShippingDetails shipping = com.kinanow.order.model.ShippingDetails.builder()
                                .address(orderRequest.getShippingAddress())
                                .status(com.kinanow.order.model.ShippingStatus.PENDING)
                                .city("Unknown")
                                .country("Nepal")
                                .build();

                if (orderRequest.getShippingAddress() != null) {
                        String[] parts = orderRequest.getShippingAddress().split(",");
                        if (parts.length > 0)
                                shipping.setAddress(parts[0].trim());
                        if (parts.length > 1)
                                shipping.setCity(parts[1].trim());
                        if (parts.length > 2)
                                shipping.setZipCode(parts[2].trim());
                        if (parts.length > 3)
                                shipping.setCountry(parts[3].trim());
                }

                Order order = Objects.requireNonNull(Order.builder()
                                .knOrderId(knOrderId)
                                .userId(userId)
                                .fullName(orderRequest.getFullName())
                                .email(orderRequest.getEmail())
                                .shippingDetails(shipping)
                                .orderItems(orderItems)
                                .totalAmount(totalAmount)
                                .status(OrderStatus.CREATED)
                                .merchantId(orderItems.isEmpty() ? null : orderItems.get(0).getMerchantId())
                                .build());

                orderRepository.save(order);
                saveHistory(knOrderId, OrderStatus.CREATED, "Order Placed");

                // Publish Event to Kafka
                OrderPlacedEvent event = OrderPlacedEvent.builder()
                                .knOrderId(order.getKnOrderId())
                                .userId(order.getUserId())
                                .totalAmount(order.getTotalAmount())
                                .email(order.getEmail())
                                .items(orderRequest.getItems())
                                .build();

                kafkaTemplate.send("kinanow-order-events", event);
                log.info("Order placed successfully with ID: {}", knOrderId);

                return knOrderId;
        }

        private String generateKnOrderId() {
                String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                StringBuilder sb = new StringBuilder(8);
                java.security.SecureRandom random = new java.security.SecureRandom();
                for (int i = 0; i < 8; i++) {
                        sb.append(chars.charAt(random.nextInt(chars.length())));
                }
                String id = sb.toString();
                // Simple collision check
                if (orderRepository.findByKnOrderId(id).isPresent()) {
                        return generateKnOrderId();
                }
                return id;
        }

        public List<Order> getOrders(java.util.UUID userId) {
                return orderRepository.findByUserId(userId);
        }

        public List<Order> getAllOrders() {
                return orderRepository.findAll();
        }

        private OrderItem mapToDto(com.kinanow.order.dto.OrderItemDto itemDto) {
                return OrderItem.builder()
                                .price(itemDto.getPrice())
                                .quantity(itemDto.getQuantity())
                                .skuCode(itemDto.getSkuCode())
                                .productId(itemDto.getProductId())
                                .productName(itemDto.getProductName())
                                .imageUrl(itemDto.getImageUrl())
                                .merchantId(itemDto.getMerchantId())
                                .build();
        }

        @org.springframework.kafka.annotation.KafkaListener(topics = "kinanow-payment-events")
        public void updateOrderStatus(com.kinanow.order.event.PaymentSucceededEvent event) {
                log.info("Updating Order Status for Order ID: {}", event.getKnOrderId());
                orderRepository.findByKnOrderId(event.getKnOrderId()).ifPresentOrElse(order -> {
                        order.setStatus(OrderStatus.PAID);
                        orderRepository.save(order);
                        saveHistory(event.getKnOrderId(), OrderStatus.PAID, "Payment Verified");
                        log.info("Order Status updated to PAID for Order: {}", event.getKnOrderId());
                }, () -> log.error("Order not found with ID: {}", event.getKnOrderId()));
        }

        public void updateStatus(String knOrderId, OrderStatus status) {
                orderRepository.findByKnOrderId(knOrderId).ifPresentOrElse(order -> {
                        order.setStatus(status);
                        orderRepository.save(order);
                        saveHistory(knOrderId, status, "Status Updated by Admin/Merchant");
                }, () -> {
                        throw new RuntimeException("Order not found with ID: " + knOrderId);
                });
        }

        public void updateShippingStatus(String knOrderId, com.kinanow.order.model.ShippingStatus status) {
                orderRepository.findByKnOrderId(knOrderId).ifPresentOrElse(order -> {
                        if (order.getShippingDetails() != null) {
                                order.getShippingDetails().setStatus(status);
                                orderRepository.save(order);
                                // We log this in history too, but maybe keeping the Order status same for now
                                // or implying a change
                                // Ideally we might want separate history or just append to the same log
                                saveHistory(knOrderId, order.getStatus(), "Shipping Status Updated: " + status);
                        }
                }, () -> {
                        throw new RuntimeException("Order not found with ID: " + knOrderId);
                });
        }

        private void saveHistory(String knOrderId, OrderStatus status, String description) {
                com.kinanow.order.model.OrderHistory history = com.kinanow.order.model.OrderHistory.builder()
                                .knOrderId(knOrderId)
                                .status(status)
                                .description(description)
                                .build();
                orderHistoryRepository.save(history);
        }

        public List<com.kinanow.order.model.OrderHistory> getOrderHistory(String knOrderId) {
                return orderHistoryRepository.findByKnOrderIdOrderByCreatedAtDesc(knOrderId);
        }

        public List<Order> getMerchantOrders(java.util.UUID merchantId) {
                return orderRepository.findByMerchantId(merchantId);
        }

        public Order getOrderByKnId(String knOrderId) {
                return orderRepository.findByKnOrderId(knOrderId)
                                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + knOrderId));
        }
}
