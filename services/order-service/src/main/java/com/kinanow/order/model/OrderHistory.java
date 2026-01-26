package com.kinanow.order.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_order_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String knOrderId;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String description; // Optional check-point note (e.g. "Order picked by warehouse")

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
