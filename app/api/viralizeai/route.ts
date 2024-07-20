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
    const replicate = ReplicateServices.getInstance(process.env.REPLICATE_API_KEY);

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

    const textResponse = await openai.generateText(messages);
    const generatedContent = textResponse.content;

    console.log(generatedContent, "CONTENT");
    
    if (!generatedContent) {
      return new NextResponse("No content generated", { status: 500 });
    }

    if (generatedContent) {
      console.log("Generated Content:", generatedContent);

      const musicResponse = await replicate.musicgen({
        prompt: `Generate a lively background music for this content: ${generatedContent}`,
        model_version: "stereo-large",
        output_format: "mp3",
        normalization_strategy: "peak",
      });

      console.log("Music Response:", musicResponse);

      const input = `Generate an attractive thumbnail image for the following video content, promoting a product with a special 75% discount. The thumbnail should have a vibrant and eye-catching design to emphasize the discount, making it clear that this is a promotional advertisement. Include the discount prominently within the image.
                Content: ${generatedContent}`

      const imageResponse = await replicate.imagegen(
        input) as ReplicateImageResponse;

      console.log("Image Response:", imageResponse[0]);
      console.log("Image Response:", imageResponse);

      const marker = "**7. Full Script for the video content**";
      const parts = generatedContent.split(marker);
      const scriptContent = parts.length > 1 ? `Hi ${parts[1].trim()}` : "No Script available";

      const text_to_speech = await replicate.textToSpeech({
        prompt: scriptContent,
        text_temp: 0.7,
        output_full: false,
        waveform_temp: 0.7,
        history_prompt: "announcer",
      }) as ReplicateResponse;

      return NextResponse.json({
        content: generatedContent,
        music: musicResponse,
        //music: "https://replicate.delivery/yhqm/unsA71lSRALJBNqeRtm8Bwok1SmlnpHF52sZOD4faB7lURFTA/out.mp3",
        thumbnail: imageResponse[0] as string,
        //thumbnail: 'https://replicate.delivery/yhqm/KRk9uGbzb06NDdWSKkrEYby4IO12SAZM0Uem3rY2tqxKyoiJA/out-0.png',
        script: scriptContent,
        speech: text_to_speech.audio_out,
      });
    } else {
      return new NextResponse("Failed to generate content", { status: 500 });
    }

  } catch (error) {
    console.error("[viralize_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
