// Use getAuth for server-side
import { NextResponse } from "next/server";
import OpenAIService from "@/app/core/openAIService";

// Define the POST request handler for the API route
export async function POST(req: Request) {
  try {
    // Get the authenticated user ID
    const body = await req.json();
    const { messages } = body;

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const oAIService = OpenAIService.getInstance(process.env.OPENAI_API_KEY);
    const response = await oAIService.generateTextStream(messages);
    const encoder = new TextEncoder();
    let responseText = "";
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          responseText += content; // Collect data from the stream
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(`Internal error ${error}`, { status: 500 });
  }
}
