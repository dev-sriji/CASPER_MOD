import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    itself: Object,
    name: String,
    chat: String,
    sender: String,
    isGroup: Boolean,
    isDm: Boolean,
    text: String,
    key: String,
    fromMe: Boolean,
    quoted: {
        log: Object,
        text: String,
        sender: String,
        tagged: [String]
    },
    replyingTo: String
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message