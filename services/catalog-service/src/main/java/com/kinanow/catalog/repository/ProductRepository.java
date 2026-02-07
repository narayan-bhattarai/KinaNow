package com.kinanow.catalog.repository;

import com.kinanow.catalog.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

import java.util.UUID;

public interface ProductRepository extends MongoRepository<Product, String> {
        List<Product> findByCategory(String category);

        org.springframework.data.domain.Page<Product> findByCategory(String category,
                        org.springframework.data.domain.Pageable pageable);

        List<Product> findByActiveTrue();

        List<Product> findByMerchantId(UUID merchantId);

        org.springframework.data.domain.Page<Product> findByMerchantId(UUID merchantId,
                        org.springframework.data.domain.Pageable pageable);

        org.springframework.data.domain.Page<Product> findByCategoryAndMerchantId(String category, UUID merchantId,
                        org.springframework.data.domain.Pageable pageable);
}
