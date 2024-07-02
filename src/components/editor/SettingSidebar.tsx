import React, { useState } from "react";

const SettingSidebar = () => {
  const [selectedTab, setSelectedTab] = useState("Edit");

  const tabs = ["Edit", "Setting", "Info"];

  return (
    <div className="col-span-1 row-span-11 row-start-2 z-20 pointer-events-none">
      <div className="z-20 pointer-events-none w-64 h-full flex flex-col gap-4 relative">
        <div className="flex-1">
          <div className="w-full h-1/2 select-none shadow-md shadow-gray-400/10 hover:shadow-xl ring-editor-shell transition duration-1000 ease-in-out bg-white transform bg-editor-shell rounded-2xl pt-2 pb-2 px-2 self-start flex max-h-full pointer-events-auto group/layers touch-none">
            <div className="w-full">
              <div className="flex gap-3 text-gray-600 pt-2 border-b-2">
                {tabs.map((tab) => (
                  <div
                    key={tab}
                    className={`p-1 border-b-2 ${
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingSidebar;
