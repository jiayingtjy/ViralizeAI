import { addChatMessage, getChatHistory } from "@/app/core/chatUtils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // from the url, get the last part of the path
    
    const body = await req.json();

    const { chat_type } = body;
    
    if (!chat_type) {
        return new NextResponse("chat_type is required", { status: 400 });
    }

    const chat_history = await getChatHistory(chat_type);
    
    // return chat_history in json
    return NextResponse.json(chat_history);
}