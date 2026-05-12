package com.mytraveljournal.service;

import com.mytraveljournal.model.Album;
import com.mytraveljournal.repository.AlbumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class AlbumService {

    @Autowired
    private AlbumRepository albumRepository;

    public List<Album> getAlbumsByUserId(String userId) {
        return albumRepository.findByUserId(userId);
    }

    public Optional<Album> getAlbumById(String id) {
        return albumRepository.findById(id);
    }

    public Album createAlbum(String userId, String title) {
        Album album = new Album(userId, title);
        return albumRepository.save(album);
    }

    public Optional<Album> updateAlbum(String albumId, String title) {
        Optional<Album> albumOpt = albumRepository.findById(albumId);
        if (albumOpt.isPresent()) {
            Album album = albumOpt.get();
            album.setTitle(title);
            album.setUpdatedAt(new Date());
            albumRepository.save(album);
            return Optional.of(album);
        }
        return Optional.empty();
    }

    public boolean deleteAlbum(String albumId) {
        if (albumRepository.existsById(albumId)) {
            albumRepository.deleteById(albumId);
            return true;
        }
        return false;
    }
}