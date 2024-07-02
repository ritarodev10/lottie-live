import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebaseConfig";
import { ref, set } from "firebase/database";
import { useQuery, gql } from "@apollo/client";
import Lottie from "react-lottie-player";
import { useAnimationStore } from "../stores/lottie.store";
import { LottieAnimationData } from "../types/lottie.type";
import Loading from "../components/Loading";

const GET_FEATURED_PUBLIC_ANIMATIONS = gql`
  query GetFeaturedPublicAnimations {
    featuredPublicAnimations(first: 20) {
      edges {
        node {
          id
          name
          description
          jsonUrl
          createdBy {
            id
            firstName
            avatarUrl
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

const BrowseProjects: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedAnimationData } = useAnimationStore();
  const { loading, error, data } = useQuery(GET_FEATURED_PUBLIC_ANIMATIONS, {
    variables: { first: 20 },
  });

  const [animationsData, setAnimationsData] = useState<{
    [key: string]: LottieAnimationData;
  }>({});

  useEffect(() => {
    if (data) {
      data.featuredPublicAnimations.edges.forEach(
        async ({ node }: { node: { id: string; jsonUrl: string } }) => {
          if (node.jsonUrl) {
            try {
              const response = await fetch(node.jsonUrl);
              const jsonData: LottieAnimationData = await response.json();
              setAnimationsData((prev) => ({ ...prev, [node.id]: jsonData }));
            } catch (fetchError) {
              console.error("Error fetching animation data:", fetchError);
            }
          }
        }
      );
    }
  }, [data]);

  const handleUploadJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const jsonContent = e.target?.result;
        if (jsonContent) {
          const projectId = `new-project-${uuidv4()}`;
          const userId = sessionStorage.getItem("userId");
          const userName = sessionStorage.getItem("userName");
          setSelectedAnimationData(
            JSON.parse(jsonContent.toString()) as LottieAnimationData
          );

          // Save project to Firebase Realtime Database
          try {
            await set(ref(db, "projects/" + projectId), {
              projectId,
              jsonContent: JSON.parse(jsonContent.toString()),
              registeredUsers: userId && userName ? [{ userId, userName }] : [],
            });
            console.log("Project data saved successfully.");
          } catch (e) {
            console.error("Error adding document: ", e);
          }

          navigate(`/editor?projectId=${projectId}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAnimationClick = async (
    name: string,
    animationData: LottieAnimationData
  ) => {
    const userId = sessionStorage.getItem("userId");
    const userName = sessionStorage.getItem("userName");
    setSelectedAnimationData(animationData);
    const sanitizedProjectName = name.replace(/\s+/g, "-");
    const projectId = `${sanitizedProjectName}-${uuidv4()}`;

    // Save project to Firebase Realtime Database
    try {
      await set(ref(db, "projects/" + projectId), {
        projectId,
        jsonContent: animationData,
        registeredUsers: userId && userName ? [{ userId, userName }] : [],
      });
      console.log("Project data saved successfully.");
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    navigate(`/editor?projectId=${projectId}`);
  };

  if (loading) return <Loading />;
  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading projects</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Browse Projects</h2>
        <input
          type="file"
          accept=".json"
          onChange={handleUploadJson}
          className="mb-4"
        />
      </div>
      <div className="mt-6 w-full max-w-4xl">
        <h3 className="text-xl font-bold mb-4 text-center">
          Popular Public Animations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.featuredPublicAnimations.edges.map(
            ({
              node,
            }: {
              node: {
                id: string;
                name: string;
                description: string;
                jsonUrl: string;
                createdBy: { firstName: string; avatarUrl: string };
              };
            }) => (
              <div
                key={node.id}
                className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                onClick={() =>
                  handleAnimationClick(node.name, animationsData[node.id])
                }
              >
                {animationsData[node.id] ? (
                  <Lottie
                    loop
                    play
                    animationData={animationsData[node.id]}
                    style={{ width: "100%", height: "auto" }}
                    className="mb-4 rounded-md"
                  />
                ) : (
                  <Loading /> // Display loading indicator while fetching animation data
                )}
                <h4 className="text-lg font-semibold mb-2">{node.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{node.description}</p>
                <p className="text-sm text-gray-600">
                  {node.createdBy.firstName}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseProjects;
