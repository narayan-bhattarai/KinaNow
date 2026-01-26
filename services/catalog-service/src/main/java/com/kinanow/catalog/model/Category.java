package com.kinanow.catalog.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "categories")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Category {
    @Id
    private String id;
    private String name;
    private String description;
    private String parentId; // For recursive hierarchy
    private List<String> ancestors; // List of ancestor IDs for easy breadcrumbs: [rootId, childId]
    private boolean active;
}
