package com.sti.gymmanagementsystem.dto;

import lombok.Data;

@Data
public class ProductDto {

    private String id;

    private String productName;

    private String productImage;

    private String description;

    private Double price;

    private Integer quantity;

    private String category;

    private Integer sold;
}
