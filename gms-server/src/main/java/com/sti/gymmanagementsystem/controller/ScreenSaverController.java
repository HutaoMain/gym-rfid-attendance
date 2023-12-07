package com.sti.gymmanagementsystem.controller;

import com.sti.gymmanagementsystem.model.ScreenSaver;
import com.sti.gymmanagementsystem.service.ScreenSaverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/screensaver")
public class ScreenSaverController {

    @Autowired
    private ScreenSaverService screenSaverService;

    @PostMapping("/update")
    public ResponseEntity<ScreenSaver> updateScreenSaver(@RequestBody ScreenSaver createOrUpdateImage) {
        try {
            ScreenSaver updatedScreenSaver = screenSaverService.saveOrUpdateImageUrls(createOrUpdateImage);
            return new ResponseEntity<>(updatedScreenSaver, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getScreenSaver")
    public ResponseEntity<ScreenSaver> getScreenSaver() {
        try {
            ScreenSaver updatedScreenSaver = screenSaverService.getScreenSaver();
            return new ResponseEntity<>(updatedScreenSaver, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
