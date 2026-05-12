import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Trash2,
  Plus,
  X,
  Edit3,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { albumService } from "../services/albumService";
import { photoService } from "../services/photoService";
import { getSmartDateFormat } from "../utils/dateUtils";
import { cn } from "../utils/classNames";

const AlbumViewer = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

 
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [caption, setCaption] = useState("");

  const [editingCaptionId, setEditingCaptionId] = useState(null);
  const [captionDraft, setCaptionDraft] = useState("");

 
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    if (!albumId) return;
    const load = async () => {
      setLoading(true);
      try {
        const albumData = await albumService.getAlbum(albumId);
        setAlbum(albumData);

        const photoData = await photoService.getPhotosByAlbum(albumId);
        setPhotos(photoData);
      } catch (err) {
        setPhotos([]);
      }
      setLoading(false);
    };
    load();
  }, [albumId]);

  const handlePhotoUpload = async (e) => {
    setUploadError("");
    setUploading(true);
    const file = e.target.files[0];
    if (!file) {
      setUploading(false);
      return;
    }

    try {
      const url = await photoService.uploadPhotoFile(file);

      await photoService.createPhoto({
        albumId,
        url,
        caption,
      });

      setCaption("");
      e.target.value = "";
      await refreshPhotos();
    } catch (err) {
      setUploadError("Upload failed: " + (err.message || "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  const refreshPhotos = async () => {
    const photoData = await photoService.getPhotosByAlbum(albumId);
    setPhotos(photoData);
  };

  const startEditCaption = (photo) => {
    setEditingCaptionId(photo.id);
    setCaptionDraft(photo.caption || "");
  };

  const cancelEditCaption = () => {
    setEditingCaptionId(null);
    setCaptionDraft("");
  };

  const saveEditCaption = async (photo) => {
    await photoService.updatePhotoCaption(photo.id, captionDraft);
    setEditingCaptionId(null);
    setCaptionDraft("");
    await refreshPhotos();
  };

  const deletePhoto = async (photo) => {
    await photoService.deletePhoto(photo.id);
    await refreshPhotos();
  };

  const handleDeleteAlbum = async () => {
    setIsDeleting(true);
    try {
      await albumService.deleteAlbum(albumId);
      navigate("/albums");
    } catch (error) {
  
    }
    setIsDeleting(false);
  };


  const safeDate = (d) =>
    d && !isNaN(Date.parse(d)) ? getSmartDateFormat(d) : "";

  if (!albumId) {
    return <div className="text-center p-12">Invalid album ID.</div>;
  }

  if (loading) {
    return <div className="text-center p-12">Loading...</div>;
  }

  if (!album) {
    return (
      <div className="text-center p-12">
        <p>Album not found.</p>
        <button
          onClick={() => navigate("/albums")}
          className="btn btn-secondary mt-4"
        >
          Back to Albums
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/albums")}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h2 className="text-2xl font-bold">{album.title}</h2>
              <div className="text-sm text-gray-500 flex gap-4">
                <span>
                  <Calendar className="w-4 h-4 inline" /> Created{" "}
                  {safeDate(album.createdAt)}
                </span>
                {album.updatedAt !== album.createdAt && (
                  <span>
                    <Clock className="w-4 h-4 inline" /> Updated{" "}
                    {safeDate(album.updatedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-error-600 text-white rounded-md px-4 py-2 hover:bg-error-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span> Delete Album</span>
            </button>
          </div>
        </div>
      </div>

      {/* Photo upload UI */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              style={{ display: "none" }}
              id="photo-upload-input"
            />
            <span>
              <button
                type="button"
                className="bg-secondary-600 text-white px-4 py-2 rounded-md hover:bg-secondary-700"
                onClick={() =>
                  document.getElementById("photo-upload-input").click()
                }
                disabled={uploading}
              >
                <Plus className="w-5 h-5 inline" /> Add Photo
              </button>
            </span>
          </label>
          <input
            type="text"
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={uploading}
            className="border rounded px-2 py-1"
          />
          {uploading && <span>Uploading...</span>}
          {uploadError && <span className="text-red-600">{uploadError}</span>}
        </div>
      </div>

      {/* Photo grid */}
      <div className="px-8 py-8">
        {photos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No photos yet
            </h3>
            <p className="text-gray-600 mb-6">Upload a photo to get started!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="photo-card flex flex-col items-center border border-gray-200 rounded-lg p-0 bg-transparent shadow-none overflow-hidden"
                style={{
                  boxShadow: "none",
                  background: "transparent",
                  padding: 0,
                }}
              >
                <img
                  src={
                    photo.url && !photo.url.startsWith("http")
                      ? `http://localhost:8080${photo.url}`
                      : photo.url
                  }
                  alt={photo.caption || "Photo"}
                  className="w-full h-48 object-cover rounded-t-lg"
                  style={{
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    borderBottom: "none",
                  }}
                  onClick={() => setSelectedPhoto(photo)}
                />
                <div className="bezel-caption w-full px-3 py-2 border-t border-gray-200 bg-white rounded-b-lg">
                  {editingCaptionId === photo.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={captionDraft}
                        onChange={(e) => setCaptionDraft(e.target.value)}
                        className="flex-1 border rounded px-2 py-1"
                      />
                      <button
                        className="bg-secondary-600 text-white px-2 py-1 rounded"
                        onClick={() => saveEditCaption(photo)}
                      >
                        Save
                      </button>
                      <button
                        className="text-gray-500 px-2 py-1"
                        onClick={cancelEditCaption}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800 text-sm">
                        {photo.caption}
                      </span>
                      <button
                        className="text-secondary-600 text-xs ml-2"
                        onClick={() => startEditCaption(photo)}
                      >
                        <Edit3 className="w-4 h-4 inline" /> Edit Caption
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {safeDate(photo.createdAt)}
                    </span>
                    <button
                      className="text-error-600 text-xs ml-2"
                      onClick={() => deletePhoto(photo)}
                    >
                      <Trash2 className="w-4 h-4 inline" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={
                selectedPhoto.url && !selectedPhoto.url.startsWith("http")
                  ? `http://localhost:8080${selectedPhoto.url}`
                  : selectedPhoto.url
              }
              alt={selectedPhoto.caption || "Photo"}
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
            />
            <button
              className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
            {selectedPhoto.caption && (
              <div className="text-white text-lg text-center mt-4">
                {selectedPhoto.caption}
              </div>
            )}
          </div>
        </div>
      )}

 
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-md text-center w-96">
            <h3 className="text-xl font-semibold mb-4">Delete This Album?</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this album and all its photos?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleDeleteAlbum}
                className="bg-error-600 text-white px-4 py-2 rounded hover:bg-error-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumViewer;
