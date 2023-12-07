package com.sti.gymmanagementsystem.controller;

import com.sti.gymmanagementsystem.dto.EmailDto;
import com.sti.gymmanagementsystem.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin("*")
public class EmailController {
    @Autowired
    private EmailService emailService;

    @PostMapping("/send-otp")
    public void sendEmail(@RequestBody EmailDto emailRequest) {
        emailService.sendOtp(emailRequest.getEmail());
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody EmailDto verificationRequest) {
        return emailService.verifyOtp(verificationRequest.getEmail(), verificationRequest.getOtp());
    }
}
