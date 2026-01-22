package com.kinanow.inventory.service;

import com.kinanow.inventory.dto.OrderItemDto;
import com.kinanow.inventory.event.OrderPlacedEvent;
import com.kinanow.inventory.model.Inventory;
import com.kinanow.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @KafkaListener(topics = "kinanow-order-events")
    @Transactional
    public void listen(OrderPlacedEvent event) {
        log.info("Received OrderPlacedEvent for order: {}", event.getOrderNumber());
        
        if (event.getItems() == null || event.getItems().isEmpty()) {
            log.warn("Order {} has no items to process", event.getOrderNumber());
            return;
        }

        for (OrderItemDto item : event.getItems()) {
            if (item.getProductId() != null) {
                // Deduct inventory
                Inventory inventory = inventoryRepository.findByProductId(item.getProductId())
                        .orElseGet(() -> {
                            // Helper: Auto-create inventory if missing for testing
                            return inventoryRepository.save(Inventory.builder()
                                    .productId(item.getProductId())
                                    .skuCode(item.getSkuCode())
                                    .quantity(100) // Default stock
                                    .build());
                        });

                if (inventory.getQuantity() >= item.getQuantity()) {
                    inventory.setQuantity(inventory.getQuantity() - item.getQuantity());
                    inventoryRepository.save(inventory);
                    log.info("Deducted quantity for product {}. New stock: {}", 
                            item.getProductId(), inventory.getQuantity());
                } else {
                    log.error("Insufficient stock for product {}. Order {} might need compensation transaction.", 
                            item.getProductId(), event.getOrderNumber());
                    // In a real system, we would publish an OrderFailedEvent here!
                }
            }
        }
    }
}
