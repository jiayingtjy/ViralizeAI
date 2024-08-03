import TikTokService from "@/app/core/tiktokServices";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Persona } from '@/models/Persona';
import dbConnect from '@/lib/mongoose';

// https://developers.tiktok.com/doc/tiktok-api-v2-get-user-info/
export async function GET(request: Request) {
    const { userId } = auth();
    const { searchParams } = new URL(request.url);

    const updateUserInfo = searchParams.get('updateUserInfo') === 'true';

    if (!userId) {
        return NextResponse.json({ message: "User not found" });
    }

    try {
        // Connect to MongoDB
        await dbConnect();
        // Check if the user already exists in MongoDB
        let userPersona = await Persona.findOne({ user_id: userId });

        // If refresh is true or the user does not exist, fetch from TikTok API and update MongoDB
        if (updateUserInfo || !userPersona) {
            const ttService = new TikTokService(userId);
            const userInfo = await ttService.getUserInfo();
            
            if (!userPersona) {
                // Create a new document if it doesn't exist
                userPersona = new Persona({
                    user_id: userId,
                    open_id: userInfo.open_id,
                    union_id: userInfo.union_id,
                    avatar_url: userInfo.avatar_url,
                    avatar_url_100: userInfo.avatar_url_100,
                    display_name: userInfo.display_name,
                    bio_description: userInfo.bio_description,
                    profile_deep_link: userInfo.profile_deep_link,
                    username: userInfo.username,
                    follower_count: userInfo.follower_count,
                    following_count: userInfo.following_count,
                    likes_count: userInfo.likes_count,
                    video_count: userInfo.video_count,
                    is_verified: userInfo.is_verified,
                    tags: [],
                });
            } else {
                userPersona.open_id = userInfo.open_id;
                userPersona.union_id = userInfo.union_id;
                userPersona.avatar_url = userInfo.avatar_url;
                userPersona.avatar_url_100 = userInfo.avatar_url_100;
                userPersona.display_name = userInfo.display_name;
                userPersona.bio_description = userInfo.bio_description;
                userPersona.profile_deep_link = userInfo.profile_deep_link;
                userPersona.username = userInfo.username;
                userPersona.follower_count = userInfo.follower_count;
                userPersona.following_count = userInfo.following_count;
                userPersona.likes_count = userInfo.likes_count;
                userPersona.video_count = userInfo.video_count;
                userPersona.is_verified = userInfo.is_verified;
            }

            await userPersona.save();
        }

        return NextResponse.json(userPersona);
    } catch (error) {
        return NextResponse.json({ message: error || "An error occurred" });
    }
}
