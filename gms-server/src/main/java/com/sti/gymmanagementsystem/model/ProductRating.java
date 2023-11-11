package com.sti.gymmanagementsystem.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "product_rating")
public class ProductRating {

    @Id
    private String id;

    private Integer rating;
}
