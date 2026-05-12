package com.mytraveljournal.controller;

import com.mytraveljournal.dto.StoryRequest;
import com.mytraveljournal.dto.StoryResponse;
import com.mytraveljournal.model.Story;
import com.mytraveljournal.model.User;
import com.mytraveljournal.service.StoryService;
import com.mytraveljournal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    @Autowired
    private StoryService storyService;

    @Autowired
    private UserService userService;

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Optional<User> user = userService.findByUsername(username);
        return user.map(User::getId).orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> getStories() {
        try {
            String userId = getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.badRequest().build();
            }

            List<Story> stories = storyService.getStoriesByUserId(userId);
            List<StoryResponse> storyResponses = stories.stream()
                    .map(StoryResponse::new)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("stories", storyResponses);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStory(@PathVariable String id) {
        try {
            String userId = getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.badRequest().build();
            }

            Optional<Story> storyOpt = storyService.getStoryByIdAndUserId(id, userId);
            if (storyOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("story", new StoryResponse(storyOpt.get()));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createStory(@RequestBody StoryRequest request) {
        try {
            String userId = getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.badRequest().build();
            }

            Story story = storyService.createStory(request.getTitle(), userId);

            Map<String, Object> response = new HashMap<>();
            response.put("story", new StoryResponse(story));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create story");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStory(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        try {
            String userId = getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.badRequest().build();
            }

            Optional<Story> storyOpt = storyService.getStoryByIdAndUserId(id, userId);
            if (storyOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Story story = storyOpt.get();

            if (updates.containsKey("title")) {
                story.setTitle((String) updates.get("title"));
            }
            if (updates.containsKey("contentJson")) {
                story.setContentJson((String) updates.get("contentJson"));
            }

            Story updatedStory = storyService.updateStory(story);

            Map<String, Object> response = new HashMap<>();
            response.put("story", new StoryResponse(updatedStory));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update story");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStory(@PathVariable String id) {
        try {
            String userId = getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.badRequest().build();
            }

            if (!storyService.isStoryOwner(id, userId)) {
                return ResponseEntity.notFound().build();
            }

            storyService.deleteStory(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Story deleted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete story");
            return ResponseEntity.badRequest().body(error);
        }
    }
}