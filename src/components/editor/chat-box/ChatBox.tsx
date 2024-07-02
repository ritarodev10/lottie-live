import React, { useState, useEffect, useRef } from "react";
import { addChatMessage, getChatMessages } from "../../../lib/chat.utils";
import { ChatMessage } from "../../../types/chat.type";
import { db } from "../../../firebaseConfig";
import { ref, onChildAdded, off } from "firebase/database";

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userColors, setUserColors] = useState<{ [key: string]: string }>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchedUserId = sessionStorage.getItem("userId");
    const fetchedUserName = sessionStorage.getItem("userName");
    const searchParams = new URLSearchParams(window.location.search);
    const projectId = searchParams.get("projectId");

    setUserId(fetchedUserId);
    setUserName(fetchedUserName);

    if (projectId) {
      const fetchMessages = async () => {
        const chatMessages = await getChatMessages(projectId);
        setMessages(chatMessages);
        assignColors(chatMessages);
      };
      fetchMessages();

      const messagesRef = ref(db, `projects/${projectId}/chatMessages`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleNewMessage = (snapshot: any) => {
        const newMessage = snapshot.val();
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      onChildAdded(messagesRef, handleNewMessage);

      return () => {
        off(messagesRef, "child_added", handleNewMessage);
      };
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const assignColors = (messages: ChatMessage[]) => {
    const colors = ["#FFC0CB", "#ADD8E6", "#90EE90", "#FFD700", "#FFA07A"];
    const usedColors: { [key: string]: string } = {};

    messages.forEach((msg) => {
      if (msg.senderId !== userId && !usedColors[msg.senderId]) {
        usedColors[msg.senderId] =
          colors[Object.keys(usedColors).length % colors.length];
      }
    });

    setUserColors(usedColors);
  };

  const handleSendMessage = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const projectId = searchParams.get("projectId");

    if (newMessage.trim() === "" || !userId || !userName || !projectId) return;

    const message: ChatMessage = {
      messageId: "",
      senderId: userId,
      senderName: userName,
      content: newMessage,
      timestamp: Date.now(),
    };

    await addChatMessage(projectId, message);
    setNewMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-64 absolute right-0 bg-white h-full">
      <div className="w-full h-full flex flex-col px-2">
        <div className="py-3 text-center font-semibold border-b">Chat Box</div>
        <div className="flex-1 flex flex-col overflow-y-auto mb-2 w-full">
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto mb-2 w-full">
            {messages.map((msg) => (
              <div
                key={msg.messageId}
                className={`flex flex-col px-2 py-2 text-sm w-fit max-w-full mt-2 break-words ${
                  msg.senderId === userId
                    ? "bg-[#3FE1E4] text-white self-end"
                    : "bg-gray-100 text-black self-start"
                }`}
                style={{
                  color:
                    msg.senderId !== userId
                      ? userColors[msg.senderId]
                      : undefined,
                  borderRadius:
                    msg.senderId === userId
                      ? "16px 0px 16px 16px"
                      : "0px 16px 16px 16px",
                }}
              >
                <span className="font-medium">@{msg.senderName}</span>
                <span
                  className={`${
                    msg.senderId !== userId ? "text-gray-400" : "text-white"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="w-full px-2 py-1 border-2 rounded-lg"
            style={{ height: "80px" }}
          />
          <button
            onClick={handleSendMessage}
            className="mt-2 px-2 py-1 bg-[#3FE1E4] text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
