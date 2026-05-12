import React, { useState } from "react";
import { Type, Image, Video, Music, Save, ArrowLeft } from "lucide-react";
import { uploadStoryImage } from "../../services/uploadService";

const Toolbar = ({ onAddElement, onSave, onBack, isSaving }) => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVideoEmbed, setShowVideoEmbed] = useState(false);
  const [showAudioEmbed, setShowAudioEmbed] = useState(false);
  const [videoEmbedCode, setVideoEmbedCode] = useState("");
  const [audioEmbedCode, setAudioEmbedCode] = useState("");

  const addTextElement = () => {
    const textContent = {
      text: "New text",
      fontSize: 16,
      fontWeight: "normal",
      color: "#000000",
      textAlign: "left",
    };

    onAddElement({
      type: "text",
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: 1,
      content: textContent,
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const url = await uploadStoryImage(file);

        const imageContent = {
          url: url,
          alt: file.name,
        };

        onAddElement({
          type: "image",
          x: 150,
          y: 150,
          width: 300,
          height: 200,
          rotation: 0,
          zIndex: 1,
          content: imageContent,
        });
      } catch (error) {
        alert("Failed to upload image: " + error.message);
      }
    }
    setShowImageUpload(false);
  };

  const addVideoElement = () => {
    if (videoEmbedCode.trim()) {
      const videoContent = {
        embedCode: videoEmbedCode.trim(),
        title: "Embedded Video",
      };

      onAddElement({
        type: "video",
        x: 200,
        y: 200,
        width: 400,
        height: 300,
        rotation: 0,
        zIndex: 1,
        content: videoContent,
      });

      setVideoEmbedCode("");
      setShowVideoEmbed(false);
    }
  };

  const addAudioElement = () => {
    if (audioEmbedCode.trim()) {
      const audioContent = {
        embedCode: audioEmbedCode.trim(),
        title: "Embedded Audio",
      };

      onAddElement({
        type: "audio",
        x: 250,
        y: 250,
        width: 300,
        height: 100,
        rotation: 0,
        zIndex: 1,
        content: audioContent,
      });

      setAudioEmbedCode("");
      setShowAudioEmbed(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center space-x-2">
            <button
              onClick={addTextElement}
              className="flex items-center space-x-2 px-3 py-2 bg-primary-50 text-primary-600 rounded-md hover:bg-primary-100 transition-colors"
            >
              <Type className="w-4 h-4" />
              <span>Text</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowImageUpload(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
              >
                <Image className="w-4 h-4" />
                <span>Image</span>
              </button>
              {showImageUpload && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-4 w-64 z-10">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Upload Image
                  </h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
                  />
                  <button
                    onClick={() => setShowImageUpload(false)}
                    className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowVideoEmbed(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-accent-50 text-accent-600 rounded-md hover:bg-accent-100 transition-colors"
              >
                <Video className="w-4 h-4" />
                <span>Video</span>
              </button>
              {showVideoEmbed && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-4 w-96 z-10">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Embed Video
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Paste the embed code from YouTube, Vimeo, or other video
                    platforms
                  </p>
                  <textarea
                    placeholder='<iframe src="..." width="560" height="315" frameborder="0" allowfullscreen></iframe>'
                    value={videoEmbedCode}
                    onChange={(e) => setVideoEmbedCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    rows={4}
                  />
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={addVideoElement}
                      disabled={!videoEmbedCode.trim()}
                      className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Video
                    </button>
                    <button
                      onClick={() => {
                        setShowVideoEmbed(false);
                        setVideoEmbedCode("");
                      }}
                      className="px-3 py-1 text-gray-500 text-sm hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowAudioEmbed(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
              >
                <Music className="w-4 h-4" />
                <span>Audio</span>
              </button>
              {showAudioEmbed && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-4 w-96 z-10">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    Embed Audio
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Paste the embed code from Spotify, SoundCloud, or other
                    audio platforms
                  </p>
                  <textarea
                    placeholder='<iframe src="..." width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'
                    value={audioEmbedCode}
                    onChange={(e) => setAudioEmbedCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    rows={4}
                  />
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={addAudioElement}
                      disabled={!audioEmbedCode.trim()}
                      className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Audio
                    </button>
                    <button
                      onClick={() => {
                        setShowAudioEmbed(false);
                        setAudioEmbedCode("");
                      }}
                      className="px-3 py-1 text-gray-500 text-sm hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onSave}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          disabled={isSaving}
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
