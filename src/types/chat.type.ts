import { LottieAnimationData } from "./lottie.type";

export type ChatMessage = {
  messageId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
};

export type Project = {
  projectId: string;
  jsonContent: LottieAnimationData;
  registeredUsers: { userId: string; userName: string }[];
  chatMessages?: ChatMessage[];
};
