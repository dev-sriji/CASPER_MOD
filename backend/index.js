import express from 'express';
import { useMultiFileAuthState, makeWASocket, DisconnectReason } from "@whiskeysockets/baileys";
import { connectToMongoDB } from './db/connectToMongoDB.js';
import Config from './config.js';
import cors from "cors";
const app  = express();
app.use(express.json())
app.use(cors())
import Message from './models/message-model.js';

const PORT = Config.PORT || 8080;
const WS_PORT = Config.WS_PORT || 8080;

// Function to connect to WhatsApp
async function connectToWhatsApp() {
    await app.listen(PORT,()=>{
        connectToMongoDB();
        console.log("Server Is Running On ",PORT)
    })
    const { state, saveCreds } = await useMultiFileAuthState('SRIJI-SESSIONS')
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    })

    sock.ev.on("connection.update", async (update) => {
        const { qr, connection, lastDisconnect } = update || {};

        if (qr) {
            console.log("QR Code Generated...");
            console.log(qr);
            io.emit('whatsapp.qr', qr); 
        }

        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                connectToWhatsApp(); 
            } else {
                console.log("Connection Closed, You're Now Logged Out");
            }
        }
    });
    
    sock.ev.on('creds.update', saveCreds);
    
    // Listener for 'messages.upsert': { messages: WAMessage[], type: MessageUpsertType }
    sock.ev.on('messages.upsert', ({ messages }) => {
        const msg=messages[0];
        handleMessage(msg);
    });
    
    

    app.post("/sendMessage", (req, res) =>{
        try {
            const chat = req.body.chat || Config.MODS;
            const text = req.body.payload.text || '';
            sock.sendMessage(chat || Config.MODS, { text: text})  
            // console.log(req.body)
            res.status(200).json({ reciever: chat,text: text})
            // res.status(200).json({ data: "everything ok" });
        } catch (error) {
            res.status(500).json({ data: "Something Went Wrong 974" });
        }
    }); 
    


    app.post("/getMessages", async (req, res) => {
        console.log("ok994")
        try {
            const remoteJid = req.body.remoteJid;
            if (!remoteJid) {
                return res.status(400).json({ error: "User parameter is missing" });
            }
            
            const mess = await Message.find({ "key.remoteJid": remoteJid }).limit(20);
            if (!mess || mess.length === 0) {
                return res.status(200).json({});
            }
            // console.log(mess.message)
            res.status(200).json({ message: mess });
        } catch (error) {
            console.error("Error occurred:", error);
            res.status(500).json({ error: "Something Went Wrong" });
        }
    });
    
    app.get("/getUsers", async (req, res) => {
        try {
            const distinctUsers = await Message.aggregate([
                {
                    $group: {
                        _id: "$key.remoteJid",
                        pushNames: { $addToSet: "$pushName" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        remoteJid: "$_id",
                        pushNames: { $arrayElemAt: ["$pushNames", 0] }
                    }
                }
            ]);
            
            res.status(200).json({ distinctUsers });
            
            
        } catch (error) {
            console.error("Error occurred:", error);
            res.status(500).json({ error: "Something Went Wrong" });
        }
    });

    
    async function handleMessage(m){
        console.log(m)
        const isGroup =  m?.key?.remoteJid?.endsWith("@g.us") ? true : false;
        if(isGroup) return
        await saveMessage(m)
    }
    const saveMessage = async (messageData) => {
        try {
            const message = new Message(messageData);
            await message.save();
            console.log("Message saved successfully.");
        } catch (error) {
            console.log("Error saving message to database:", error);
        }
    };
}

// Connect to WhatsApp when the server starts
connectToWhatsApp();

