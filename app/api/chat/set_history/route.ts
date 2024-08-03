import { addChatMessage } from "@/app/core/chatUtils";
import { NextResponse } from "next/server";

// Define the POST request handler for the API route
export async function POST(req: Request) {
    try {
        // Get the authenticated user ID
        const body = await req.json();

        const { chat_type, senderId, message, message_type } = body;

        if (!chat_type || !senderId || !message || !message_type) {
            return new NextResponse("chat_type, sender ID, message, and message_type are required", { status: 400 });
        }

        await addChatMessage(chat_type, senderId, message, message_type);

        return new NextResponse("Message added successfully", { status: 200 });
    } catch (error) {
        console.log("[CHAT_ERROR]", error);
        return new NextResponse(`Internal error ${error}`, { status: 500 });
    }
}
