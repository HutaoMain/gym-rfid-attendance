package com.sti.gymmanagementsystem.repository;

import com.sti.gymmanagementsystem.model.ProductRating;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRatingRepository extends MongoRepository<ProductRating, String> {
    long countByRating(int rating);
}