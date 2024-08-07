// Use getAuth for server-side
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import ReplicateServices from "@/app/core/replicateServices";

// Define the POST request handler for the API route
export async function POST(req: Request) {
  try {
    const userId = auth();
    const body = await req.json();
    const { prompt } = body;

    // If there is no user ID, return early
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //if no messages passed in
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const replicate = ReplicateServices.getInstance(
      process.env.REPLICATE_API_KEY
    );
    const response = await replicate.videogen(prompt);

    return NextResponse.json(response);
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.error(error);
    return new NextResponse(`Internal error ${error}`, { status: 500 });
  }
}
