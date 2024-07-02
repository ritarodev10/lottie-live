import React from "react";
import FrameEditor from "./FrameEditor";

const Canvas = () => {
  return (
    <div className="w-[calc(100%-256px)] h-full  fixed touch-none">
      <FrameEditor />
    </div>
  );
};

export default Canvas;
