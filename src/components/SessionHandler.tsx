import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebaseConfig";
import { ref, get } from "firebase/database";
import Loading from "./Loading";

const SessionHandler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const searchParams = new URLSearchParams(location.search);
    const projectId = searchParams.get("projectId");

    // Function to validate the projectId
    const validateProjectId = async (projectId: string) => {
      const projectRef = ref(db, `projects/${projectId}`);
      try {
        const snapshot = await get(projectRef);
        return snapshot.exists();
      } catch {
        return false;
      }
    };

    // Function to handle navigation based on userId and projectId
    const handleNavigation = async () => {
      if (!userId) {
        // Redirect to login if no userId is found
        if (projectId) {
          navigate(`/login?projectId=${projectId}`);
          return;
        }
        navigate(`/login`);
        return;
      }

      if (location.pathname === "/" || location.pathname === "/login") {
        if (projectId) {
          const isValidProject = await validateProjectId(projectId);
          if (isValidProject) {
            navigate(`/editor?projectId=${projectId}`); // Navigate to editor if project is valid
          } else {
            navigate(`/login`); // Navigate to login if project is invalid
          }
        } else {
          navigate("/browse-projects"); // Navigate to browse projects if no projectId is provided
        }
      } else {
        if (projectId) {
          const isValidProject = await validateProjectId(projectId);
          if (!isValidProject) {
            navigate("/login"); // Navigate to login if project is invalid
          }
        }
      }
    };

    handleNavigation().finally(() => setLoading(false));
  }, [navigate, location.pathname, location.search]);

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default SessionHandler;
