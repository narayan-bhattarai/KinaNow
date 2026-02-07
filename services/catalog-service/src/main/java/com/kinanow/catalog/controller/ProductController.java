package com.kinanow.catalog.controller;

import com.kinanow.catalog.dto.ProductRequest;
import com.kinanow.catalog.dto.ProductResponse;
import com.kinanow.catalog.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse createProduct(@RequestBody ProductRequest productRequest) {
        return productService.createProduct(productRequest);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProductResponse updateProduct(@PathVariable String id, @RequestBody ProductRequest productRequest) {
        productRequest.setId(id);
        return productService.updateProduct(productRequest);
    }

    @GetMapping // Paginated endpoint
    @ResponseStatus(HttpStatus.OK)
    public org.springframework.data.domain.Page<ProductResponse> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) UUID merchantId) {
        return productService.getProducts(org.springframework.data.domain.PageRequest.of(page, size), category,
                merchantId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ProductResponse getProductById(@PathVariable String id) {
        return productService.getProductById(id);
    }

    @GetMapping("/{id}/price-history")
    @ResponseStatus(HttpStatus.OK)
    public List<com.kinanow.catalog.model.PriceHistory> getPriceHistory(@PathVariable String id) {
        return productService.getPriceHistory(id);
    }

    @GetMapping("/category/{category}")
    @ResponseStatus(HttpStatus.OK)
    public List<ProductResponse> getProductsByCategory(@PathVariable String category) {
        return productService.getProductsByCategory(category);
    }

    @PostMapping("/{id}/price")
    @ResponseStatus(HttpStatus.OK)
    public void updatePrice(@PathVariable String id, @RequestBody com.kinanow.catalog.dto.PriceUpdateRequest request) {
        productService.updateProductPrice(id, request.getPrice(), request.getOccasion());
    }
}
