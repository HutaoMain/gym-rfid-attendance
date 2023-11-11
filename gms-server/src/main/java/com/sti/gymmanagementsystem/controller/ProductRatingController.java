package com.sti.gymmanagementsystem.controller;

import com.sti.gymmanagementsystem.dto.RatingCountDto;
import com.sti.gymmanagementsystem.model.ProductRating;
import com.sti.gymmanagementsystem.repository.ProductRepository;
import com.sti.gymmanagementsystem.service.ProductRatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productRating")
public class ProductRatingController {

    @Autowired
    ProductRatingService productRatingService;

    @Autowired
    ProductRepository productRepository;

    @PostMapping("/rate")
    public ResponseEntity<?> rateProduct(@RequestBody ProductRating productRating) {
        productRatingService.addRating(productRating);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/customerRating")
    public ResponseEntity<Float> getAverageRatingPercentage() {
        float averageRatingPercentage = productRatingService.getAverageRatingPercentage();
        return ResponseEntity.ok(averageRatingPercentage);
    }


    @GetMapping("/count-ratings")
    public List<RatingCountDto> countRatings() {
        return productRatingService.countRatings();
    }
}
