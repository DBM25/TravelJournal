package com.mytraveljournal.service;

import com.mytraveljournal.model.Story;
import com.mytraveljournal.repository.StoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StoryService {

    @Autowired
    private StoryRepository storyRepository;

    public List<Story> getStoriesByUserId(String userId) {
        return storyRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    public Optional<Story> getStoryByIdAndUserId(String id, String userId) {
        return storyRepository.findByIdAndUserId(id, userId);
    }

    public Story createStory(String title, String userId) {
        Story story = new Story(title, userId);
        return storyRepository.save(story);
    }

    public Story updateStory(Story story) {
        story.setUpdatedAt(LocalDateTime.now());
        return storyRepository.save(story);
    }

    public void deleteStory(String id) {
        storyRepository.deleteById(id);
    }

    public boolean isStoryOwner(String storyId, String userId) {
        return storyRepository.findByIdAndUserId(storyId, userId).isPresent();
    }
}