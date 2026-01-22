package com.kinanow.inventory.event;

import com.kinanow.inventory.dto.OrderItemDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderPlacedEvent {
    private String orderNumber;
    private Long userId;
    private BigDecimal totalAmount;
    private String email; 
    private List<OrderItemDto> items;
}
