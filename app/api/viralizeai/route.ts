import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAIService from "@/app/core/openAIService";
import ReplicateServices from "@/app/core/replicateServices";

export async function POST(req: Request) {
  try {
    const userId = auth();
    const body = await req.json();
    const { messages } = body;
    const openai = OpenAIService.getInstance(process.env.OPENAI_API_KEY);
    const replicate = ReplicateServices.getInstance(
      process.env.REPLICATE_API_KEY
    );

    interface ReplicateResponse {
      audio_out: string;
    }

    type ReplicateImageResponse = string[];

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const textStream = await openai.generateTextStream(messages);
    const encoder = new TextEncoder();
    var generatedContent = "";
    const stream = new ReadableStream({
      async start(controller) {
        // Push initial text stream
        for await (const chunk of textStream) {
          const text = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(
            encoder.encode(text)
          );
          generatedContent += text;
        }
        
        if (!generatedContent) {
          controller.close();
          return;
        }

        controller.enqueue(encoder.encode(`data: ${generatedContent}\n\n`));

        const musicResponse = await replicate.musicgen({
          prompt: `Generate a lively background music for this content: ${generatedContent}`,
          model_version: "stereo-large",
          output_format: "mp3",
          normalization_strategy: "peak",
        });

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(musicResponse)}\n\n`)
        );

        const input = `Generate an attractive thumbnail image for the following video content, promoting a product with a special 75% discount. The thumbnail should have a vibrant and eye-catching design to emphasize the discount, making it clear that this is a promotional advertisement. Include the discount prominently within the image.
                Content: ${generatedContent}`;

        const imageResponse = (await replicate.imagegen(
          input
        )) as ReplicateImageResponse;

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(imageResponse[0])}\n\n`)
        );

        const marker = "**7. Full Script for the video content**";
        const parts = generatedContent.split(marker);
        const scriptContent =
          parts.length > 1 ? `Hi ${parts[1].trim()}` : "No Script available";

        const textToSpeech = (await replicate.textToSpeech({
          prompt: scriptContent,
          text_temp: 0.7,
          output_full: false,
          waveform_temp: 0.7,
          history_prompt: "announcer",
        })) as ReplicateResponse;

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(textToSpeech.audio_out)}\n\n`)
        );
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
    console.error("[viralize_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
