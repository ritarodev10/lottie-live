import React from "react";
import { ColorResult } from "react-color";
import ColorPicker from "./ColorPicker";

interface EditTabProps {
  duration: number;
  colors: string[];
  colorPickerOpen: boolean;
  currentColor: string;
  colorPickerPosition: { top: number } | null;
  handleDurationChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleColorClick: (
    color: string,
    index: number,
    event: React.MouseEvent<HTMLDivElement>
  ) => void;
  handleColorChange: (newColor: ColorResult) => void;
  handleClickOutside: () => void;
  title: string;
}

const EditTab: React.FC<EditTabProps> = ({
  duration,
  colors,
  colorPickerOpen,
  currentColor,
  colorPickerPosition,
  handleDurationChange,
  handleColorClick,
  handleColorChange,
  handleClickOutside,
  title,
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
            onChange={handleDurationChange}
            className="w-20 border rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="border-b"></div>
        <div>
          <h3 className="text-xs text-gray-500 px-2">{title}</h3>
          <div className="pt-2 space-y-2 text-sm text-gray-500 px-2">
            {colors.map((color, index) => (
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
          onClose={handleClickOutside}
        />
      )}
    </div>
  );
};

export default EditTab;
