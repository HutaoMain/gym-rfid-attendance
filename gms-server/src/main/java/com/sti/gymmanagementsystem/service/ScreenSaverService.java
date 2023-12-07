package com.sti.gymmanagementsystem.service;

import com.sti.gymmanagementsystem.model.ScreenSaver;
import com.sti.gymmanagementsystem.repository.ScreenSaverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScreenSaverService {

    @Autowired
    ScreenSaverRepository screenSaverRepository;

    public ScreenSaver saveOrUpdateImageUrls(ScreenSaver createOrUpdateImage) {
        List<ScreenSaver> existingRecords = screenSaverRepository.findAll();

        if (!existingRecords.isEmpty()) {
            ScreenSaver screenSaver = existingRecords.get(0);
            screenSaver.setImageUrl(createOrUpdateImage.getImageUrl());
            return screenSaverRepository.save(screenSaver);
        } else {
            ScreenSaver newScreenSaver = new ScreenSaver();
            newScreenSaver.setImageUrl(createOrUpdateImage.getImageUrl());
            return screenSaverRepository.save(newScreenSaver);
        }
    }

    public ScreenSaver getScreenSaver() {
        List<ScreenSaver> existingRecords = screenSaverRepository.findAll();
        return existingRecords.get(0);
    }
}
