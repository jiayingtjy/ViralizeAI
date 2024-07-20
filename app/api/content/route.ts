// Use getAuth for server-side
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAIService from '@/app/core/openAIService';
import { MAX_TOKENS } from "./constants";

// Define the POST request handler for the API route
export async function POST(req: Request) {
  try {
    // Get the user ID from authentication
    const userId = auth();
    // Parse the request body to get the messages
    const body = await req.json();
    const { messages } = body;

    // If there is no user ID, return early
    if (!userId) {
      console.log("no userid?")
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    //if no messages passed in 
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    // Create an instance of the OpenAIService
    const oAIService = OpenAIService.getInstance(process.env.OPENAI_API_KEY);
    const generatedText = await oAIService.generateText(messages, MAX_TOKENS);
    return NextResponse.json(generatedText);

  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse(`Internal error ${error}`, { status: 500 });
  }
}
