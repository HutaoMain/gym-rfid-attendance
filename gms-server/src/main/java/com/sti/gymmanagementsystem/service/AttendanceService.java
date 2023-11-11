package com.sti.gymmanagementsystem.service;

import com.sti.gymmanagementsystem.model.Attendance;
import com.sti.gymmanagementsystem.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    AttendanceRepository attendanceRepository;

    public Attendance createAttendance(Attendance attendance){
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceList(){
        return attendanceRepository.findAll();
    }
}
