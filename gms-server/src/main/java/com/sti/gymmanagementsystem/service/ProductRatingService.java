package com.sti.gymmanagementsystem.service;

import com.sti.gymmanagementsystem.dto.RatingCountDto;
import com.sti.gymmanagementsystem.model.ProductRating;
import com.sti.gymmanagementsystem.repository.ProductRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductRatingService {

    @Autowired
    ProductRatingRepository productRatingRepository;

    public void addRating(ProductRating productRating) {
        productRatingRepository.save(productRating);
    }

    public float getAverageRatingPercentage() {
        List<ProductRating> productRatings = productRatingRepository.findAll();
        float sumRatings = productRatings.stream().map(ProductRating::getRating).reduce(0, Integer::sum);
        float averageRating = sumRatings / productRatings.size();
        return averageRating * 100 / 5;
    }


    public List<RatingCountDto> countRatings() {
        List<RatingCountDto> ratingCounts = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            ratingCounts.add(new RatingCountDto(i, productRatingRepository.countByRating(i)));
        }
        return ratingCounts;
    }

}
