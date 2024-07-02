import React from "react";
import Timeline from "../components/editor/Timeline";
import Canvas from "../components/editor/Canvas";
import LayerSidebar from "../components/editor/layer-sidebar/LayerSidebar";
import SettingSidebar from "../components/editor/SettingSidebar";
import Chatbox from "../components/chatbox/Chatbox";

const Editor: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Chatbox />
      <div className="z-50 fixed flex w-[calc(100%-256px)] h-full text-gray-400 font-editor overflow-hidden">
        <div className="px-4 pt-3 absolute w-full h-full inset-0 flex flex-col gap-2 overflow-hidden">
          <div className="grid grid-cols-editor grid-rows-editor row gap-4 grid-flow-row-dense flex-1 min-h-0">
            <LayerSidebar />
            <div className="col-span-5 row-span-10 row-start-2 pt-6"></div>
            <SettingSidebar />
          </div>
          <Timeline />
        </div>
      </div>
      <Canvas />
    </div>
  );
};

export default Editor;
