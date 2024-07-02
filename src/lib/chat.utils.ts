import { ref, set, get, push } from "firebase/database";
import { ChatMessage } from "../types/chat.type";
import { db } from "../firebaseConfig";

export const addChatMessage = async (
  projectId: string,
  message: ChatMessage
): Promise<void> => {
  const messagesRef = ref(db, `projects/${projectId}/chatMessages`);
  const newMessageRef = push(messagesRef);
  message.messageId = newMessageRef.key || "";
  await set(newMessageRef, message);
};

export const getChatMessages = async (
  projectId: string
): Promise<ChatMessage[]> => {
  const messagesRef = ref(db, `projects/${projectId}/chatMessages`);
  const snapshot = await get(messagesRef);
  const messages: ChatMessage[] = [];
  snapshot.forEach((childSnapshot) => {
    const message = childSnapshot.val();
    messages.push(message);
  });
  return messages;
};
