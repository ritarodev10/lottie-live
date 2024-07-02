import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebaseConfig";
import { ref, set, get, update } from "firebase/database";
import Lottie from "react-lottie-player";
import lottieLogin from "../assets/login-lottie.json";
import { UserData } from "../types/common.type";

const Login: React.FC = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (name) {
      const userId = uuidv4();
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("userName", name);

      // Save user to Firebase Realtime Database
      try {
        await set(ref(db, "users/" + userId), {
          userId,
          name,
        });
        console.log("User data saved successfully.");
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      // Check if there's a projectId in the URL
      const searchParams = new URLSearchParams(window.location.search);
      const projectId = searchParams.get("projectId");

      if (projectId) {
        // Update the project to include the logged-in user
        const projectRef = ref(db, `projects/${projectId}`);
        try {
          const snapshot = await get(projectRef);
          if (snapshot.exists()) {
            const projectData = snapshot.val();
            const registeredUsers = projectData.registeredUsers || [];
            if (
              !registeredUsers.some((user: UserData) => user.userId === userId)
            ) {
              registeredUsers.push({ userId, userName: name });
              await update(projectRef, { registeredUsers });
            }
          }
        } catch (e) {
          console.error("Error updating project: ", e);
        }

        navigate(`/editor?projectId=${projectId}`);
      } else {
        navigate("/browse-projects");
      }
    }
  };

  return (
    <div className="login flex items-center justify-center h-screen  overscroll-none">
      <div
        className="h-[70%] w-[50%] flex justify-center items-center rounded-3xl backdrop-filter backdrop-blur-lg bg-white bg-opacity-[0.95]"
        style={{
          boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
        }}
      >
        <div className="flex flex-col items-center -mt-10 justify-center">
          <Lottie
            loop
            play
            animationData={lottieLogin}
            style={{ width: "300px", height: "auto" }}
            className="mb-4 rounded-md"
          />
          <div className="w-full max-w-xs -mt-10 z-10">
            <div className="mb-4">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 "
                placeholder="Enter your name"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-[#3FE1E4] text-white py-2 px-4 rounded-md hover:shadow-md transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
