import React, { useState, useCallback, useEffect } from "react";
import ContentElement from "./ContentElement";

const Canvas = ({
  elements,
  onUpdateElement,
  onDeleteElement,
  isViewMode = false,
}) => {
  const [selectedElementId, setSelectedElementId] = useState(null);

  const handleCanvasClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget && !isViewMode) {
        setSelectedElementId(null);
      }
    },
    [isViewMode],
  );


  useEffect(() => {
    if (!isViewMode) {
      const handleKeyDown = (e) => {

        if (e.key === "Escape") {
          setSelectedElementId(null);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isViewMode]);


  useEffect(() => {
    if (isViewMode) {
      setSelectedElementId(null);
    }
  }, [isViewMode]);

  return (
    <div
      className="relative w-full h-full"
      style={{ minHeight: 400, minWidth: 400 }}
      onClick={handleCanvasClick}
    >
      {elements.map((el) => (
        <ContentElement
          key={el.id}
          element={el}
          isSelected={!isViewMode && selectedElementId === el.id}
          onSelect={isViewMode ? () => {} : setSelectedElementId}
          onUpdate={onUpdateElement}
          onDelete={onDeleteElement}
          isViewMode={isViewMode}
        />
      ))}


    </div>
  );
};

export default Canvas;
