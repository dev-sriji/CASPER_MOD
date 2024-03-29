// socket.js

import { Server } from "socket.io";
import http from 'http';
import express from 'express'
import Config from "../config.js";
import * as colors from "colors";
import cors from "cors";

const PORT = Config.PORT || 8080;
const app = express();
const server = http.createServer(app); // Create HTTP server using Express app

app.use(cors()); // Apply CORS middleware here

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:8080"], // Update this with your frontend URL
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log("Socket Established On", socket.id)
    console.log(`Server Is Running On `, `http://localhost:${PORT}`.red.bold.italic)
    socket.on("disconnect", () => {
        // Handle disconnect
    });
});

export { app, io, server };
