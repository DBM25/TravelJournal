package com.mytraveljournal.controller;

import com.mytraveljournal.model.Photo;
import com.mytraveljournal.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.*;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    @Autowired
    private PhotoService photoService;


    @GetMapping("/album/{albumId}")
    public ResponseEntity<Map<String, Object>> getPhotosByAlbum(@PathVariable String albumId, Authentication authentication) {
        List<Photo> photos = photoService.getPhotosByAlbumId(albumId);
        Map<String, Object> resp = new HashMap<>();
        resp.put("photos", photos);
        return ResponseEntity.ok(resp);
    }


    @PostMapping
    public ResponseEntity<Map<String, Object>> addPhoto(@RequestBody Map<String, String> req, Authentication authentication) {
        String albumId = req.get("albumId");
        String url = req.get("url");
        String caption = req.getOrDefault("caption", "");
        String userId = authentication.getName();
        Photo photo = photoService.createPhoto(albumId, userId, url, caption);
        Map<String, Object> resp = new HashMap<>();
        resp.put("photo", photo);
        return ResponseEntity.ok(resp);
    }


    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        Map<String, Object> resp = new HashMap<>();
        if (file.isEmpty()) {
            resp.put("error", "No file selected");
            return ResponseEntity.badRequest().body(resp);
        }
        try {
            String uploadsDir = System.getProperty("user.dir") + "/uploads";
            File dir = new File(uploadsDir);
            if (!dir.exists()) dir.mkdirs();

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                : "";
            String filename = UUID.randomUUID() + extension;
            File dest = new File(dir, filename);
            file.transferTo(dest);

            String url = "/uploads/" + filename;
            resp.put("url", url);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            resp.put("error", "Upload failed: " + e.getMessage());
            return ResponseEntity.status(500).body(resp);
        }
    }

   
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePhoto(@PathVariable String id, @RequestBody Map<String, String> req, Authentication authentication) {
        Optional<Photo> updated = photoService.updatePhoto(id, req.get("caption"));
        if (updated.isPresent() && updated.get().getUserId().equals(authentication.getName())) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("photo", updated.get());
            return ResponseEntity.ok(resp);
        }
        return ResponseEntity.notFound().build();
    }

 
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhoto(@PathVariable String id, Authentication authentication) {
        Optional<Photo> photo = photoService.getPhotoById(id);
        if (photo.isPresent() && photo.get().getUserId().equals(authentication.getName())) {
            photoService.deletePhoto(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}