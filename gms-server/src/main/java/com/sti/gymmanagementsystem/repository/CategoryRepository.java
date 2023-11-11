package com.sti.gymmanagementsystem.repository;

import com.sti.gymmanagementsystem.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<Category, String> {
}
