package com.kinanow.payment.repository;

import com.kinanow.payment.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    List<PaymentMethod> findByEnabledTrue();
}
