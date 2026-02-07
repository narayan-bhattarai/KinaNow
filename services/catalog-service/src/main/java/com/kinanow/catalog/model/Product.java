package com.kinanow.catalog.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.UUID;

@Document(collection = "products")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal previousPrice;
    private Integer stock;
    private String occasion;
    private String category; // Simplify for now, could be separate collection
    private String imageUrl;
    private boolean active;
    private UUID merchantId;
    private String type;
    private String model;

    // Dynamic attributes for specific product types (e.g. { "screenSize": "6.7",
    // "color": "Titanium" } or { "variety": "Roma", "organic": true })
    private java.util.Map<String, Object> specifications;
}
