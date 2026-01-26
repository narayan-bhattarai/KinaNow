package com.kinanow.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDto {
    private String productId;
    private String skuCode;
    private BigDecimal price;
    private Integer quantity;
    private String productName;
    private String imageUrl;
    private UUID merchantId;
}
