package com.kinanow.order.repository;

import com.kinanow.order.model.OrderHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OrderHistoryRepository extends JpaRepository<OrderHistory, UUID> {
    List<OrderHistory> findByKnOrderIdOrderByCreatedAtDesc(String knOrderId);
}
