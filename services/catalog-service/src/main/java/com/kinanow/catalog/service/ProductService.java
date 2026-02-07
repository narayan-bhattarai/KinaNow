package com.kinanow.catalog.service;

import com.kinanow.catalog.dto.ProductRequest;
import com.kinanow.catalog.dto.ProductResponse;
import com.kinanow.catalog.model.Product;
import com.kinanow.catalog.model.PriceHistory;
import com.kinanow.catalog.repository.ProductRepository;
import com.kinanow.catalog.repository.PriceHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    public ProductResponse createProduct(ProductRequest productRequest) {
        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .price(productRequest.getPrice())
                .previousPrice(null)
                .stock(productRequest.getStock())
                .category(productRequest.getCategory())
                .imageUrl(productRequest.getImageUrl())
                .merchantId(productRequest.getMerchantId())
                .type(productRequest.getType())
                .model(productRequest.getModel())
                .specifications(new HashMap<>())
                .active(true)
                .build();

        if (productRequest.getSpecifications() != null) {
            product.setSpecifications(new HashMap<>(productRequest.getSpecifications()));
        }

        productRepository.save(product);
        savePriceHistory(product.getId(), product.getPrice());

        log.info("Product {} is saved", product.getId());
        return mapToProductResponse(product);
    }

    public ProductResponse updateProduct(ProductRequest productRequest) {
        log.info("Updating product {}. Specs provided: {}", productRequest.getId(),
                productRequest.getSpecifications() != null ? productRequest.getSpecifications().size() : "NONE");

        Product existingProduct = productRepository.findById(productRequest.getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        boolean priceChanged = existingProduct.getPrice().compareTo(productRequest.getPrice()) != 0;

        if (priceChanged) {
            existingProduct.setPreviousPrice(existingProduct.getPrice());
        }

        existingProduct.setName(productRequest.getName());
        existingProduct.setDescription(productRequest.getDescription());
        existingProduct.setPrice(productRequest.getPrice());
        existingProduct.setStock(productRequest.getStock());
        existingProduct.setCategory(productRequest.getCategory());
        existingProduct.setImageUrl(productRequest.getImageUrl());
        existingProduct.setType(productRequest.getType());
        existingProduct.setModel(productRequest.getModel());
        existingProduct.setOccasion(productRequest.getOccasion());

        // Robust Map Update
        if (productRequest.getSpecifications() != null) {
            existingProduct.setSpecifications(new HashMap<>(productRequest.getSpecifications()));
        } else {
            existingProduct.setSpecifications(new HashMap<>());
        }

        productRepository.save(existingProduct);

        if (priceChanged) {
            savePriceHistory(existingProduct.getId(), existingProduct.getPrice(), productRequest.getOccasion());
        }

        return mapToProductResponse(existingProduct);
    }

    public void updateProductPrice(String productId, BigDecimal newPrice, String occasion) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getPrice().compareTo(newPrice) != 0) {
            product.setPreviousPrice(product.getPrice());
        }
        product.setPrice(newPrice);
        product.setOccasion(occasion);
        productRepository.save(product);

        savePriceHistory(productId, newPrice, occasion);
    }

    private void savePriceHistory(String productId, BigDecimal price, String occasion) {
        PriceHistory.PriceHistoryBuilder historyBuilder = PriceHistory.builder()
                .productId(productId)
                .price(price)
                .changedAt(LocalDateTime.now());

        if (occasion != null) {
            historyBuilder.occasion(occasion);
        }

        priceHistoryRepository.save(historyBuilder.build());
    }

    private void savePriceHistory(String productId, BigDecimal price) {
        savePriceHistory(productId, price, null);
    }

    public List<PriceHistory> getPriceHistory(String productId) {
        return priceHistoryRepository.findByProductIdOrderByChangedAtAsc(productId);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToProductResponse)
                .toList();
    }

    public List<ProductResponse> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(this::mapToProductResponse)
                .toList();
    }

    public Page<ProductResponse> getProducts(Pageable pageable, String categoryId, UUID merchantId) {
        Page<Product> page;
        if (categoryId != null && !categoryId.isEmpty()) {
            if (merchantId != null) {
                page = productRepository.findByCategoryAndMerchantId(categoryId, merchantId, pageable);
            } else {
                page = productRepository.findByCategory(categoryId, pageable);
            }
        } else if (merchantId != null) {
            page = productRepository.findByMerchantId(merchantId, pageable);
        } else {
            page = productRepository.findAll(pageable);
        }
        return page.map(this::mapToProductResponse);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    public ProductResponse getProductById(String id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToProductResponse(product);
    }

    private ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .previousPrice(product.getPreviousPrice())
                .stock(product.getStock())
                .occasion(product.getOccasion())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .merchantId(product.getMerchantId())
                .model(product.getModel())
                .specifications(product.getSpecifications())
                .build();
    }
}
