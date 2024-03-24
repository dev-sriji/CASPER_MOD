// socket.js

import { Server } from "socket.io";
import http from 'http';
import express from 'express'
import Config from "../config.js";
import cors from "cors";
import * as colors from "colors";

const PORT = Config.PORT || 8080;
const app = express();
const server = http.createServer(app); 

app.use(cors()); // Apply CORS middleware here

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], // Update this with your frontend URL
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log("New Socket Created".red, JSON.stringify(socket.id, null, 2).italic.yellow)
    
    socket.on("disconnect", () => {
        // Handle disconnect
    });
});

export { app, io, server };
