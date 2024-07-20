// Use getAuth for server-side
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAIService from '../../core/openAIService';

// Define the POST request handler for the API route
export async function POST(req: Request) {
  try {
    // Get the user ID from authentication
    const userId = auth();
    // Parse the request body to get the messages
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    // If there is no user ID, return early
    if (!userId) {
      console.log("no userid?")
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //if no messages passed in 
    if (!prompt) {
      console.log("no msg?")
      return new NextResponse("Prompt is  required", { status: 400 });
    }

    if (!amount) {
      console.log("no msg?")
      return new NextResponse("Amount is  required", { status: 400 });
    }

    if (!resolution) {
      console.log("no msg?")
      return new NextResponse("Resolution is  required", { status: 400 });
    }
    
    const oAIService = OpenAIService.getInstance(process.env.OPENAI_API_KEY);
    const generatedText = await oAIService.generateImage(prompt, amount, resolution);
    return NextResponse.json(generatedText);

  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
