import React from "react";

interface InfoTabProps {
  animationName: string;
  duration: number;
  animationWidth: number;
  animationHeight: number;
}

const InfoTab: React.FC<InfoTabProps> = ({
  animationName,
  duration,
  animationWidth,
  animationHeight,
}) => {
  return (
    <div className="py-4 px-2 text-xs text-gray-500">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-2">
            Animation Name
          </label>
          <p className="px-2 py-1 bg-gray-100 rounded">{animationName}</p>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-2">
            Animation Duration (seconds)
          </label>
          <p className="px-2 py-1 bg-gray-100 rounded">{duration.toFixed(2)}</p>
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
  );
};

export default InfoTab;
