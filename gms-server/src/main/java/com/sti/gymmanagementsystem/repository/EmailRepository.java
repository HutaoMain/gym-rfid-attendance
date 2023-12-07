package com.sti.gymmanagementsystem.repository;

import com.sti.gymmanagementsystem.model.Email;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface EmailRepository extends MongoRepository<Email, String> {

    Email findByEmailAndOtp(String email, String otp);
    void deleteByEmailAndCreatedAtBefore(String email, Date threeMinutesAgo);
}
