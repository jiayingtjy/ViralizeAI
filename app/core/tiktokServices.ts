import { clerkClient } from "@clerk/nextjs/server";
import { sendToQueue } from "@/lib/rabbit";


class TikTokService {
    private userId: string;

    constructor(userId: string ) {
        this.userId = userId;
    }

    async getUserAccessToken(): Promise<string> {
        if (!this.userId) {
            throw new Error("User not found");
        }

        // Get the OAuth access token for the user
        const provider = "oauth_tiktok";

        const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
            this.userId,
            provider
        );

        const accessToken = clerkResponse.data[0].token;
        return accessToken;
    }

    async getUserInfo(): Promise<object> {
        try {
            const accessToken = this.getUserAccessToken();

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
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!tiktokResponse.ok) {
                throw new Error("Failed to fetch data from TikTok API");
            }

            const tiktokData = await tiktokResponse.json();

            return tiktokData;
        } catch (error) {
            return { message: error }
        }
    }

    async getUserVideoTags(): Promise<object> {
        try {
            const accessToken = this.getUserAccessToken();
            
            sendToQueue('videoTags', { accessToken: accessToken });

            return { message: "Video tags processing" };
        } catch (error) {
            return { message: error }
        }
    }
}

export default TikTokService;
