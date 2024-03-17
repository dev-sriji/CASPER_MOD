//MessageInput.jsx

import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessages from "../../hooks/useSendMessages";
const MessageInput = () => {
  const {loading,sendMessage } =useSendMessages()
  const  [message,setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const m = {
      "text"  : message,
    }
    if(!m.text) return;
    await sendMessage(m);
    // console.log(message)
    setMessage("")
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg w-full p-2.5 bg-gray-700 border-gray-600 text-white"
          placeholder="Type Your Text Here.."
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
        />
        <button className=" absolute end-0 inset-y-0 flex items-center pe-3">
         {loading ? <div className="loading loading-ring loading-md"></div> : <BsSend />}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
