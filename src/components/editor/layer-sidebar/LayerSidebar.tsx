import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import LayerItem from "./LayerItem";
import { useAnimationStore } from "../../../stores/lottie.store";
import useFetchAnimationData from "../../../hooks/useFetchAnimationData";

const LayerSidebar: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("projectId") ?? "";
  const animationData = useFetchAnimationData(projectId);
  const { setSelectedAnimationData } = useAnimationStore();

  useEffect(() => {
    if (animationData) {
      setSelectedAnimationData(animationData);
    }
  }, [animationData, setSelectedAnimationData]);

  const memoizedLayers = useMemo(() => {
    return animationData
      ? animationData.layers
          .filter((layer) => layer.ty !== 3) // Filter out null layers
          .map((layer) => <LayerItem key={layer.nm} layer={layer} />)
      : null;
  }, [animationData]);

  if (!animationData || !animationData.layers) {
    return <div>No layers available</div>;
  }

  return (
    <div className="col-span-1 row-span-11 row-start-2 z-20 pointer-events-none">
      <div className="z-20 pointer-events-none w-64 h-full flex flex-col gap-4 relative">
        <div className="flex-1">
          <div className="w-full h-2/3 select-none shadow-md shadow-gray-400/10 hover:shadow-xl ring-editor-shell transition duration-1000 ease-in-out bg-white transform bg-editor-shell rounded-2xl pt-2 pb-2 px-2 self-start flex flex-col max-h-full pointer-events-auto group/layers touch-none">
            <div className="py-3 border-b w-full">
              <h3 className="text-lg font-semibold text-gray-800 pl-2">
                {animationData.nm}
              </h3>
            </div>
            <div className="overflow-y-auto w-full pt-3">{memoizedLayers}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LayerSidebar);
