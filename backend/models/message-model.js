import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  key: {
    remoteJid: String,
    fromMe: Boolean,
    id: String,
    participant: String
  },
  messageTimestamp: Number,
  pushName: String,
  broadcast: Boolean,
  message: {
    conversation: String,
    messageContextInfo: {
      deviceListMetadata: [{
        
      }],
      deviceListMetadataVersion: Number
    }
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;
