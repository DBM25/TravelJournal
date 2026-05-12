import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import {
  Move,
  RotateCcw,
  RotateCw,
  Trash2,
  Edit3,
  Play,
  Pause,
  Maximize2,
} from "lucide-react";

const BACKEND_BASE_URL = "http://localhost:8080";

const ContentElement = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  isViewMode = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const textareaRef = useRef(null);
  const elementRef = useRef(null);
  const clickTimeoutRef = useRef(null);
  const clickCountRef = useRef(0);

  useEffect(() => {
    if (element.type === "text") {
      setTextValue(element.content.text || "");
    }
  }, [element]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);


  useEffect(() => {
    if (!isViewMode && isSelected) {
      const handleKeyDown = (e) => { 
        if (e.key === "Delete" || e.key === "Backspace") {
          e.preventDefault();
          onDelete(element.id);
        } else if (e.key === "Escape") {
          onSelect(null);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isSelected, isViewMode, onDelete, onSelect, element.id]);

  const handleDrag = (data) => {
    if (!isViewMode) {
      onUpdate(element.id, { x: data.x, y: data.y });
    }
  };

  const handleResize = (event, { size }) => {
    if (!isViewMode) {
      onUpdate(element.id, { width: size.width, height: size.height });
    }
  };

  const handleRotateRight = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isViewMode) {
      const newRotation = (element.rotation + 15) % 360;
      onUpdate(element.id, { rotation: newRotation });
    }
  };

  const handleRotateLeft = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isViewMode) {
      const newRotation = (element.rotation - 15 + 360) % 360;
      onUpdate(element.id, { rotation: newRotation });
    }
  };

  const toggleImageFit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isViewMode && element.type === "image") {
      const currentFit = element.content.objectFit || "cover";
      const nextFit =
        currentFit === "cover"
          ? "contain"
          : currentFit === "contain"
            ? "fill"
            : "cover";

      onUpdate(element.id, {
        content: {
          ...element.content,
          objectFit: nextFit,
        },
      });
    }
  };

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleTextBlur = () => {
    if (element.type === "text") {
      onUpdate(element.id, {
        content: {
          ...element.content,
          text: textValue,
        },
      });
    }
    setIsEditing(false);
  };

  const handleTextKeyDown = (e) => {
    if (e.key === "Escape") {
      setTextValue(element.content.text || "");
      setIsEditing(false);
    }
 
    e.stopPropagation();
  };

  const startEditing = () => {
    if (!isViewMode && element.type === "text") {
      setIsEditing(true);
    }
  };

  const handleElementClick = (e) => {
    if (isViewMode) return; 
    e.stopPropagation();
    if (isEditing) return;

    clickCountRef.current += 1;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      if (clickCountRef.current === 1) {

        onSelect(element.id);
      } else if (clickCountRef.current === 2) {

        if (element.type === "text") {
          startEditing();
        }

      }
      clickCountRef.current = 0;
    }, 250);
  };

  const togglePlayback = (e) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);

  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(element.id);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    startEditing();
  };

  const getObjectFitClass = (objectFit) => {
    switch (objectFit) {
      case "contain":
        return "object-contain"; 
      case "fill":
        return "object-fill"; 
      default:
        return "object-cover"; 
    }
  };

  const getObjectFitLabel = (objectFit) => {
    switch (objectFit) {
      case "contain":
        return "Fit (shows all)";
      case "fill":
        return "Stretch (may distort)";
      case "cover":
      default:
        return "Crop (fills container)";
    }
  };

  const getImageUrl = (url) => {
    return url && url.startsWith("/uploads/")
      ? `${BACKEND_BASE_URL}${url}`
      : url;
  };

  const renderContent = () => {
    switch (element.type) {
      case "text":
        const textContent = element.content;
        return (
          <div
            className={`w-full h-full p-2 ${!isViewMode ? "cursor-pointer" : ""} ${
              !isViewMode && !isEditing
                ? "shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1)] bg-white/90 backdrop-blur-sm rounded-md"
                : ""
            }`}
            style={{
              fontSize: `${textContent.fontSize}px`,
              fontWeight: textContent.fontWeight,
              color: textContent.color,
              textAlign: textContent.textAlign,
              minHeight: "40px",
            }}
          >
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={textValue}
                onChange={handleTextChange}
                onBlur={handleTextBlur}
                onKeyDown={handleTextKeyDown}
                className="w-full h-full bg-transparent border-0 outline-none resize-none rounded-md p-2 focus:ring-2 focus:ring-primary-500"
                style={{
                  fontSize: `${textContent.fontSize}px`,
                  fontWeight: textContent.fontWeight,
                  color: textContent.color,
                  textAlign: textContent.textAlign,
                  fontFamily: "inherit",
                }}
                placeholder="Type your text here..."
              />
            ) : (
              <div className="w-full h-full whitespace-pre-wrap break-words">
                {textContent.text ||
                  (!isViewMode ? "Click to edit text..." : "")}
              </div>
            )}
          </div>
        );

      case "image":
        const imageContent = element.content;
        const objectFit = imageContent.objectFit || "cover";
        return (
          <div className="w-full h-full relative">
            <img
              src={getImageUrl(imageContent.url)}
              alt={imageContent.alt}
              className={`w-full h-full rounded-md ${getObjectFitClass(objectFit)}`}
              draggable={false}
            />

            {!isViewMode && isSelected && (
              <div className="absolute bottom-1 left-1 bg-black/75 text-white text-xs px-2 py-1 rounded pointer-events-none">
                {getObjectFitLabel(objectFit)}
              </div>
            )}
          </div>
        );

      case "video":
        const videoContent = element.content;
        return (
          <div className="w-full h-full relative bg-gray-100 rounded-md overflow-hidden">
            {videoContent.embedCode ? (
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{
                  __html: videoContent.embedCode
                    .replace(/width="[^"]*"/gi, 'width="100%"')
                    .replace(/height="[^"]*"/gi, 'height="100%"')
                    .replace(
                      /style="[^"]*"/gi,
                      'style="width:100%;height:100%;border:0;"',
                    ),
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
                <div className="text-center">
                  <div className="text-4xl mb-2">📹</div>
                  <div className="text-sm">Video Embed</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Add embed code to display video
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "audio":
        const audioContent = element.content;
        return (
          <div className="w-full h-full relative bg-gray-50 rounded-md overflow-hidden">
            {audioContent.embedCode ? (
              <div
                className="w-full h-full flex items-center justify-center"
                dangerouslySetInnerHTML={{
                  __html: audioContent.embedCode
                    .replace(/width="[^"]*"/gi, 'width="100%"')
                    .replace(/height="[^"]*"/gi, 'height="100%"')
                    .replace(
                      /style="[^"]*"/gi,
                      'style="width:100%;height:100%;border:0;"',
                    ),
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-50">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎵</div>
                  <div className="text-sm">Audio Embed</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Add embed code to display audio
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <div>Unknown content type</div>;
    }
  };

  if (isViewMode) {
    return (
      <div
        ref={elementRef}
        className="absolute"
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          transform: `rotate(${element.rotation}deg)`,
          zIndex: element.zIndex,
        }}
      >
        {renderContent()}
      </div>
    );
  }

  return (
    <Draggable
      position={{ x: element.x, y: element.y }}
      onDrag={(e, data) => handleDrag(data)}
      onStart={() => setIsDragging(true)}
      onStop={() => setIsDragging(false)}
      handle=".drag-handle"
      disabled={isEditing || isViewMode}
    >
      <div
        ref={elementRef}
        className={`absolute cursor-pointer ${
          isSelected ? "ring-2 ring-primary-500 ring-opacity-75" : ""
        }`}
        style={{
          zIndex: isSelected ? 9999 : element.zIndex, 
        }}
        onClick={handleElementClick}
      >
        <ResizableBox
          width={element.width}
          height={element.height}
          onResize={handleResize}
          minConstraints={[50, 50]}
          resizeHandles={["se"]}
          disabled={isViewMode}
        >
          <div
            className="relative w-full h-full group"
            style={{
              transform: `rotate(${element.rotation}deg)`,
              transformOrigin: "center center",
            }}
          >
            {renderContent()}

            {!isViewMode && isSelected && element.type !== "text" && (
              <div className="absolute inset-0 border-2 border-primary-400 border-dashed rounded-md pointer-events-none" />
            )}
          </div>
        </ResizableBox>


        {!isViewMode && isSelected && !isEditing && (
          <>

            <div
              className="absolute pointer-events-none"
              style={{
                top: -60,
                left: 0,
                right: 0,
                height: 60,
                zIndex: 10000,
              }}
            />


            <div
              className="absolute flex items-center space-x-1 bg-white rounded-lg shadow-xl border-2 border-gray-200 px-3 py-2"
              style={{
                top: -48,
                left: 0,
                zIndex: 10001,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="drag-handle cursor-move p-1 hover:bg-gray-100 rounded transition-colors"
                title="Drag to move"
              >
                <Move className="w-4 h-4 text-gray-600" />
              </div>


              <button
                type="button"
                onMouseDown={handleRotateLeft}
                className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                title="Rotate left (15°)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onMouseDown={handleRotateRight}
                className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                title="Rotate right (15°)"
              >
                <RotateCw className="w-4 h-4" />
              </button>


              <div className="w-px h-4 bg-gray-300 mx-1" />

              {element.type === "text" && (
                <button
                  type="button"
                  onMouseDown={handleEdit}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                  title="Edit text"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}

              {element.type === "image" && (
                <button
                  type="button"
                  onMouseDown={toggleImageFit}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                  title={`Image fit: ${getObjectFitLabel(element.content.objectFit || "cover")}`}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}

              {(element.type === "video" || element.type === "audio") && (
                <button
                  type="button"
                  onMouseDown={togglePlayback}
                  className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              )}
              <button
                type="button"
                onMouseDown={handleDelete}
                className="p-1 hover:bg-gray-100 rounded text-error-600 transition-colors"
                title="Delete element (Del key)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </Draggable>
  );
};

export default ContentElement;
