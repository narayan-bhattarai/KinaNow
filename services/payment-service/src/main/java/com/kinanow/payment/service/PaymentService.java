package com.kinanow.payment.service;

import com.kinanow.payment.event.OrderPlacedEvent;
import com.kinanow.payment.model.Payment;
import com.kinanow.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;

    @KafkaListener(topics = "kinanow-order-events")
    public void processPayment(OrderPlacedEvent event) {
        log.info("Processing payment for Order: {}, Amount: {}", event.getOrderNumber(), event.getTotalAmount());
        
        // MOCK PAYMENT LOGIC: Always succeed for MVP
        Payment payment = Payment.builder()
                .orderNumber(event.getOrderNumber())
                .userId(event.getUserId())
                .amount(event.getTotalAmount())
                .status("SUCCESS")
                .paymentDate(LocalDateTime.now())
                .build();
        
        paymentRepository.save(payment);
        
        log.info("Payment Successful for Order: {}", event.getOrderNumber());
        
        // TODO: Publish PaymentSucceededEvent for Order Service to complete order status
    }
}
