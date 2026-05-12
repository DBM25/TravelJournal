import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { storyService } from "../services/storyService";
import StoryPreview from "../components/Dashboard/StoryPreview";
import { cn } from "../utils/classNames";
import { validateStoryTitle } from "../utils/validation";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      try {
        const fetchedStories = await storyService.getStories();
        setStories(fetchedStories);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  const handleCreateStory = async () => {
 
    const titleValidation = validateStoryTitle(newStoryTitle);
    if (!titleValidation.isValid) {
      setTitleError(titleValidation.message);
      return;
    }

    setIsCreating(true);
    setTitleError("");

    try {
      const newStory = await storyService.createStory(newStoryTitle.trim());
      if (newStory) {
        setStories((prev) => [newStory, ...prev]);
        setNewStoryTitle("");
        setShowCreateForm(false);
        navigate(`/editor/${newStory.id}`);
      }
    } catch (error) {
      console.error("Failed to create story:", error);
      setTitleError("Failed to create story. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteStory = async (e, storyId) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    try {
      const success = await storyService.deleteStory(storyId);
      if (success) {
        setStories((prev) => prev.filter((story) => story.id !== storyId));
      }
    } catch (error) {
      console.error("Failed to delete story:", error);
    }
  };

  const handleEditStory = (e, storyId) => {
    e.stopPropagation();
    navigate(`/editor/${storyId}`);
  };

  const handleCardClick = (storyId) => {
    navigate(`/story/${storyId}`);
  };

  const handleTitleChange = (e) => {
    setNewStoryTitle(e.target.value);
    if (titleError) {
      setTitleError(""); 
    }
  };

  const filteredStories = stories.filter((story) =>
    story.title?.toLowerCase().includes(search.toLowerCase()),
  );

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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Travel Stories
            </h1>
            <p className="text-gray-600 mt-1">
              {stories.length === 0
                ? "Start your travel journaling journey by creating your first story"
                : `${stories.length} ${stories.length === 1 ? "story" : "stories"} in your collection`}
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className={cn(
              "flex items-center space-x-2 px-4 py-2",
              "bg-primary-600 text-white rounded-lg hover:bg-primary-700",
              "transition-colors shadow-sm",
            )}
          >
            <Plus className="w-5 h-5" />
            <span>New Story</span>
          </button>
        </div>


        <div className="mb-8 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>


        {showCreateForm && (
          <div className="mb-8 max-w-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateStory();
              }}
              className="bg-white rounded-lg shadow p-6 flex flex-col gap-4"
            >
              <div>
                <label
                  htmlFor="storyTitle"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Story Title
                </label>
                <input
                  id="storyTitle"
                  value={newStoryTitle}
                  onChange={handleTitleChange}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg shadow-sm",
                    titleError ? "border-error-500" : "border-gray-300",
                  )}
                  placeholder="Enter a title for your story"
                  disabled={isCreating}
                  required
                />
                {titleError && (
                  <p className="mt-1 text-sm text-error-600">{titleError}</p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-100 rounded-lg mr-2"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={cn(
                    "px-4 py-2 bg-primary-600 text-white rounded-lg",
                    "hover:bg-primary-700 transition-colors",
                  )}
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create Story"}
                </button>
              </div>
            </form>
          </div>
        )}


        {filteredStories.length === 0 ? (
          <div className="text-center text-gray-500 py-24">
            <p className="text-lg mb-4">No stories found.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className={cn(
                "inline-flex items-center space-x-2 px-6 py-3",
                "bg-primary-600 text-white rounded-lg hover:bg-primary-700",
                "transition-colors",
              )}
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Travel Story</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                onClick={() => handleCardClick(story.id)}
                className={cn(
                  "bg-white rounded-lg shadow-sm border border-gray-200",
                  "hover:shadow-md transition-all duration-200 group cursor-pointer",
                  "hover:border-primary-200 overflow-hidden",
                )}
              >
 
                <div className="relative">
                  <StoryPreview story={story} className="w-full h-48" />


                  <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditStory(e, story.id)}
                      className={cn(
                        "p-2 bg-white/90 backdrop-blur-sm text-gray-600",
                        "hover:text-primary-600 transition-colors rounded-full shadow-sm",
                      )}
                      title="Edit story"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteStory(e, story.id)}
                      className={cn(
                        "p-2 bg-white/90 backdrop-blur-sm text-gray-600",
                        "hover:text-error-600 transition-colors rounded-full shadow-sm",
                      )}
                      title="Delete story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className={cn(
                        "text-lg font-semibold text-gray-900",
                        "group-hover:text-primary-600 transition-colors",
                        "line-clamp-2 flex-1",
                      )}
                    >
                      {story.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400">
                    Updated{" "}
                    {story.updatedAt
                      ? new Date(story.updatedAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short", day: "numeric" },
                        )
                      : "Unknown date"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
