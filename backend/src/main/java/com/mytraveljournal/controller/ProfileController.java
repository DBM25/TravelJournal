package com.mytraveljournal.controller;

import com.mytraveljournal.model.User;
import com.mytraveljournal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String username = authentication.getName();
        Optional<User> userOpt = userService.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        User user = userOpt.get();

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", user.getId());
        resp.put("username", user.getUsername());
        resp.put("name", user.getName());
        resp.put("profilePicture", user.getProfilePicture());
        resp.put("createdAt", user.getCreatedAt());
        resp.put("updatedAt", user.getUpdatedAt());

        return ResponseEntity.ok(resp);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates, Authentication authentication) {
        String username = authentication.getName();
        Optional<User> userOpt = userService.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        User user = userOpt.get();

   
        if (updates.containsKey("name")) {
            user.setName((String) updates.get("name"));
        }
        if (updates.containsKey("username")) {
            String newUsername = (String) updates.get("username");
      
            if (!newUsername.equals(user.getUsername()) && userService.findByUsername(newUsername).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already in use"));
            }
            user.setUsername(newUsername);
        }
        if (updates.containsKey("profilePicture")) {
            user.setProfilePicture((String) updates.get("profilePicture"));
        }
        if (updates.containsKey("password") && updates.get("password") != null && !((String) updates.get("password")).isBlank()) {
            user.setPassword(userService.encodePassword((String) updates.get("password")));
        }

        User updated = userService.updateUser(user);

 
        Map<String, Object> resp = new HashMap<>();
        resp.put("id", updated.getId());
        resp.put("username", updated.getUsername());
        resp.put("name", updated.getName());
        resp.put("profilePicture", updated.getProfilePicture());
        resp.put("createdAt", updated.getCreatedAt());
        resp.put("updatedAt", updated.getUpdatedAt());

        return ResponseEntity.ok(resp);
    }
}