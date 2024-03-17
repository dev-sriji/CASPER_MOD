//Message.jsx
import React from 'react'

const Messsage = ({message}) => {
  if( message?.message?.conversation == null && message?.message?.extendedTextMessage?.text ==null ) return
  const fromMe = message.key?.fromMe;
  const messageClassName = fromMe ? 'chat-end' : 'chat-start';
  const messageText = message?.message?.conversation || message?.message?.extendedTextMessage?.text;
  return (
        <div className={`chat ${messageClassName}`}>
  <div className="chat-image avatar">
    <div className="w-10 rounded-full">
      <img alt="Tailwind CSS chat bubble component" src="https://img.freepik.com/premium-vector/empty-face-icon-avatar-with-black-hair-vector-illustration_601298-13402.jpg?w=826" />
    </div>
  </div>
  <div className="chat-bubble">{messageText}</div>
</div>
  )
}

export default Messsage