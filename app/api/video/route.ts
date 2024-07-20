// Use getAuth for server-side
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";


const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!
})

// Define the POST request handler for the API route
export async function POST(req: Request) {
  try {
    const userId = auth();
    const body = await req.json();
    const { prompt } = body;

    // If there is no user ID, return early
    if (!userId) {
      console.log("no userid?")
      return new NextResponse("Unauthorized", { status: 401 });
    }


    //if no messages passed in 
    if (!prompt) {
      console.log("no prompt?")
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const output = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt: prompt
        }
      }
    );
    console.log(output);

    //=> "https://replicate.delivery/pbxt/OeLYIQiltdzMaCex1shlEFy6...

    return NextResponse.json(output);

  } catch (error) {
    // Log the error and return a 500 Internal Server Error response

    console.log("[MUSIC_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
