// Message.jsx
import React from "react";
import { extractTime } from "../../BearModule/extractTime";

const MAX_WIDTH = "max-w-sm"; // Define maximum width
const MAX_HEIGHT = "max-h-xs"; // Define maximum height

const Message = ({ message }) => {
  const fromMe = message.fromMe;
  const messageClassName = fromMe ? "chat-end" : "chat-start";
  const messageType2 = message.definedType;
  const base64 = message.base64;
  const messageText = message.text;
  const bubbleColour = fromMe ? "bg-blue-800" : "";
  const formattedTimeStamp = extractTime(message.createdAt) || "Just Now";
  const voType = message.voType;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `data:image/jpeg;base64,${base64}`;
    link.download = "image.jpg";
    link.click();
  };

  const renderMessageContent = () => {
    switch (messageType2) {
      case "textMessage":
        return (
          <div className={`chat-bubble ${bubbleColour} ${fromMe ? "text-white" : "text-white"}`}>
            <b>{messageText}</b>
          </div>
        );
      case "imageMessage":
        return (
          <div className="chat-bubble bg-gray-200">
            <img
              className={`w-full ${MAX_WIDTH} ${MAX_HEIGHT}`}
              src={`data:image/jpeg;base64,${base64}`}
              alt="Image"
            />
            {messageText && (
              <div className="text-xs text-gray-600 mt-1">
                <b className="text-black">{messageText}</b>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
              <button onClick={handleDownload} className="text-white font-bold py-2 px-4 rounded-lg border bg-blue-500 hover:bg-blue-700">Download <span className="loading loading-ball loading-xs"></span></button>
            </div>
          </div>
        );
      case "videoMessage":
        return (
          <div className="chat-bubble bg-gray-200">
            <video controls className={`w-full ${MAX_WIDTH} ${MAX_HEIGHT}`}>
              <source src={`data:video/mp4;base64,${base64}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {messageText && (
              <div className="text-xs text-gray-600 mt-1">
                <b>{messageText}</b>
              </div>
            )}
          </div>
        );
      case "audioMessage":
        return (
          <div className="chat-bubble bg-gray-200">
             <button onClick={handleDownload} className="badge badge-error gap-2">Click Here To Download <span className="loading loading-ball loading-xs"></span></button>
            <audio controls className="w-full">
              <source src={`data:audio/mpeg;base64,${base64}`} type="audio/mpeg" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      case "viewOnceMessageV2":
      case "viewOnceMessage":
        const isImage = voType.startsWith("image/");
        const isVideo = voType.startsWith("video/");
        const isAudio = voType.startsWith("audio/");
  
        return (
          <div className="chat-bubble bg-gray-200">
            <div className="badge badge-warning">
              ViewOnce Message
              <span className="loading loading-ring loading-lg text-error"></span>
            </div>
            {isImage && (
              <div>
                <img
                  className={`w-full ${MAX_WIDTH} ${MAX_HEIGHT} py-4`}
                  src={`data:image/jpeg;base64,${base64}`}
                  alt="View Once Image"
                />
                <button onClick={handleDownload} className="text-white font-bold py-2 px-4 rounded-lg border bg-blue-500 hover:bg-blue-700">Download <span className="loading loading-ball loading-xs"></span></button>
              </div>
            )}
            {isVideo && (
              <div>
                <video controls className={`w-full ${MAX_WIDTH} ${MAX_HEIGHT} py-4`}>
                  <source src={`data:video/mp4;base64,${base64}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <button onClick={handleDownload} className="text-white font-bold py-2 px-4 rounded-lg border bg-blue-500 hover:bg-blue-700">Download <span className="loading loading-ball loading-xs"></span></button>
              </div>
            )}
            {isAudio && (
              <div>
                <button onClick={handleDownload} className="badge badge-error gap-2">Click Here To Download <span className="loading loading-ball loading-xs"></span></button>
                <audio controls className="w-full py-4">
                  <source src={`data:audio/mpeg;base64,${base64}`} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`chat ${messageClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Avatar"
            src="https://img.freepik.com/premium-vector/empty-face-icon-avatar-with-black-hair-vector-illustration_601298-13402.jpg?w=826"
          />
        </div>
      </div>
      {renderMessageContent()}
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

export default Message;
