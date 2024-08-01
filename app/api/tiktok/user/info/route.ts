import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// https://developers.tiktok.com/doc/tiktok-api-v2-get-user-info/
export async function GET() {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ message: "User not found" });
    }

    // Get the OAuth access token for the user
    const provider = "oauth_tiktok";

    const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
        userId,
        provider
    );

    const accessToken = clerkResponse.data[0].token;
    const ttUserInfoBaseUrl = `https://open.tiktokapis.com/v2/user/info/`;

    const userObjectFields = [
        "open_id", "union_id", "avatar_url", "avatar_url_100",
        "display_name", "bio_description", "profile_deep_link",
        "username", "follower_count", "following_count",
        "likes_count", "video_count", "is_verified"
    ].toString();

    const tiktokResponse = await fetch(`${ttUserInfoBaseUrl}?fields=${userObjectFields}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
    });

    if (!tiktokResponse.ok) {
        return NextResponse.json({ message: "Failed to fetch data from TikTok API" });
    }

    const tiktokData = await tiktokResponse.json();

    return NextResponse.json(tiktokData);
}
