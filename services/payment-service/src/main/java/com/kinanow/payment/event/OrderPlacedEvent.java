package com.kinanow.payment.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderPlacedEvent {
    private String orderNumber;
    private Long userId;
    private BigDecimal totalAmount;
    private String email; 
    // We ignore items list in Payment Service as we just need total amount
}
