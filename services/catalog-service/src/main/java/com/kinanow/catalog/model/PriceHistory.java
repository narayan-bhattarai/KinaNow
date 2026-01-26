package com.kinanow.catalog.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "price_history")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class PriceHistory {
    @Id
    private String id;
    private String productId;
    private BigDecimal price;
    private LocalDateTime changedAt;
    private String occasion;
}
