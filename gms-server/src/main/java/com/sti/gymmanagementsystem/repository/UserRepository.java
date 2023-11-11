package com.sti.gymmanagementsystem.repository;
import com.sti.gymmanagementsystem.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);

   List<User> findByUserRole(String userRole);

   User findByRfid(String rfid);
}
