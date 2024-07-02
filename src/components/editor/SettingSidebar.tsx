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
import EditTab from "./setting-sidebar/EditTab";
import InfoTab from "./setting-sidebar/InfoTab";

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
                <EditTab
                  duration={duration}
                  colors={displayColors}
                  colorPickerOpen={colorPickerOpen}
                  currentColor={currentColor}
                  colorPickerPosition={colorPickerPosition}
                  handleDurationChange={handleDurationChange}
                  handleColorClick={handleColorClick}
                  handleColorChange={handleColorChange}
                  handleClickOutside={() => setColorPickerOpen(false)}
                  title={title}
                />
              )}
              {selectedTab === "Info" && (
                <InfoTab
                  animationName={animationName}
                  duration={duration}
                  animationWidth={animationWidth}
                  animationHeight={animationHeight}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SettingSidebar);
