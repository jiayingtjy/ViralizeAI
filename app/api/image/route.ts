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
    const { prompt, amount = 1, resolution = "512x512" } = body;

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
    if(!prompt){
        console.log("no msg?")
        return new NextResponse("Prompt is  required", {status: 400});
    }

    if(!amount){
      console.log("no msg?")
      return new NextResponse("Amount is  required", {status: 400});
    }

    if(!resolution){
      console.log("no msg?")
      return new NextResponse("Resolution is  required", {status: 400});
    }  

  
    // Logic for processing the messages and interacting with OpenAI can go here
    const response = await openai.images.generate({
        prompt:prompt,
        size:resolution,
        n: parseInt(amount,10),
    });

    return NextResponse.json(response.data);

  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
