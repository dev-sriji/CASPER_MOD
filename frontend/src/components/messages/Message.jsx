//Messsage.jsx
import React from "react";
import { extractTime } from "../../BearModule/extractTime";

const Messsage = ({ message }) => {
  const fromMe = message.fromMe;
  const messageClassName = fromMe ? "chat-end" : "chat-start";
  const messageType = message.definedType;
  const base64 = message.base64;
  const messageText = message.text; //thisone
  const bubbleColour = fromMe ? "bg-blue-800" : "";
  const formattedTimeStamp = extractTime(message.createdAt) || "Just Now";

  return (
    <div className={`chat ${messageClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src="https://img.freepik.com/premium-vector/empty-face-icon-avatar-with-black-hair-vector-illustration_601298-13402.jpg?w=826"
          />
        </div>
      </div>
      <div className={`chat-bubble ${bubbleColour} ${messageType === "textMessage" ? (fromMe ? "text-blue-800" : "text-white") : "bg-gray-200"}`}>
        {messageType === "textMessage" ? (
          <b>{messageText}</b>
        ) : (
      
          <div tabIndex={0} className="collapse bg-primary text-primary-content focus:bg-secondary focus:text-secondary-content">
            <div className="collapse-title">
              New image received
            </div>
            <div className="collapse-content"> 
              <img style={{ margin: 0, padding: 0 }} src={`data:image/jpeg;base64,${base64}`} alt="Image" />
            </div>
          </div>
        )}
      </div>
      <div className="lg:tooltip px-5" data-tip={message.createdAt}>
        <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
          {formattedTimeStamp === `NaN : NaN`
            ? "A Few Seconds Ago"
            : formattedTimeStamp}
        </div>
      </div>
    </div>
  );
};

export default Messsage;
