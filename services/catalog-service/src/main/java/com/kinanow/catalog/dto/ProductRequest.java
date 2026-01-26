package com.kinanow.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {
    private String id; // Added for updates
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private String imageUrl;
    private Long merchantId;
    private String type;
    private String model;
    private java.util.Map<String, Object> specifications;
    private String occasion;
    private Integer stock;
}
