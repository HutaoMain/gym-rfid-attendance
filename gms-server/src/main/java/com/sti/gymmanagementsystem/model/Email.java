package com.sti.gymmanagementsystem.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "email")
public class Email {

    @Id
    private String id;

    private String email;

    private String otp;

    @CreatedDate
    private LocalDateTime createdAt;
}
