import React, { useState } from 'react';
import useChat from '../BearModule/UseChat';

const API = 'http://localhost:8080/';

const useSendMessages = () => {
    const [loading, setLoading] = useState(false);
    const { selectedChat } = useChat();
  
    const sendMessage = async (message) => {
        setLoading(true);
        try {
            const res = await fetch(API + "sendMessage", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  chat: selectedChat.remoteJid,
                  payload: message
                }),
            });
            // Handle response if needed
        } catch (error) {
            // Handle error
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading }; // Return an object containing both
};

export default useSendMessages;
