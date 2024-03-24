//Messages.jsx

import React, { useEffect, useRef } from "react";
import Message from "./Message"; // Corrected the import path
import useGetMessages from "../../hooks/useGetMessage";
import useRecievedMessages from "../../hooks/useRecievedMessages";

const Messages = () => {
  const { messages, loading } = useGetMessages();
  const messagesEndRef = useRef(null);
  useRecievedMessages();

  useEffect(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
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
        <span className="loading loading-bars loading-ig my-6 mx-auto"></span>
      ) : null}
      {!loading && messages.length === 0 && (
        <p className="py-5 px-10">Send Messages To Start The Conversation</p>
      )}
    </div>
  );
};

export default Messages;
