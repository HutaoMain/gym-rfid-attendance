package com.sti.gymmanagementsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
public class GymManagementSystemApplication {

    @PostConstruct
    public void init() {
        // Set the default timezone to Asia/Manila (UTC+8)
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Manila"));
    }

    public static void main(String[] args) {
        SpringApplication.run(GymManagementSystemApplication.class, args);
    }
}
