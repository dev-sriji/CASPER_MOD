//Chat.jsx

import React from "react";
import useChat from "../../BearModule/UseChat";

const Chat = ({chat,name}) => {
  const { selectedChat, setSelectedChat } = useChat();

  const isSelected = selectedChat?.chat === chat.chat;

  return (
    <div>
      <div className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py1 cursor-pointer
      ${isSelected ? "bg-sky-500 text-black": ''}`}
      onClick={()=>setSelectedChat(chat)}>
        
        <div className="avatar online">
          <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359554_640.png"
              alt="user avatar"
            />
          </div>
        </div>
        <b>
          {chat.chat}
        </b>
      </div>
      <div className="devider my-0 py-0 h-1" />
    </div>
  );
};

export default Chat;
