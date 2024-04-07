import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import useGetMessages from "../../hooks/useGetMessage";
import useRecievedMessages from "../../hooks/useRecievedMessages";
import useChat from '../../BearModule/UseChat';

const Messages = () => {
  const { loading, messages, loadMoreMessages } = useGetMessages();
  const [page, setPage] = useState(1);
  const messagesEndRef = useRef(null);
  const { selectedChat } = useChat();
  useRecievedMessages(selectedChat);

  const handleScroll = () => {
    if (messagesEndRef.current) {
      const isAtTop = messagesEndRef.current.getBoundingClientRect().top === 0;
      if (isAtTop) {
        loadMore();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMore = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (page > 1) {
      loadMoreMessages(selectedChat, page);
    }
  }, [page]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); 
  };
  

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
