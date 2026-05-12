package com.mytraveljournal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/story-images")
public class StoryImageController {


    private static final String UPLOAD_DIR = "C:/My Files/Software Projects/MyTravelJournal/project/backend/uploads/story-images/";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadStoryImage(@RequestParam("file") MultipartFile file) {
        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            String ext = getExtension(file.getOriginalFilename());
            String newFileName = UUID.randomUUID().toString() + (ext.isEmpty() ? "" : "." + ext);
            File dest = new File(dir, newFileName);
            file.transferTo(dest);

       
            String url = "/uploads/story-images/" + newFileName;

            Map<String, String> result = new HashMap<>();
            result.put("url", url);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to upload image"));
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return "";
        int idx = filename.lastIndexOf('.');
        return (idx >= 0) ? filename.substring(idx + 1) : "";
    }
}