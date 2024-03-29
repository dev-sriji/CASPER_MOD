// useReceivedMessages.jsx
import React, { useEffect, useContext } from 'react';
import { SocketContext } from '../socketModules/socketContext';
import useChat from '../BearModule/UseChat';

const useReceivedMessages = (selectedChat) => {
    const { socket } = useContext(SocketContext);
    const { messages, setMessages } = useChat();

    useEffect(() => {
        if (!socket || !selectedChat) return; // Exit early if socket or selectedChat is not available
        const receivedMessageHandler = (m) => {
            if (m.chat === selectedChat.chat || m.chat === 'message.chat') {
                setMessages([...messages, m]);
            }
        };

        socket.on('recievedMessage', receivedMessageHandler);

        return () => {
            socket.off('receivedMessage', receivedMessageHandler);
        };
    }, [socket, setMessages, messages, selectedChat]);
};

export default useReceivedMessages;
