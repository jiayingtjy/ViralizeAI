 // Use getAuth for server-side
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Configure the OpenAI API with the API key from environment variables
const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
  });
  
console.log(openai,"OPENAI OBJ")
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
        return new NextResponse("Unauthorized", {status:401});
    }

    //if no api key 
    if(!openai.apiKey){
        console.log("no key?")
        return new NextResponse("OpenAI API Key is not configured", {status: 500});
    }

    

    //if no messages passed in 
    if(!messages){
        console.log("no msg?")
        return new NextResponse("Messages are required", {status: 400});
    }

    // Logic for processing the messages and interacting with OpenAI can go here
    const response = await openai.chat.completions.create({
        model:"gpt-3.5-turbo",
        messages
    });

    return NextResponse.json(response.choices[0].message);

  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.log("Final error")
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
