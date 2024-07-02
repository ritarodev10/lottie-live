import { ref, set } from "firebase/database";
import { db } from "../firebaseConfig";

const saveCursorData = async (
  x: number,
  y: number,
  workspaceWidth: number,
  workspaceHeight: number,
  sessionId: string,
  userId: string
) => {
  try {
    const cursorRef = ref(db, `cursors/${sessionId}/${userId}`);
    await set(cursorRef, {
      x,
      y,
      userId,
      workspaceWidth,
      workspaceHeight,
    });
    console.log("Cursor data saved successfully");
  } catch (error) {
    console.error("Error saving cursor data: ", error);
  }
};

export { saveCursorData };
