import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    sender_id: string;
    message: string;
    message_type: string;
    timestamp: Date;
}

export interface IChatHistory extends Document {
    chat_type: string;
    participants: string[];
    messages: IMessage[];
}

const MessageSchema: Schema = new Schema({
    sender_id: { type: String, required: true },
    message: { type: String, required: true },
    message_type: { type: String, required: true, default: 'text' },
    timestamp: { type: Date, required: true, default: Date.now }
});

const ChatHistorySchema: Schema = new Schema({
    chat_type: { type: String, required: true },
    participants: { type: [String], required: true },
    messages: { type: [MessageSchema], required: true }
});

export const ChatHistory = mongoose.models.ChatHistory || mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);
