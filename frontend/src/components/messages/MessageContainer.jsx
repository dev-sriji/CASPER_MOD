//MessageContainer.jsx

import React from 'react'
import Messages from './Messages'
import MessageInput from './MessageInput'
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import useChat from "../../BearModule/UseChat";
const MessageContainer = () => {
  const { selectedChat } = useChat();
  return (
      <div className="min-w-[80%] flex flex-col">
            {!selectedChat ? 
            <div className="flex py-10 items-center justify-center  w-full h-full">
                <div className="px-4 py-10 text-center  sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
<b className='py-5'>WELCOME TO CASPER-WHATSAPP CLONE...</b>
<p className='py-5'>Support Developer : <button className="btn btn-outline btn-accent"><a href='https://github.com/dev-sriji'>GitHub<span className="loading loading-ring loading-xs text-error"></span></a></button> </p>
                <IoChatboxEllipsesOutline className='text-3xl md:text-7xl text-center'/>
                </div>
            </div>
            : <>
            <div tabIndex={0} className="collapse inset-x-5 bg-sky-500 text-primary-content focus:bg-sky-400 focus:text-secondary-content">
  {/* <div className="collapse-title">
    CHAT ID : 
  </div>
  <div className="collapse-content"> 
    <span id='chatid'>chatid</span>
  </div> */}
  <ul class="menu bg-blue-500 lg:menu-horizontal rounded-box">
  <li>
    <a>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
      Inbox
      <span class="badge badge-sm">99+</span>
    </a>
  </li>
  <li>
    <a>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      Updates
      <span class="badge badge-sm badge-warning">NEW</span>
    </a>
  </li>
  <li>
    <a>
      Stats
      <span class="badge badge-xs badge-info"></span>
    </a>
  </li>
</ul>

</div>
{/* <div className="dropdown dropdown-hover w-96">
  <div tabIndex={0} role="button" className="btn m-1">Hover</div>
  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</div> */}
            <Messages />
            <MessageInput/>
            </>}
            
        </div>
  )
}

export default MessageContainer


