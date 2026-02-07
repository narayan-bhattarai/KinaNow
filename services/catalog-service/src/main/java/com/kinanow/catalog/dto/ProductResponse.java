package com.kinanow.catalog.dto;

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
public class ProductResponse {
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal previousPrice;
    private Integer stock;
    private String occasion;
    private String category;
    private String imageUrl;
    private String model;
    private UUID merchantId;
    private java.util.Map<String, Object> specifications;
}
