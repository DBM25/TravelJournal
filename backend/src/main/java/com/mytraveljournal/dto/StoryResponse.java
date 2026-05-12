package com.mytraveljournal.dto;

import com.mytraveljournal.model.Story;

import java.time.LocalDateTime;

public class StoryResponse {
    private String id;
    private String title;
    private String contentJson;
    private String userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StoryResponse() {}

    public StoryResponse(Story story) {
        this.id = story.getId();
        this.title = story.getTitle();
        this.contentJson = story.getContentJson();
        this.userId = story.getUserId();
        this.createdAt = story.getCreatedAt();
        this.updatedAt = story.getUpdatedAt();
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getContentJson() { return contentJson; }
    public String getUserId() { return userId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}