package com.kinanow.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PriceUpdateRequest {
    private BigDecimal price;
    private String occasion;
}
