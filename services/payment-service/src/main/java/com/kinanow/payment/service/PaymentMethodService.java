package com.kinanow.payment.service;

import com.kinanow.payment.model.PaymentMethod;
import com.kinanow.payment.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentMethodService {
    private final PaymentMethodRepository repository;

    public PaymentMethod addPaymentMethod(PaymentMethod method) {
        return repository.save(method);
    }

    public List<PaymentMethod> getAllPaymentMethods() {
        return repository.findAll();
    }
    
    public List<PaymentMethod> getActivePaymentMethods() {
        return repository.findByEnabledTrue();
    }
}
