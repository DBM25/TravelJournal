package com.mytraveljournal.controller;

import com.mytraveljournal.model.Album;
import com.mytraveljournal.service.AlbumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {

    @Autowired
    private AlbumService albumService;

 
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAlbums(Authentication authentication) {
        String userId = authentication.getName();
        List<Album> albums = albumService.getAlbumsByUserId(userId);
        Map<String, Object> resp = new HashMap<>();
        resp.put("albums", albums);
        return ResponseEntity.ok(resp);
    }


    @PostMapping
    public ResponseEntity<Map<String, Object>> createAlbum(@RequestBody Map<String, String> req, Authentication authentication) {
        String title = req.get("title");
        String userId = authentication.getName();
        Album album = albumService.createAlbum(userId, title);
        Map<String, Object> resp = new HashMap<>();
        resp.put("album", album);
        return ResponseEntity.ok(resp);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getAlbum(@PathVariable String id, Authentication authentication) {
        Optional<Album> albumOpt = albumService.getAlbumById(id);
        if (albumOpt.isPresent() && albumOpt.get().getUserId().equals(authentication.getName())) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("album", albumOpt.get());
            return ResponseEntity.ok(resp);
        }
        return ResponseEntity.notFound().build();
    }

 
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateAlbum(@PathVariable String id, @RequestBody Map<String, String> req, Authentication authentication) {
        Optional<Album> updated = albumService.updateAlbum(id, req.get("title"));
        if (updated.isPresent() && updated.get().getUserId().equals(authentication.getName())) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("album", updated.get());
            return ResponseEntity.ok(resp);
        }
        return ResponseEntity.notFound().build();
    }

  
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlbum(@PathVariable String id, Authentication authentication) {
        Optional<Album> album = albumService.getAlbumById(id);
        if (album.isPresent() && album.get().getUserId().equals(authentication.getName())) {
            albumService.deleteAlbum(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}