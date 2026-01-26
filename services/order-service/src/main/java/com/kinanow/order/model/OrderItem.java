package com.kinanow.order.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "t_order_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String productId; // Mongo ID reference
    private String skuCode;
    private BigDecimal price;
    private Integer quantity;
    private String productName;
    private String imageUrl;
    private UUID merchantId;
}
