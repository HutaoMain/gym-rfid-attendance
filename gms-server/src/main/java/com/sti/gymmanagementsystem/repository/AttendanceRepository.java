package com.sti.gymmanagementsystem.repository;

import com.sti.gymmanagementsystem.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, String> {
}
