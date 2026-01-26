package com.kinanow.catalog.service;

import com.kinanow.catalog.model.Category;
import com.kinanow.catalog.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.lang.NonNull; // Add import

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public Page<Category> getAllCategories(@NonNull Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    public List<Category> getRootCategories() {
        return categoryRepository.findByParentIdIsNull();
    }

    public List<Category> getSubCategories(String parentId) {
        return categoryRepository.findByParentId(parentId);
    }

    public Category createCategory(Category category) {
        // Logic to populate ancestors could go here if parentId is set
        if (category.getParentId() != null) {
            Category parent = categoryRepository.findById(category.getParentId()).orElse(null);
            if (parent != null) {
                List<String> ancestors = new ArrayList<>();
                if (parent.getAncestors() != null) {
                    ancestors.addAll(parent.getAncestors());
                }
                ancestors.add(parent.getId());
                category.setAncestors(ancestors);
            }
        }
        return categoryRepository.save(category);
    }

    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }
}
