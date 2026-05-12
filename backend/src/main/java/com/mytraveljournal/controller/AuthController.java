package com.mytraveljournal.controller;

import com.mytraveljournal.dto.LoginRequest;
import com.mytraveljournal.dto.RegisterRequest;
import com.mytraveljournal.dto.UserResponse;
import com.mytraveljournal.model.User;
import com.mytraveljournal.service.JwtService;
import com.mytraveljournal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.createUser(request.getUsername(), request.getPassword());
            String token = jwtService.generateToken(userService.loadUserByUsername(user.getUsername()));

            Map<String, Object> response = new HashMap<>();
            response.put("user", new UserResponse(user));
            response.put("token", token);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
 
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage() != null ? e.getMessage() : "Registration failed");
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {

            Map<String, String> error = new HashMap<>();
            error.put("message", "Unexpected registration error");
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Optional<User> userOpt = userService.findByUsername(request.getUsername());

            if (userOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Username does not exist");
                return ResponseEntity.badRequest().body(error);
            }

            if (!userService.validatePassword(request.getPassword(), userOpt.get().getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Incorrect password");
                return ResponseEntity.badRequest().body(error);
            }

            User user = userOpt.get();
            String token = jwtService.generateToken(userService.loadUserByUsername(user.getUsername()));

            Map<String, Object> response = new HashMap<>();
            response.put("user", new UserResponse(user));
            response.put("token", token);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Login failed");
            return ResponseEntity.badRequest().body(error);
        }
    }
}