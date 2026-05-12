package com.mytraveljournal.repository;

import com.mytraveljournal.model.Photo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends MongoRepository<Photo, String> {
    List<Photo> findByAlbumId(String albumId);
    List<Photo> findByUserId(String userId);
}