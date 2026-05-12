import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { storyService } from "../services/storyService";
import Toolbar from "../components/Editor/Toolbar";
import Canvas from "../components/Editor/Canvas";

const Editor = () => {
  const [story, setStory] = useState(null);
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  const { storyId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (storyId) {
      loadStory();
    } else {

      setLoading(false);
    }
  }, [storyId, user]);


  useEffect(() => {
    if (story && elements.length > 0) {
      const interval = setInterval(() => {
        handleSave(false);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [story, elements]);

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
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Failed to load story:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (showNotification = true) => {
    if (!story || !user) return;

    setIsSaving(true);
    try {

      const success = await storyService.updateStory(story.id, {
        contentJson: JSON.stringify(elements),
      });
      if (success) {
        setLastSaved(new Date());
        if (showNotification) {

          console.log("Story saved successfully");
        }
      }
    } catch (error) {
      console.error("Failed to save story:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddElement = (elementData) => {
    const newElement = {
      ...elementData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setElements((prev) => [...prev, newElement]);
  };

  const handleUpdateElement = (id, updates) => {
    setElements((prev) =>
      prev.map((element) =>
        element.id === id ? { ...element, ...updates } : element,
      ),
    );
  };

  const handleDeleteElement = (id) => {
    setElements((prev) => prev.filter((element) => element.id !== id));
  };


  const handleBack = async () => {
    if (elements.length > 0 && story) {
      await handleSave(false);
    }
    navigate(`/story/${storyId}`);
  };


  const handleRename = async () => {
    if (!titleDraft.trim() || !story) {
      setEditingTitle(false);
      return;
    }
    if (titleDraft.trim() !== story.title) {

      await storyService.updateStory(story.id, { title: titleDraft.trim() });
      setStory({ ...story, title: titleDraft.trim() });
    }
    setEditingTitle(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toolbar
        onAddElement={handleAddElement}
        onSave={() => handleSave(true)}
        onBack={handleBack}
        isSaving={isSaving}
      />
      <div className="flex-1 flex flex-col">

        <div className="bg-white px-4 py-6 border-b border-gray-200">
          <div className="max-w-3xl mx-auto flex flex-col items-center justify-center w-full">
            <div className="flex-1 w-full flex justify-center">
              {editingTitle ? (
                <input
                  type="text"
                  className="text-2xl font-semibold text-gray-900 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename();
                    if (e.key === "Escape") setEditingTitle(false);
                  }}
                  autoFocus
                  style={{ textAlign: "center" }}
                />
              ) : (
                <span
                  className="text-2xl font-semibold text-gray-900 cursor-pointer block w-full text-center"
                  onClick={() => {
                    setEditingTitle(true);
                    setTitleDraft(story?.title || "");
                  }}
                  title="Click to rename"
                >
                  {story?.title || "New Story"}
                </span>
              )}
            </div>
            {lastSaved && (
              <span className="text-sm text-gray-500 mt-2">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <Canvas
            elements={elements}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            isViewMode={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
