import { v4 as uuidv4 } from "uuid";

export const getUserId = (): string => {
  let userId = sessionStorage.getItem("userId");
  if (!userId) {
    userId = uuidv4();
    sessionStorage.setItem("userId", userId);
  }
  return userId;
};

export const getSessionId = (searchParams: URLSearchParams): string => {
  let sessionId = searchParams.get("sessionId");
  if (!sessionId) {
    sessionId = uuidv4();
    searchParams.set("sessionId", sessionId);
  }
  return sessionId;
};
