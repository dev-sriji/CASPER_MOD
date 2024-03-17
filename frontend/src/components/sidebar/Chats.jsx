//Chats.jsx

import React from "react";
import Chat from "./Chat";
import useGetChats from "../../hooks/useGetChats";

const Chats = () => {
  const { loading, chats } = useGetChats();
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map((chat) => (
        <Chat key={chat.chat} chat={chat} name={chat.name || chat.chat} />
      ))}

      {loading ? (
        <span className="loading loading-bars loading-ig my-6 mx-auto"></span>
      ) : null}
    </div>
  );
};

export default Chats;
