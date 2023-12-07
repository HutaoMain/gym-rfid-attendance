package com.sti.gymmanagementsystem.service;

import com.sti.gymmanagementsystem.model.Email;
import com.sti.gymmanagementsystem.repository.EmailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;


@Service
@RequiredArgsConstructor
public class EmailService {

    @Autowired
    JavaMailSender javaMailSender;

    @Autowired
    EmailRepository emailRepository;

    @Value("${spring.mail.username}")
    String adminEmail;

    @Async
    public void sendOtp(String email) {
        String otp = generateOtp();

        SimpleMailMessage helper = new SimpleMailMessage();

        System.out.print("eto ung email oh" + email);

        helper.setFrom(adminEmail);
        helper.setTo(email);
        helper.setSubject("OTP Verification Code");
        helper.setText("Your OTP code from F1 Gym is here: " + otp);

        javaMailSender.send(helper);

        Email emailEntity = new Email();
        emailEntity.setEmail(email);
        emailEntity.setOtp(otp);
        emailRepository.save(emailEntity);

        ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);
        executorService.schedule(() -> deleteOldEmails(email), 2, TimeUnit.MINUTES);
    }

    public ResponseEntity<String> verifyOtp(String email, String enteredOtp) {
        try {
            Email emailEntity = emailRepository.findByEmailAndOtp(email, enteredOtp);
            if (emailEntity != null) {
                System.out.println("OTP is valid");
                return new ResponseEntity<>("OTP is valid", HttpStatus.OK);
            } else {
                // OTP is invalid
                // You can add additional logic here if needed
                System.out.println("Invalid OTP");
                return new ResponseEntity<>("Invalid OTP", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error verifying OTP", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void deleteOldEmails(String email) {
        Date threeMinutesAgo = new Date(System.currentTimeMillis() - 3 * 60 * 1000);
        emailRepository.deleteByEmailAndCreatedAtBefore(email, threeMinutesAgo);
        System.out.println("Deleted old emails.");
    }

    public static String generateOtp() {
        int otpLength = 4;

        String otpCharacterSet = "0123456789";

        StringBuilder otpBuilder = new StringBuilder();

        Random random = new Random();

        for (int i = 0; i < otpLength; i++) {
            char randomDigit = otpCharacterSet.charAt(random.nextInt(otpCharacterSet.length()));
            otpBuilder.append(randomDigit);
        }

        return otpBuilder.toString();
    }

}
