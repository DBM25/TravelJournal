package com.mytraveljournal.repository;

import com.mytraveljournal.model.Story;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoryRepository extends MongoRepository<Story, String> {
    List<Story> findByUserIdOrderByUpdatedAtDesc(String userId);
    Optional<Story> findByIdAndUserId(String id, String userId);
}