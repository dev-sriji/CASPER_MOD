//useRecievedMessages.jsx
import React, { useEffect, useContext } from 'react';
import { SocketContext } from '../socketModules/socketContext';
import useChat from '../BearModule/UseChat';

const useReceivedMessages = () => {
    const { socket } = useContext(SocketContext); // Using useContext to access context
    const { messages, setMessages } = useChat();
    
    useEffect(() => {
        if (!socket) return; // Exit early if socket is not available
        const receivedMessageHandler = (m) => {
            setMessages([...messages, m]); // Corrected the way messages are updated
        };

        socket.on('recievedMessage', receivedMessageHandler);

        return () => {
            socket.off('receivedMessage', receivedMessageHandler); // Unsubscribe when component unmounts
        };
    }, [socket, setMessages, messages]);
};

export default useReceivedMessages;
