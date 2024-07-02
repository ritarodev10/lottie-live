import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ImageIcon,
  TypeIcon,
  Layout,
  Layers2,
  Frame,
} from "lucide-react";
import { useAnimationStore } from "../../../stores/lottie.store";
import { Layer, Shape } from "../../../types/lottie.type";

const LayerItem: React.FC<{ layer: Layer }> = ({ layer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedLayer, selectedShape, setSelectedLayer, setSelectedShape } =
    useAnimationStore();
  console.log("🚀 ~ selectedShape:", selectedShape);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLayerSelect = () => {
    setSelectedLayer(layer);
  };

  const handleShapeSelect = (shape: Shape) => {
    setSelectedShape(shape, layer);
  };

  const renderIcon = () => {
    switch (layer.ty) {
      case 2: // Image layer
        return <ImageIcon size={16} />;
      case 5: // Text layer
        return <TypeIcon size={16} />;
      case 4: // Shape layer
        return <Layers2 size={16} />;
      default:
        return <Layout size={16} />;
    }
  };

  const isShapeSelected = (shape: Shape) =>
    selectedShape?.shape.nm === shape.nm &&
    selectedShape.parentLayer.nm === layer.nm;

  return (
    <div
      className={`text-gray-600 rounded ${
        selectedLayer?.nm === layer.nm ? "bg-purple-100" : ""
      }`}
    >
      <div
        className={`px-2 py-1 rounded flex items-center cursor-pointer ${
          selectedLayer?.nm === layer.nm ? "bg-purple-200" : ""
        }`}
        onClick={() => {
          handleToggle();
          handleLayerSelect();
        }}
      >
        {layer.shapes ? (
          isOpen ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )
        ) : (
          <span className="w-4" />
        )}
        {renderIcon()}
        <span className="ml-2">{layer.nm}</span>
      </div>
      {isOpen && layer.shapes && (
        <div className="pl-2">
          {layer.shapes.map((shape) => (
            <div
              key={shape.nm}
              className={`px-2 py-1 rounded cursor-pointer flex items-center ml-4 ${
                isShapeSelected(shape) ? "bg-purple-200" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleShapeSelect(shape);
              }}
            >
              <Frame size={16} />
              <span className="ml-2">{shape.nm}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LayerItem;
