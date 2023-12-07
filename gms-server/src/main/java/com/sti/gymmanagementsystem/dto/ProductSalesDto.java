package com.sti.gymmanagementsystem.dto;

import com.sti.gymmanagementsystem.model.Product;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ProductSalesDto {

    private Product product;

    private int sold;

    private double totalPriceSolds;

    private LocalDateTime orderDate;

}
