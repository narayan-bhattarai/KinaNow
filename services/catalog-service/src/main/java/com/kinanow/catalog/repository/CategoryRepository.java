package com.kinanow.catalog.repository;

import com.kinanow.catalog.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByParentId(String parentId);

    List<Category> findByParentIdIsNull(); // Find root categories
}
