package com.sti.gymmanagementsystem.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "user")
public class User {

    @Id
    private String id;

    private String rfid;

    private String email;

    private String lastName;

    private String firstName;

    private String contactNumber;

    private String gender;

    private String address;

    private String password;

    private String imageUrl;

    private String userRole = "ROLE_USER";

    @CreatedDate
    private LocalDateTime createdDate;
}
