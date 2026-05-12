import React from "react";

const AlbumPreview = ({ album, className = "" }) => {
  const getPhotos = () => {
    try {
      return JSON.parse(album.photosJson || "[]");
    } catch {
      return [];
    }
  };

  const photos = getPhotos();

  if (photos.length === 0) {
    return (
      <div
        className={`bg-gray-50 rounded-md flex items-center justify-center ${className}`}
      >
        <div className="text-center text-gray-400">
          <div className="text-2xl mb-1">📷</div>
          <div className="text-xs">Empty album</div>
        </div>
      </div>
    );
  }


  const mainPhoto = photos[0];

  return (
    <div className={`relative overflow-hidden rounded-md ${className}`}>
      <img
        src={mainPhoto.url}
        alt={mainPhoto.alt || "Album preview"}
        className="w-full h-full object-cover"
      />

 
      {photos.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded-md">
          {photos.length} photo{photos.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default AlbumPreview;
