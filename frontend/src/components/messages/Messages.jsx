// Messages.jsx
import React, { useEffect, useRef } from "react";
import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessage";
import useRecievedMessages from "../../hooks/useRecievedMessages";
import useChat from '../../BearModule/UseChat';

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const messagesEndRef = useRef(null);
  const { selectedChat } = useChat();
  useRecievedMessages(selectedChat);

  useEffect(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 10);
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages.length > 0 &&
        messages.map((message, index) => (
          <div key={message._id}>
            <Message message={message} />
          </div>
        ))}
      <div ref={messagesEndRef} />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-ball loading-xs text-info"></span>
        <span className="loading loading-ball loading-sm text-success"></span>
        <span className="loading loading-ball loading-md text-warning"></span>
        <span className="loading loading-ball loading-lg text-error"></span>
        </div>
      ) : null}
      {!loading && messages.length === 0 && (
        <p className="py-5 px-10">Send Messages To Start The Conversation</p>
      )}
    </div>
  );
};

export default Messages;