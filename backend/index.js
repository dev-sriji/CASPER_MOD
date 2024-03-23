import express from "express";
import {
  useMultiFileAuthState,
  makeWASocket,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import { connectToMongoDB } from "./db/connectToMongoDB.js";
import Config from "./config.js";
import cors from "cors";
import {app, io, server} from './socketio/socket.js'
app.use(express.json());
app.use(cors());
import Message from "./models/message-model.js";

const PORT = Config.PORT || 8080;

// Function to connect to WhatsApp
async function connectToWhatsApp() {
  await server.listen(PORT, () => {
    connectToMongoDB();
    console.log("Server Is Running On ", PORT);
  });
  const { state, saveCreds } = await useMultiFileAuthState("SRIJI-SESSIONS");
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("connection.update", async (update) => {
    const { qr, connection, lastDisconnect } = update || {};

    if (qr) {
      console.log("QR Code Generated...");
      console.log(qr);
      // io.emit("whatsapp.qr", qr);
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;
      if (shouldReconnect) {
        connectToWhatsApp();
      } else {
        console.log("Connection Closed, You're Now Logged Out");
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  // Listener for 'messages.upsert': { messages: WAMessage[], type: MessageUpsertType }
  sock.ev.on("messages.upsert", ({ messages }) => {

    const m = {
        name: messages[0]?.pushName?.replace(/\n/g, "")?.trim() || "",
        chat: messages[0]?.key?.remoteJid || "",
        sender: messages[0]?.key?.remoteJid?.endsWith("@s.whatsapp.net")
        ? messages[0]?.key?.remoteJid
        : messages[0]?.key?.participant,
        isGroup: messages[0]?.key?.remoteJid?.endsWith("@g.us") ? true : false,
        isDm: messages[0]?.key?.remoteJid?.endsWith("@s.whatsapp.net")
        ? true
        : false,
        text:
        messages[0]?.message?.conversation ||
        messages[0]?.message?.extendedTextMessage?.text,
        key: messages[0]?.key?.id || "",
        fromMe: messages[0]?.key?.fromMe,
        quoted: {
            log:
            messages[0].message?.extendedTextMessage?.contextInfo ||
            messages[0].message?.extendedTextMessage?.contextInfo,
            text:
            messages[0].message?.extendedTextMessage?.contextInfo?.quotedMessage
            ?.conversation ||
            messages[0].message?.extendedTextMessage?.contextInfo?.text ||
            "",
            sender:
            messages[0].message?.extendedTextMessage?.contextInfo?.participant ||
            "",
            tagged:
            messages[0].message?.extendedTextMessage?.contextInfo?.mentionedJid ||
            "",
        },
        replyingTo: messages[0]?.key?.remoteJid?.endsWith("@s.whatsapp.net")
        ? messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.conversation ||
        messages[0].message?.extendedTextMessage?.contextInfo?.text ||
        global?.db?.data?.users[messages[0]?.key?.remoteJid]?.lastReply ||
        ""
        : messages[0]?.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.conversation ||
        messages[0].message?.extendedTextMessage?.contextInfo?.text ||
        false,
        itself: messages[0],
    };
    // console.log(m);
    handleMessage(m);
});



app.post("/sendMessage", (req, res) => {
    try {
        const chat = req.body.chat || Config.MODS;
        const text = req.body.payload.text || "";
        sock.sendMessage(chat || Config.MODS, { text: text });
      // console.log(req.body)
      res.status(200).json({ reciever: chat, text: text });
      // res.status(200).json({ data: "everything ok" });
    } catch (error) {
      res.status(500).json({ data: "Something Went Wrong 974" });
    }
  });

  app.post("/getMessages", async (req, res) => {
    try {
      const requestedChat = req.body.chat;
      if (!requestedChat) {
        return res.status(400).json({ error: "chat parameter is missing" });
      }

      const mess = await Message.find({ chat: requestedChat })
        .sort({ updatedAt: 1 });

      if (!mess || mess.length === 0) {
        return res.status(200).json({});
      }

      res.status(200).json({ message: mess });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: "Something Went Wrong" });
    }
  });

  app.get("/getUsers", async (req, res) => {
    try {
      const distinctUsers = await Message.aggregate([
        // Sort by the most recently modified message
        { $sort: { updatedAt: -1 } },

        // Group by chat
        {
          $group: {
            _id: "$chat",
            name: { $first: "$name" }, 
            chat: { $first: "$chat" }, 
            isGroup: { $first: "$isGroup" }, 
            updatedAt: {$first: "$updatedAt"},
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            chat: 1,
            isGroup: 1,
            updatedAt:1,
          },
        },
      ]);
      res.status(200).json({ distinctUsers });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: "Something Went Wrong" });
    }
  });

  async function handleMessage(m) {
    // console.log(m)
    if (m.isGroup) return;
    if(m.text === undefined) return console.log(m.itself);
    await saveMessage(m);
    io.emit('recievedMessage',m)
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
