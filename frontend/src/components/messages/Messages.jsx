//Messages.jsx

import React from 'react'
import Message from './Messsage'
import useGetMessages from '../../hooks/useGetMessage'
const Messages = () => {
  const { messages,loading} = useGetMessages();
  // console.log("messages: ",messages);
  return (
    <div className='px-4 flex-1 overflow-auto'>
        {!loading && messages.length>0 && messages.map((message)=>(
          <Message key={message._id} message={message} />
        ))}
        {loading ? <span className='loading loading-bars loading-ig my-6 mx-auto'></span> : null}
        {!loading && messages.length === 0  && (<p className='py-5 px-10'>Send Messages To Start The Conversation</p>)}
    </div>
  )
}

export default Messages