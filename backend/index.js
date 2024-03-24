//index.js

import express from "express";
import * as colors from 'colors'
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
await server.listen(PORT, () => {
  connectToMongoDB();
  console.log("Server Is Running On ", PORT);
});

// Function to connect to WhatsApp
async function connectToWhatsApp() {
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
        definedType: (messages[0]?.message?.conversation ||
          messages[0]?.message?.extendedTextMessage?.text) ? 'textMessage' : messages[0]?.message?.stickerMessage ? 'stickerMessage' : messages[0]?.message?.imageMessage ? 'imageMessage' : messages[0]?.message?.videoMessage ? 'videoMessage' : messages[0]?.message?.audioMessage ? 'audioMessage' : messages[0]?.message?.editedMessage ? 'editedMessage' : messages[0]?.message?.viewOnceMessage ? 'viewOnceMessage' : messages[0]?.message?.viewOnceMessageV2 ? 'viewOnceMessageV2' : undefined,
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
    if(m.definedType === undefined) return console.log('UNDEFINED Message Type Found... LOGGING MESSAGE OBJ :\n'.underline.red, JSON.stringify(m.itself, null, 2).italic.yellow);
    const separator = "--------------------------------------------------------";
    const arrow = "➜";
    const replyEmoji = "💬";
    const senderEmoji = "👤";
    const groupEmoji = "👥";
    
    // Log a text message with enhanced design
    console.log(separator);
    console.log(
      `📩 A text message received from ${senderEmoji} ${m.sender?.green} in chat ${m.chat?.green} 📩\n`.bold
      );
      console.log("Name:".magenta, m.name?.red.bold);
      console.log("Chat:".magenta, m.chat?.yellow);
      console.log("Sender:".magenta, `${senderEmoji} ${m.sender?.yellow.italic}`);
      console.log(
        "Is Group:".magenta,
        `${m.isGroup ? `${groupEmoji} Yes` : "No"}`.yellow
        );
        console.log("Is DM:".magenta, `${m.isDm ? "Yes" : "No"}`.yellow);
        console.log("Message Type:".magenta, m.definedType?.yellow);
        console.log("Text:".magenta, m.text?.cyan.bold || 'undefined'.red);
        console.log("Key:".magenta, m.key?.yellow);
        console.log("From Me:".magenta, `${m.fromMe ? "Yes" : "No"}`.yellow);
        console.log("Quoted :".magenta, m.quoted ? "true".green : "false".red);
        console.log(
          m.quoted ? 
          `Quoted Sender: ${senderEmoji} ${m.quoted.sender}`.magenta.yellow : ''
          );

          console.log("Tagged:".magenta, m.quoted?.tagged);
          
          // Design for Replying To section
          if (m.replyingTo) {
            console.log(`\t╰┈➤ ${replyEmoji} Replying To:`.bgYellow.black);
            console.log(`\t${arrow} ❝ ${m.replyingTo?.cyan}❞`);
          }
          
          console.log(separator);
          await saveMessage(m);         
          io.emit('recievedMessage',m)
        }
        const saveMessage = async (messageData) => {
          try {
            const message = new Message(messageData);
            await message.save();
            console.log("Message saved successfully :)".blue.italic.bold);
          } catch (error) {
            console.log("Error saving message to database:", error);
          }
        };
      }
      
      // Connect to WhatsApp when the server starts
      connectToWhatsApp();
      