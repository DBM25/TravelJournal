import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Plus, Search } from "lucide-react";
import { albumService } from "../services/albumService";
import { photoService } from "../services/photoService";

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [photoCounts, setPhotoCounts] = useState({});
  const [thumbnails, setThumbnails] = useState({});
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [albumTitleDraft, setAlbumTitleDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [titleError, setTitleError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadAlbums = async () => {
      const albumsList = await albumService.getAlbums();
      setAlbums(albumsList);

      const counts = {};
      const thumbs = {};
      for (const album of albumsList) {
        const photos = await photoService.getPhotosByAlbum(album.id);
        counts[album.id] = photos.length;
        thumbs[album.id] = photos[0]?.url || null;
      }
      setPhotoCounts(counts);
      setThumbnails(thumbs);
    };
    loadAlbums();
  }, []);

  const startEdit = (album) => {
    setEditingAlbumId(album.id);
    setAlbumTitleDraft(album.title);
  };

  const saveEdit = async (album) => {
    await albumService.updateAlbum(album.id, { title: albumTitleDraft });
    setEditingAlbumId(null);
    const updated = albums.map((a) =>
      a.id === album.id ? { ...a, title: albumTitleDraft } : a,
    );
    setAlbums(updated);
  };

  const cancelEdit = () => {
    setEditingAlbumId(null);
    setAlbumTitleDraft("");
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbumTitle.trim()) {
      setTitleError("Album title cannot be empty.");
      return;
    }
    setCreating(true);
    setTitleError("");
    try {
      const newAlbum = await albumService.createAlbum(newAlbumTitle.trim());
      if (newAlbum) {
        setAlbums((prev) => [newAlbum, ...prev]);
        setNewAlbumTitle("");
        setShowCreateForm(false);
      }
    } catch (error) {
      setTitleError("Failed to create album. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const filteredAlbums = searchQuery.trim()
    ? albums.filter((album) =>
        (album.title || "")
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      )
    : albums;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>New Album</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">My Photo Albums</h1>
        <p className="text-gray-600 mt-1">
          {albums.length === 0
            ? "Create your first photo album to showcase your memories"
            : `${albums.length} ${albums.length === 1 ? "album" : "albums"} in your collection`}
        </p>

        {/* Create Album Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Create New Album
              </h2>
              <form onSubmit={handleCreateAlbum}>
                <div className="mb-4">
                  <label
                    htmlFor="album-title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Album Title
                  </label>
                  <input
                    type="text"
                    id="album-title"
                    value={newAlbumTitle}
                    onChange={(e) => setNewAlbumTitle(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${titleError ? "border-error-300" : "border-gray-300"}`}
                    placeholder="Enter album title..."
                    required
                    autoFocus
                  />
                  {titleError && (
                    <p className="mt-1 text-sm text-error-600">{titleError}</p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={creating || !newAlbumTitle.trim()}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {creating ? "Creating..." : "Create Album"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewAlbumTitle("");
                      setTitleError("");
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-8">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer group"
              onClick={(e) => {

                if (
                  e.target.closest("button") ||
                  e.target.tagName.toLowerCase() === "input"
                )
                  return;
                navigate(`/album/${album.id}`);
              }}
            >

              {thumbnails[album.id] ? (
                <img
                  src={
                    thumbnails[album.id].startsWith("http")
                      ? thumbnails[album.id]
                      : `http://localhost:8080${thumbnails[album.id]}`
                  }
                  alt={album.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-48 bg-gray-100 text-gray-400 text-4xl">
                  <span role="img" aria-label="Empty album">
                    📷
                  </span>
                  <span className="text-base mt-2">Empty album</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center">
                  {editingAlbumId === album.id ? (
                    <>
                      <input
                        className="border rounded px-2 py-1 flex-1 text-lg font-semibold"
                        value={albumTitleDraft}
                        onChange={(e) => setAlbumTitleDraft(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        className="ml-2 text-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEdit(album);
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="ml-1 text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelEdit();
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold text-xl text-gray-900 flex-1">
                        {album.title}
                      </div>
                      <button
                        className="ml-2 text-blue-500 hover:text-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(album);
                        }}
                        title="Edit album name"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>
                    <svg
                      className="inline w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7h2a2 2 0 012 2v10a2 2 0 01-2 2H3m0-14v14m0-14a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2zm0 0V5a2 2 0 012-2h14a2 2 0 012 2v2"
                      />
                    </svg>
                    {photoCounts[album.id] || 0}{" "}
                    {photoCounts[album.id] === 1 ? "photo" : "photos"}
                  </span>
                  <span>
                    Created{" "}
                    {album.createdAt
                      ? new Date(album.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {filteredAlbums.length === 0 && (
            <div className="col-span-full text-gray-500 text-lg text-center py-8">
              No albums found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Albums;
