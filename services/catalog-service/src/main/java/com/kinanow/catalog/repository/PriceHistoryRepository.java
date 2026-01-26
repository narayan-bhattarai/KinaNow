package com.kinanow.catalog.repository;

import com.kinanow.catalog.model.PriceHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceHistoryRepository extends MongoRepository<PriceHistory, String> {
    List<PriceHistory> findByProductIdOrderByChangedAtAsc(String productId);
}
