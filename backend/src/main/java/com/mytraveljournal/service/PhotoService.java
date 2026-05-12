package com.mytraveljournal.service;

import com.mytraveljournal.model.Photo;
import com.mytraveljournal.repository.PhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PhotoService {

    @Autowired
    private PhotoRepository photoRepository;

    public List<Photo> getPhotosByAlbumId(String albumId) {
        return photoRepository.findByAlbumId(albumId);
    }

    public Optional<Photo> getPhotoById(String id) {
        return photoRepository.findById(id);
    }

    public Photo createPhoto(String albumId, String userId, String url, String caption) {
        Photo photo = new Photo(albumId, userId, url, caption);
        return photoRepository.save(photo);
    }

    public Optional<Photo> updatePhoto(String photoId, String caption) {
        Optional<Photo> photoOpt = photoRepository.findById(photoId);
        if (photoOpt.isPresent()) {
            Photo photo = photoOpt.get();
            photo.setCaption(caption);
            photo.setUpdatedAt(new Date());
            photoRepository.save(photo);
            return Optional.of(photo);
        }
        return Optional.empty();
    }

    public boolean deletePhoto(String photoId) {
        if (photoRepository.existsById(photoId)) {
            photoRepository.deleteById(photoId);
            return true;
        }
        return false;
    }
}