// Use getAuth for server-side
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAIService from "@/app/core/openAIService";

// Define the POST request handler for the API route
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const oAIService = OpenAIService.getInstance(process.env.OPENAI_API_KEY);
    const response = await oAIService.generateTextStream(messages);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          controller.enqueue(
            encoder.encode(chunk.choices[0]?.delta?.content || "")
          );
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
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse(`Internal error ${error}`, { status: 500 });
  }
}
