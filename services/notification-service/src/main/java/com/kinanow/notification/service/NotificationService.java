package com.kinanow.notification.service;

import com.kinanow.notification.event.OrderPlacedEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    @KafkaListener(topics = "kinanow-order-events")
    public void listen(OrderPlacedEvent event) {
        log.info("Received Notification for Order - {}", event.getOrderNumber());
        // Simulate sending email
        log.info("Sending email to {}", event.getEmail());
        log.info("Email Body: Hi, your order {} for total amount {} has been placed successfully!", event.getOrderNumber(), event.getTotalAmount());
    }
}
