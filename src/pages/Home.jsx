import React, { useState, useEffect } from "react";
import { Search, ArrowRight, BookOpen, Camera, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { storyService } from "../services/storyService";
import { albumService } from "../services/albumService";
import { photoService } from "../services/photoService";
import StoryPreview from "../components/Dashboard/StoryPreview";
import AlbumPreview from "../components/Dashboard/AlbumPreview";
import { formatDate } from "../utils/dateUtils";
import { cn } from "../utils/classNames";

const Home = () => {
  const [recentStories, setRecentStories] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [albumThumbnails, setAlbumThumbnails] = useState({});
  const [albumPhotoCounts, setAlbumPhotoCounts] = useState({});

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadRecentContent();
  }, [user]);

  const loadRecentContent = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [stories, albums] = await Promise.all([
        storyService.getStories(),
        albumService.getAlbums(),
      ]);

      setRecentStories(stories.slice(0, 5));
      setRecentAlbums(albums.slice(0, 5));


      const thumbs = {};
      const counts = {};
      await Promise.all(
        albums.slice(0, 5).map(async (album) => {
          const photos = await photoService.getPhotosByAlbum(album.id);
          thumbs[album.id] = photos[0]?.url || null;
          counts[album.id] = photos.length;
        }),
      );
      setAlbumThumbnails(thumbs);
      setAlbumPhotoCounts(counts);
    } catch (error) {
      console.error("Failed to load recent content:", error);
    } finally {
      setLoading(false);
    }
  };


  const filteredStories = searchQuery.trim()
    ? recentStories.filter((story) =>
        (story.title || "")
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      )
    : recentStories;

  const filteredAlbums = searchQuery.trim()
    ? recentAlbums.filter((album) =>
        (album.title || "")
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      )
    : recentAlbums;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <BookOpen className="w-12 h-12 text-primary-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {user?.name || user?.username}!
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Continue your creative journey. Craft beautiful stories, curate
            stunning photo albums, and preserve your memories in style.
          </p>
        </div>


        <div className="max-w-2xl mx-auto mb-16">
          <form className="relative" onSubmit={(e) => e.preventDefault()}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search your stories and albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
              className={cn(
                "block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl",
                "text-lg bg-white placeholder-gray-500 shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                "transition-all duration-200",
              )}
            />
          </form>
        </div>


        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Your Stories</h2>
            </div>
            <button
              onClick={() => navigate("/stories")}
              className={cn(
                "flex items-center space-x-2 px-6 py-3",
                "bg-primary-600 text-white rounded-xl hover:bg-primary-700",
                "transition-colors shadow-sm font-medium",
              )}
            >
              <span>View All Stories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {filteredStories.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No stories found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or create your first story
              </p>
              <button
                onClick={() => navigate("/stories")}
                className={cn(
                  "inline-flex items-center space-x-2 px-6 py-3",
                  "bg-primary-600 text-white rounded-xl hover:bg-primary-700",
                  "transition-colors font-medium",
                )}
              >
                <Plus className="w-5 h-5" />
                <span>New Story</span>
              </button>
            </div>
          ) : (
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {filteredStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => navigate(`/story/${story.id}`)}
                  className={cn(
                    "flex-shrink-0 w-80 bg-white rounded-2xl border border-gray-200",
                    "hover:shadow-lg transition-all duration-200 group cursor-pointer",
                    "hover:border-primary-200 overflow-hidden",
                  )}
                >

                  <StoryPreview story={story} className="w-full h-48" />


                  <div className="p-6">
                    <h3
                      className={cn(
                        "text-lg font-semibold text-gray-900 mb-2",
                        "group-hover:text-primary-600 transition-colors",
                        "line-clamp-2",
                      )}
                    >
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Updated {formatDate(story.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Your Albums Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Camera className="w-8 h-8 text-secondary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Your Albums</h2>
            </div>
            <button
              onClick={() => navigate("/albums")}
              className={cn(
                "flex items-center space-x-2 px-6 py-3",
                "bg-secondary-600 text-white rounded-xl hover:bg-secondary-700",
                "transition-colors shadow-sm font-medium",
              )}
            >
              <span>View All Albums</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {filteredAlbums.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No albums found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or create your first album
              </p>
              <button
                onClick={() => navigate("/albums")}
                className={cn(
                  "inline-flex items-center space-x-2 px-6 py-3",
                  "bg-secondary-600 text-white rounded-xl hover:bg-secondary-700",
                  "transition-colors font-medium",
                )}
              >
                <Plus className="w-5 h-5" />
                <span>New Album</span>
              </button>
            </div>
          ) : (
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {filteredAlbums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => navigate(`/album/${album.id}`)}
                  className={cn(
                    "flex-shrink-0 w-80 bg-white rounded-2xl border border-gray-200",
                    "hover:shadow-lg transition-all duration-200 group cursor-pointer",
                    "hover:border-secondary-200 overflow-hidden",
                  )}
                >
                  {/* Thumbnail */}
                  {albumThumbnails[album.id] ? (
                    <img
                      src={
                        albumThumbnails[album.id].startsWith("http")
                          ? albumThumbnails[album.id]
                          : `http://localhost:8080${albumThumbnails[album.id]}`
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
                  <div className="p-6">
                    <h3
                      className={cn(
                        "text-lg font-semibold text-gray-900 mb-2",
                        "group-hover:text-secondary-600 transition-colors",
                        "line-clamp-2",
                      )}
                    >
                      {album.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {albumPhotoCounts[album.id] !== undefined
                          ? `${albumPhotoCounts[album.id]} photo${albumPhotoCounts[album.id] !== 1 ? "s" : ""}`
                          : "0 photos"}
                      </span>
                      <span>Updated {formatDate(album.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
