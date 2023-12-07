package com.sti.gymmanagementsystem.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EmailDto {

    private String id;

    private String email;

    private String otp;

    private LocalDateTime createdAt;

}
