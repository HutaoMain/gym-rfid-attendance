package com.sti.gymmanagementsystem.service;

import com.sti.gymmanagementsystem.model.User;
import com.sti.gymmanagementsystem.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class UserService {

    @Autowired
    UserRepository userRepository;

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) throws Exception {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new Exception("User not found");
        }
        if (!encoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid password");
        }
        return user;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getListUser() {
        String userRole = "ROLE_USER";
        return userRepository.findByUserRole(userRole);
    }

    public void updatePassword(String email, User user) {
        User setUser = userRepository.findByEmail(email);
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
        String encodedPassword = encoder.encode(user.getPassword());
        setUser.setPassword(encodedPassword);
        userRepository.save(setUser);
    }

    public void updateSubscription(String rfid, User user) {
        User setUser = userRepository.findByRfid(rfid);
        setUser.setSubscription(user.getSubscription());
        userRepository.save(setUser);
    }

    public User getUserByRfid(String rfid){
        return userRepository.findByRfid(rfid);
    }
}
