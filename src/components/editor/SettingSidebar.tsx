import React, { useState, useEffect } from "react";
import { useAnimationStore } from "../../stores/lottie.store";
import { ColorResult } from "react-color";
import { db } from "../../firebaseConfig";
import { ref, set } from "firebase/database";
import {
  extractColorsFromAnimation,
  extractColorsFromLayer,
  updateShapeColor,
} from "../../lib/color.utils";
import ColorPicker from "./setting-sidebar/ColorPicker";

const SettingSidebar: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Edit");
  const [colors, setColors] = useState<string[]>([]);
  const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>("");
  const [currentColorIndex, setCurrentColorIndex] = useState<number | null>(
    null
  );
  const [colorPickerPosition, setColorPickerPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const {
    selectedAnimationData,
    selectedLayer,
    selectedShape,
    setSelectedAnimationData,
  } = useAnimationStore();

  const tabs = ["Edit", "Info"];

  useEffect(() => {
    if (selectedAnimationData) {
      const extractedColors = extractColorsFromAnimation(selectedAnimationData);
      setColors(extractedColors);

      const frameCount = selectedAnimationData.op - selectedAnimationData.ip;
      const durationInSeconds = frameCount / selectedAnimationData.fr;
      setDuration(durationInSeconds);
    }
  }, [selectedAnimationData, selectedLayer, selectedShape]);

  const handleColorClick = (
    color: string,
    index: number,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    setCurrentColor(color);
    setCurrentColorIndex(index);
    setColorPickerOpen(true);

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    setColorPickerPosition({
      top: rect.bottom - 50,
      left: rect.left,
    });
  };

  const handleColorChange = async (newColor: ColorResult) => {
    if (currentColorIndex !== null && selectedAnimationData) {
      const updatedColors = [...colors];
      const oldColor = updatedColors[currentColorIndex];
      updatedColors[currentColorIndex] = newColor.hex;
      setColors(updatedColors);
      setCurrentColor(newColor.hex);

      const updatedAnimationData = { ...selectedAnimationData };

      if (selectedShape) {
        updateShapeColor(selectedShape.shape, oldColor, newColor.hex);
      } else if (selectedLayer) {
        selectedLayer.shapes?.forEach((shape) =>
          updateShapeColor(shape, oldColor, newColor.hex)
        );
      } else {
        updatedAnimationData.layers.forEach((layer) => {
          if (layer.ty === 4 && layer.shapes) {
            layer.shapes.forEach((shape) =>
              updateShapeColor(shape, oldColor, newColor.hex)
            );
          }
        });
      }

      setSelectedAnimationData(updatedAnimationData);

      const projectId = new URLSearchParams(window.location.search).get(
        "projectId"
      );
      if (projectId) {
        try {
          await set(ref(db, "projects/" + projectId), {
            projectId,
            jsonContent: updatedAnimationData,
          });
        } catch (e) {
          console.error("Error updating document: ", e);
        }
      }
    }
  };

  const handleDurationChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDuration = parseFloat(event.target.value);
    setDuration(newDuration);

    if (selectedAnimationData) {
      const frameCount = selectedAnimationData.op - selectedAnimationData.ip;
      const newFrameRate = frameCount / newDuration;
      const updatedAnimationData = {
        ...selectedAnimationData,
        fr: newFrameRate,
      };

      setSelectedAnimationData(updatedAnimationData);

      const projectId = new URLSearchParams(window.location.search).get(
        "projectId"
      );
      if (projectId) {
        try {
          await set(ref(db, "projects/" + projectId), {
            projectId,
            jsonContent: updatedAnimationData,
          });
        } catch (e) {
          console.error("Error updating document: ", e);
        }
      }
    }
  };

  let title = "Document colors";
  let displayColors = colors;

  if (selectedShape) {
    title = `${selectedShape.shape.nm} fill`;
    displayColors = extractColorsFromLayer(selectedShape.parentLayer);
  } else if (selectedLayer) {
    title = `Color in selected layers`;
    displayColors = extractColorsFromLayer(selectedLayer);
  }

  const animationName = selectedAnimationData?.nm || "Unknown";
  const animationWidth = selectedAnimationData?.w || 0;
  const animationHeight = selectedAnimationData?.h || 0;

  return (
    <div className="col-span-1 row-span-11 row-start-2 z-20 pointer-events-none">
      <div className="z-20 pointer-events-none w-64 h-full flex flex-col gap-4 relative">
        <div className="flex-1">
          <div className="w-full h-auto select-none shadow-md shadow-gray-400/10 hover:shadow-xl ring-editor-shell transition duration-1000 ease-in-out bg-white transform bg-editor-shell rounded-2xl pt-2 pb-2 px-2 self-start flex max-h-full pointer-events-auto group/layers touch-none">
            <div className="w-full">
              <div className="flex gap-3 text-gray-600 pt-2 border-b">
                {tabs.map((tab) => (
                  <div
                    key={tab}
                    className={`p-1 border-b-2 text-sm ${
                      selectedTab === tab
                        ? "border-transparent text-gray-600"
                        : "border-transparent text-gray-400"
                    } cursor-pointer`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab}
                  </div>
                ))}
              </div>
              {selectedTab === "Edit" && (
                <div className="py-4">
                  <div className="flex flex-col gap-4">
                    <div className="px-2">
                      <label className="block text-xs text-gray-500 mb-2">
                        Animation Duration (seconds)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={duration}
                        onChange={handleDurationChange}
                        className="w-20 border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div className="border-b"></div>
                    <div>
                      <h3 className="text-xs text-gray-500 px-2">{title}</h3>
                      <div className="pt-2 space-y-2 text-sm text-gray-500 px-2">
                        {displayColors.map((color, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 border rounded-sm cursor-pointer"
                              style={{ backgroundColor: color }}
                              onClick={(event) =>
                                handleColorClick(color, index, event)
                              }
                            ></div>
                            <span>{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {colorPickerOpen && colorPickerPosition && (
                    <ColorPicker
                      color={currentColor}
                      position={colorPickerPosition}
                      onChangeComplete={handleColorChange}
                      onClose={() => setColorPickerOpen(false)}
                    />
                  )}
                </div>
              )}
              {selectedTab === "Info" && (
                <div className="py-4 px-2 text-xs text-gray-500">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">
                        Animation Name
                      </label>
                      <p className="px-2 py-1 bg-gray-100 rounded">
                        {animationName}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">
                        Animation Duration (seconds)
                      </label>
                      <p className="px-2 py-1 bg-gray-100 rounded">
                        {duration.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">
                        Animation Size (px)
                      </label>
                      <p className="px-2 py-1 bg-gray-100 rounded">
                        {animationWidth} x {animationHeight}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SettingSidebar);
