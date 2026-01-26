package com.kinanow.order.event;

import com.kinanow.order.dto.OrderItemDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderPlacedEvent {
    private String knOrderId;
    private UUID userId;
    private BigDecimal totalAmount;
    private String email;
    private List<OrderItemDto> items;
}
