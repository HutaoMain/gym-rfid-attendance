package com.sti.gymmanagementsystem.repository;

import com.sti.gymmanagementsystem.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByEmail(String email);

    List<Order> findByStatus(String status);

    List<Order> findByOrderDateBetweenAndStatus(LocalDateTime startOfWeek, LocalDateTime endOfWeek, String status);
}