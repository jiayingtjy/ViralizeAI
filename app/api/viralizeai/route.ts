import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import Replicate from "replicate";

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const userId = auth();
    const body = await req.json();
    const { messages } = body;

    interface ReplicateResponse {
      audio_out: string;
    }


    console.log(messages);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key is not configured", { status: 500 });
    }
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });
    const generatedContent = response.choices[0].message?.content;
    console.log(generatedContent, "CONTENT");
    if (!generatedContent) {
      return new NextResponse("No content generated", { status: 500 });
    }

    if (generatedContent) {
      console.log("Generated Content:", generatedContent);

      
      const musicResponse = await replicate.run("meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb", {
        input: {
          prompt: `Generate a lively background music for this content: ${generatedContent}`,
          model_version: "stereo-large",
          output_format: "mp3",
          normalization_strategy: "peak",
        },
      });
      console.log("Music Response:", musicResponse);
      
      const input = {
        prompt: `Generate an attractive thumbnail image for the following video content, promoting a product with a special 75% discount. The thumbnail should have a vibrant and eye-catching design to emphasize the discount, making it clear that this is a promotional advertisement. Include the discount prominently within the image.
                Content: ${generatedContent}`,
      };
      const imageResponse = await replicate.run(
        "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f", 
        { input })
      console.log("Image Response:", imageResponse);

      const marker = "**7. Full Script for the video content**";
      const parts = generatedContent.split(marker);
      const scriptContent = parts.length > 1 ? `Hi ${parts[1].trim()}` : "No Script available";
      console.log(scriptContent);

      const text_to_speech = await replicate.run("suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787", {
        input: {
          prompt: scriptContent,
          text_temp: 0.7,
          output_full: false,
          waveform_temp: 0.7,
          history_prompt: "announcer",
        },
      }) as ReplicateResponse;

      console.log("Text to Speech:", text_to_speech.audio_out);

      return NextResponse.json({
        content: generatedContent,
        music:musicResponse,
        //music: "https://replicate.delivery/yhqm/unsA71lSRALJBNqeRtm8Bwok1SmlnpHF52sZOD4faB7lURFTA/out.mp3",
        thumbnail: imageResponse[0],
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
