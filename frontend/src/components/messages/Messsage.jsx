//Message.jsx
import React from 'react'

const Messsage = ({message}) => {
  console.log(message)
  const fromMe = message.fromMe;
  const messageClassName = fromMe ? 'chat-end' : 'chat-start';
  const messageText = message.text;
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