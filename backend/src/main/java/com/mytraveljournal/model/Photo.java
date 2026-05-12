package com.mytraveljournal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "photo")
public class Photo {
    @Id
    private String id;

    private String albumId;
    private String userId;
    private String url;
    private String caption;
    private Date createdAt;
    private Date updatedAt;

    public Photo() {}

    public Photo(String albumId, String userId, String url, String caption) {
        this.albumId = albumId;
        this.userId = userId;
        this.url = url;
        this.caption = caption;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

  

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAlbumId() { return albumId; }
    public void setAlbumId(String albumId) { this.albumId = albumId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}