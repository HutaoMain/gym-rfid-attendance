package com.sti.gymmanagementsystem.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "order")
public class Order {

    @Id
    private String id;

    private String email;

    private String userFullName;

    private Double totalPrice;

    private String orderList;

    private String status;

    private String paymentMethod;

    private String receipt;

    @CreatedDate
    private LocalDateTime orderDate;
}