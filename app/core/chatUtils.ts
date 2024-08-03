import dbConnect from '@/lib/mongoose';
import { ChatHistory } from '@/models/ChatHistory';

async function addChatMessage(chat_type: string, senderId: string, message: string, message_type: string) {
    await dbConnect();

    // Find the chat history document by chat_type
    const chatHistory = await ChatHistory.findOne({ chat_type });

    if (chatHistory) {
        console.log("Chat history found:", chatHistory);
        // Add the new message to the chat history
        chatHistory.messages.push({ sender_id: senderId, message: message, message_type: message_type });
        await chatHistory.save();
    } else {
        // If chat history doesn't exist, create a new one
        const newChatHistory = new ChatHistory({
            chat_type: chat_type,
            participants: ['dummyUser', 'dummyRobot'],
            messages: [{ sender_id: senderId, message: message, message_type: message_type }]
        });
        console.log("New chat history created:", newChatHistory);
        await newChatHistory.save();
    }
}

async function getChatHistory(chat_type: string) {
    await dbConnect();

    const chatHistory = await ChatHistory.findOne({ chat_type });

    return chatHistory;
}

export { addChatMessage, getChatHistory };