package com.kinanow.inventory.repository;

import com.kinanow.inventory.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findBySkuCode(String skuCode);
    Optional<Inventory> findByProductId(String productId);
}
