import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { useLocation } from "react-router-dom";
import LayerItem from "./LayerItem";
import { LottieAnimationData } from "../../../types/lottie.type";
import { useAnimationStore } from "../../../stores/lottie.store";
import { db } from "../../../firebaseConfig";

const LayerSidebar: React.FC = () => {
  const [animationData, setAnimationData] =
    useState<LottieAnimationData | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("projectId");
  const { setSelectedAnimationData } = useAnimationStore();

  useEffect(() => {
    const fetchAnimationData = async () => {
      if (projectId) {
        const projectRef = ref(db, `projects/${projectId}`);
        try {
          const snapshot = await get(projectRef);
          if (snapshot.exists()) {
            const projectData = snapshot.val();
            setAnimationData(projectData.jsonContent);
            setSelectedAnimationData(projectData.jsonContent);
          } else {
            console.error("Project not found");
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      }
    };

    fetchAnimationData();
  }, [projectId, setSelectedAnimationData]);

  if (!animationData || !animationData.layers) {
    return <div>No layers available</div>;
  }

  return (
    <div className="col-span-1 row-span-11 row-start-2 z-20 pointer-events-none">
      <div className="z-20 pointer-events-none w-64 h-full flex flex-col gap-4 relative">
        <div className="flex-1">
          <div className="w-full h-2/3 select-none shadow-md shadow-gray-400/10 hover:shadow-xl ring-editor-shell transition duration-1000 ease-in-out bg-white transform bg-editor-shell rounded-2xl pt-2 pb-2 px-2 self-start flex flex-col max-h-full pointer-events-auto group/layers touch-none">
            <div className="py-3 border-b-2 w-full">
              <h3 className="text-lg font-semibold text-gray-800 pl-2">
                {animationData.nm}
              </h3>
            </div>
            <div className="overflow-y-auto w-full pt-3">
              {animationData.layers.map((layer) => (
                <LayerItem key={layer.nm} layer={layer} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerSidebar;
