import React from "react";

const BACKEND_BASE_URL = "http://localhost:8080";
const getImageUrl = (url) => {
  return url && url.startsWith("/uploads/") ? `${BACKEND_BASE_URL}${url}` : url;
};

const StoryPreview = ({ story, className = "" }) => {
  const getElements = () => {
    try {
      return JSON.parse(story.contentJson || "[]");
    } catch {
      return [];
    }
  };

  const elements = getElements();

  if (elements.length === 0) {
    return (
      <div
        className={`bg-gray-50 rounded-md flex items-center justify-center ${className}`}
      >
        <div className="text-center text-gray-400">
          <div className="text-2xl mb-1">📝</div>
          <div className="text-xs">Empty story</div>
        </div>
      </div>
    );
  }


  const firstImage = elements.find((el) => el.type === "image");


  if (firstImage) {
    return (
      <div className={`relative overflow-hidden rounded-md ${className}`}>
        <img
          src={getImageUrl(firstImage.content.url)}
          alt={firstImage.content.alt || "Story preview"}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

 
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-white border ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{ transform: "scale(0.15)", transformOrigin: "top left" }}
      >
        <div className="w-[800px] h-[600px] relative">
          {elements.slice(0, 8).map((element, index) => (
            <div
              key={element.id || index}
              className="absolute"
              style={{
                left: element.x || 0,
                top: element.y || 0,
                width: element.width || 100,
                height: element.height || 50,
                transform: `rotate(${element.rotation || 0}deg)`,
                zIndex: element.zIndex || 1,
              }}
            >
              {element.type === "text" && (
                <div
                  className="w-full h-full p-1 text-gray-800 overflow-hidden"
                  style={{
                    fontSize: `${(element.content?.fontSize || 16) * 0.8}px`,
                    fontWeight: element.content?.fontWeight || "normal",
                    color: element.content?.color || "#000000",
                    textAlign: element.content?.textAlign || "left",
                  }}
                >
                  <div className="whitespace-pre-wrap break-words line-clamp-3">
                    {element.content?.text || ""}
                  </div>
                </div>
              )}

              {element.type === "image" && (
                <img
                  src={getImageUrl(element.content?.url)}
                  alt={element.content?.alt || ""}
                  className="w-full h-full object-cover rounded-sm"
                />
              )}

              {element.type === "video" && (
                <div className="w-full h-full bg-gray-800 rounded-sm flex items-center justify-center">
                  <div className="text-white text-xs">📹</div>
                </div>
              )}

              {element.type === "audio" && (
                <div className="w-full h-full bg-gray-200 rounded-sm flex items-center justify-center">
                  <div className="text-gray-600 text-xs">🎵</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


      <div className="absolute inset-0 flex items-center justify-center p-2">
        <div className="text-center">
          <div className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
            {elements.find(
              (el) => el.type === "text" && el.content?.text?.trim(),
            )?.content?.text || "No content yet..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPreview;
