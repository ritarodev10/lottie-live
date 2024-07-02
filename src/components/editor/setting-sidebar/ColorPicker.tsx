import React from "react";
import { SketchPicker, ColorResult } from "react-color";
import useClickOutside from "../../../hooks/useClickOutside";

interface ColorPickerProps {
  color: string;
  position: { top: number; left: number };
  onChangeComplete: (color: ColorResult) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  position,
  onChangeComplete,
  onClose,
}) => {
  const pickerRef = React.useRef<HTMLDivElement | null>(null);

  useClickOutside(pickerRef, onClose);

  return (
    <div
      ref={pickerRef}
      className="absolute z-50"
      style={{ top: position.top, left: position.left }}
    >
      <SketchPicker color={color} onChangeComplete={onChangeComplete} />
    </div>
  );
};

export default ColorPicker;
