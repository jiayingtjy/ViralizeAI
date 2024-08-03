import TikTokService from "@/app/core/tiktokServices";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// https://developers.tiktok.com/doc/tiktok-api-v2-get-user-info/
export async function GET() {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ message: "User not found" });
    }

    try {
        const ttService = new TikTokService(userId);
        const userInfo = ttService.getUserInfo();
        return NextResponse.json(userInfo);
    }
    catch (error) {
        return NextResponse.json({ message: error });
    }
}
