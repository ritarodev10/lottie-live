import React from "react";
import { ColorResult } from "react-color";
import ColorPicker from "./ColorPicker";

interface EditTabProps {
  duration: number;
  setDuration: (duration: number) => void;
  colors: string[];
  handleColorClick: (
    color: string,
    index: number,
    event: React.MouseEvent<HTMLDivElement>
  ) => void;
  colorPickerOpen: boolean;
  colorPickerPosition: { top: number; left: number } | null;
  currentColor: string;
  handleColorChange: (newColor: ColorResult) => void;
  setColorPickerOpen: (isOpen: boolean) => void;
  title: string;
  displayColors: string[];
}

const EditTab: React.FC<EditTabProps> = ({
  duration,
  setDuration,
  handleColorClick,
  colorPickerOpen,
  colorPickerPosition,
  currentColor,
  handleColorChange,
  setColorPickerOpen,
  title,
  displayColors,
}) => {
  return (
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
            onChange={(e) => setDuration(parseFloat(e.target.value))}
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
                  onClick={(event) => handleColorClick(color, index, event)}
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
  );
};

export default EditTab;
