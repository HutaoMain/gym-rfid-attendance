package com.sti.gymmanagementsystem.controller;

import com.sti.gymmanagementsystem.dto.LoginDto;
import com.sti.gymmanagementsystem.model.User;
import com.sti.gymmanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;


    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public User loginUser(@RequestBody LoginDto loginDto) throws Exception {
        return userService.loginUser(loginDto.getEmail(), loginDto.getPassword());
    }

    @GetMapping("/list")
    public List<User> getListUserController() {
        return userService.getListUser();
    }

    @GetMapping("/{email}")
    private User getUserByEmail(@PathVariable("email") String email) {
        return userService.getUserByEmail(email);
    }

    @PutMapping("/changePassword/{email}")
    public ResponseEntity<String> updatePassword(@PathVariable("email") String email, @RequestBody User user) {
        userService.updatePassword(email, user);
        return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
    }

    @GetMapping("/rfid/{rfid}")
    public ResponseEntity<User> getUserByRfid(@PathVariable("rfid") String rfid) {
       User user =  userService.getUserByRfid(rfid);
        return ResponseEntity.ok(user);
    }

}
