package com.sti.gymmanagementsystem.controller;

import com.sti.gymmanagementsystem.model.Attendance;
import com.sti.gymmanagementsystem.model.Category;
import com.sti.gymmanagementsystem.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin("*")
public class AttendanceController {

    @Autowired
    AttendanceService attendanceService;

    @PostMapping("/create")
    ResponseEntity<Attendance> createAttendance(@RequestBody Attendance attendance) {
        Attendance createdAttendance = attendanceService.createAttendance(attendance);
        return ResponseEntity.ok(createdAttendance);
    }

    @GetMapping("/list")
    ResponseEntity<List<Attendance>> getAttendanceList() {
        List<Attendance> attendance = attendanceService.getAttendanceList();
        return ResponseEntity.ok(attendance);
    }
}
