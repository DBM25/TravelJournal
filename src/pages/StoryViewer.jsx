import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit3, ArrowLeft, Calendar, Clock, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { storyService } from "../services/storyService";
import Canvas from "../components/Editor/Canvas";
import { getSmartDateFormat } from "../utils/dateUtils";
import { cn } from "../utils/classNames";

const StoryViewer = () => {
  const [story, setStory] = useState(null);
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { storyId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (storyId) {
      loadStory();
    } else {
      navigate("/stories");
    }
  }, [storyId, user]);

  const loadStory = async () => {
    if (!storyId) return;

    setLoading(true);
    try {
      const loadedStory = await storyService.getStory(storyId);
      if (loadedStory) {
        setStory(loadedStory);
        const parsedElements = JSON.parse(loadedStory.contentJson || "[]");
        setElements(parsedElements);
      } else {
        navigate("/stories");
      }
    } catch (error) {
      console.error("Failed to load story:", error);
      navigate("/stories");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/editor/${storyId}`);
  };

  const handleBack = () => {
    navigate("/stories");
  };

 
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };


  const handleDeleteConfirm = async () => {
    if (!story) return;

    setIsDeleting(true);
    try {
      const success = await storyService.deleteStory(story.id);
      if (success) {
        navigate("/stories");
      } else {
        console.error("Failed to delete story");
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error("Failed to delete story:", error);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Story not found
          </h2>
          <p className="text-gray-600 mb-4">
            The story you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <button
            onClick={handleBack}
            className={cn(
              "px-4 py-2 bg-primary-600 text-white rounded-md",
              "hover:bg-primary-700 transition-colors",
            )}
          >
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="h-6 w-px bg-gray-300" />

            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {story.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Created {getSmartDateFormat(story.createdAt)}</span>
                </div>
                {story.updatedAt !== story.createdAt && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Updated {getSmartDateFormat(story.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleEdit}
              className={cn(
                "flex items-center space-x-2 px-4 py-2",
                "bg-primary-600 text-white rounded-md hover:bg-primary-700",
                "transition-colors",
              )}
            >
              <Edit3 className="w-5 h-5" />
              <span>Edit Story</span>
            </button>

            <button
              onClick={handleDeleteClick}
              className={cn(
                "flex items-center space-x-2 px-4 py-2",
                "bg-error-600 text-white rounded-md hover:bg-error-700",
                "transition-colors",
              )}
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>


      <div className="flex-1 px-8 py-8">
        <Canvas elements={elements} isViewMode={true} />
      </div>

    
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Delete Story
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this story? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-md bg-error-600 text-white hover:bg-error-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;
