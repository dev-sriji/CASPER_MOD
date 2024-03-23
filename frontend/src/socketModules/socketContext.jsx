//socketContext.jsx   (frontend)

import React, { createContext, useEffect, useState } from "react";
import socketIOClient from 'socket.io-client'; // Change import name
export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const socket = socketIOClient('http://localhost:8080'); // Use the new name
        setSocket(socket);
        return () => socket.close();
    }, []);

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
