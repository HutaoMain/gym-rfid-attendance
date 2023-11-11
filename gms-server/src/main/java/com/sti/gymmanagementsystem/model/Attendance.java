package com.sti.gymmanagementsystem.model;


import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "attendance")
public class Attendance {

    @Id
    private String id;

    private String rfid;

    private String lastName;

    private String firstName;

    private String attendanceDate;

}
