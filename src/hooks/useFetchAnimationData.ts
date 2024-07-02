import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebaseConfig";
import { LottieAnimationData } from "../types/lottie.type";

const useFetchAnimationData = (projectId: string) => {
  const [animationData, setAnimationData] =
    useState<LottieAnimationData | null>(null);

  useEffect(() => {
    const fetchAnimationData = async () => {
      if (projectId) {
        const projectRef = ref(db, `projects/${projectId}`);
        try {
          const snapshot = await get(projectRef);
          if (snapshot.exists()) {
            setAnimationData(snapshot.val().jsonContent);
          } else {
            console.error("Project not found");
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      }
    };

    fetchAnimationData();
  }, [projectId]);

  return animationData;
};

export default useFetchAnimationData;
