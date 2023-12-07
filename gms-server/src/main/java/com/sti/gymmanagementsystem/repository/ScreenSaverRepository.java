package com.sti.gymmanagementsystem.repository;

import com.sti.gymmanagementsystem.model.ScreenSaver;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScreenSaverRepository extends MongoRepository<ScreenSaver, String> {
}
