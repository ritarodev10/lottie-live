import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { ref, get } from "firebase/database";
import Lottie from "react-lottie-player";
import { useAnimationStore } from "../../stores/lottie.store";
import { LottieAnimationData } from "../../types/lottie.type";

const FrameEditor: React.FC = () => {
  const [animationData, setAnimationData] =
    useState<LottieAnimationData | null>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("projectId");

  const {
    isPlaying,
    isLooping,
    playbackRate,
    currentFrame,
    setTotalFrames,
    setFrameRate,
    setCurrentFrame,
  } = useAnimationStore();

  useEffect(() => {
    const fetchAnimationData = async () => {
      if (projectId) {
        const projectRef = ref(db, `projects/${projectId}`);
        try {
          const snapshot = await get(projectRef);
          if (snapshot.exists()) {
            const projectData = snapshot.val();
            setAnimationData(projectData.jsonContent);
            setTotalFrames(
              projectData.jsonContent.op - projectData.jsonContent.ip
            );
            setFrameRate(projectData.jsonContent.fr);
          } else {
            console.error("Project not found");
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      }
    };

    fetchAnimationData();
  }, [projectId, setTotalFrames, setFrameRate]);

  const commonStyles: React.CSSProperties = {
    height: "500px",
    width: "500px",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%) scale(1, 1)",
    position: "absolute",
  };

  return (
    <>
      <svg
        className="scene-svg bg-editor-bg z-10 appearance-none"
        viewBox="0 0 500 500"
        style={commonStyles}
      >
        <defs>
          <pattern
            id="dots"
            viewBox="0 0 50 50"
            width="25"
            height="25"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="25" cy="25" r="2" fill="#D5D2D2"></circle>
          </pattern>
        </defs>
        <rect fill="url(#dots)" x="0" width="500" height="500"></rect>
      </svg>
      <div
        className="pointer-events-none rounded bg-white z-0 shadow-2xl border-solid border-editor-shell"
        style={commonStyles}
      ></div>
      <div className="z-50" style={commonStyles}>
        {animationData && (
          <Lottie
            loop={isLooping}
            play={isPlaying}
            goTo={currentFrame}
            animationData={animationData}
            speed={playbackRate}
            style={{ width: "100%", height: "auto" }}
            className="mb-4 rounded-md"
            onEnterFrame={({ currentTime }) => setCurrentFrame(currentTime)}
          />
        )}
      </div>
    </>
  );
};

export default FrameEditor;
