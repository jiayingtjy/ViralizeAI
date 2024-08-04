import { clerkClient } from "@clerk/nextjs/server";
import { sendToQueue } from "@/lib/rabbit";
import { auth } from "@clerk/nextjs/server";

interface TikTokUserInfo {
    open_id: string;
    union_id: string;
    avatar_url: string;
    avatar_url_100: string;
    display_name: string;
    bio_description: string;
    profile_deep_link: string;
    username: string;
    follower_count: number;
    following_count: number;
    likes_count: number;
    video_count: number;
    is_verified: boolean;
}

class TikTokService {
    private userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    async getUserAccessToken(): Promise<string> {
        if (!this.userId) {
            throw new Error("User not found");
        }

        // Get the OAuth access token for the user
        const provider = "oauth_tiktok";

        try {
            const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
                this.userId,
                provider
            );

            if (!clerkResponse.data || !clerkResponse.data.length) {
                throw new Error("No access token found in Clerk response");
            }

            const accessToken = clerkResponse.data[0].token;
            return accessToken;
        } catch (error) {
            console.error("Error fetching Clerk Token:", error);
            throw error;
        }
    }

    async getUserInfo(): Promise<TikTokUserInfo> {
        try {
            const accessToken = await this.getUserAccessToken();

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
                console.error("TikTok API response error:", tiktokResponse.statusText);
                throw new Error("Failed to fetch data from TikTok API");
            }

            const tiktokData = await tiktokResponse.json();
            const tiktokDataBody = tiktokData.data.user
            return tiktokDataBody as TikTokUserInfo;

        } catch (error) {
            console.error("Error fetching TikTok user info:", error);
            throw new Error(String(error));
        }
    }

    async getUserVideoTags(): Promise<object> {
        try {
            const accessToken = await this.getUserAccessToken();
            sendToQueue('video_tagging', { accessToken: accessToken });

            return { message: "Video tags processing" };
        } catch (error) {
            console.error("Error sending video tags to queue:", error);
            return { message: error }
        }
    }
}

export default TikTokService;
