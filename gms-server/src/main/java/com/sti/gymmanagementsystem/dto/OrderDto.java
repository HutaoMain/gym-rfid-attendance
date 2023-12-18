package com.sti.gymmanagementsystem.dto;


import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {

    @Id
    private String id;

    private String email;

    private String userFullName;

    private Double totalPrice;

    private String orderList;

    private String status;

    private List<ProductQuantityDto> products;

    private String paymentMethod;

    private String rfid;

    private LocalDateTime orderDate;
}