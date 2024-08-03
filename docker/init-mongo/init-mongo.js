// docker/init-mongo/init-mongo.js

db.createUser({
    user: 'admin',
    pwd: 'password',
    roles: [
        {
            role: 'dbOwner',
            db: 'viralizeai',
        },
    ],
});

db = db.getSiblingDB('viralizeai'); // Switch to your database
db.createCollection('prompts'); // Create a collection if needed

db.prompts.insertMany([
    {
        "prompt": "Title: #wopchallenge, Description: A viral dance to 'WAP' by Cardi B and Megan Thee Stallion. Likes: 9,400,000, Comments: 108,600, Shares: 169,200, Views: 83,800,000, Duration: 21 seconds, Share URL: https://www.tiktok.com/@seventeen17_official/video/7316083339788569857?is_from_webapp=1&sender_device=pc&web_id=7384727992465901072",
        "prompt_type": "viral",
    },
    {
        "prompt": "Title: @tiktok it's your turn! ⚡️🙋🏿‍♂️ 🙌🏿😂 #tiktoklearnfromkhaby#learnfromkhaby, Description: Mimics Khaby Lame’s expressions and gestures. Likes: 24,400,000, Comments: 255,900, Shares: 94,000, Views: 190,800,000, Duration: 11 seconds, Share URL: https://www.tiktok.com/@khaby.lame/video/6965122051178892549?is_from_webapp=1&sender_device=pc&web_id=7384727992465901072",
        "prompt_type": "viral",
    },
    {
        "prompt": "Infer the category the user is in based on their profile description.",
        "prompt_type": "inferCategory",
    },
    {
        "prompt": "You are a TikTok social media strategist helping your client create the best TikTok content to drive traffic, engagement, and followers. You are innovative, creative, and experienced in generating viral content",
        "prompt_type": "persona",
    },
    {
        "prompt": "Based on your client's background: {tiktokUserData}, {userInput}, {inferCategoryPrompt}, {viralVideos}, Generate video ideas for the inferred category. Create a TikTok video strategy to help your client tap into the latest trends and achieve their goals of promoting their store. The strategy must incorporate the latest trend and their persona and must achieve the most popularity on TikTok. The strategy should be formatted as follows: \n\n**TikTok Video Strategy: Steps for promoting your business**\n\n**Step 1: Profile Analysis**\n\n- Following: [--- following ---]\n- Followers: [--- followers ---]\n- Likes: [--- likes ---]\n- Bio: [--- bio ---]\n\n[Create a short summary paragraph of the user's theme, personality, style, and social media popularity]\n\n**Step 2: Hottest Trend Analysis**\n\n| Title | Description | Likes | Comments | Shares | Views | Duration | Likes Conversion | Theme |\n| ------------ | -------------- | -------- | ---------- | -------- | ------- | ---------- | ------------------ | ------- |\n| [title1] | [description1] | [likes1] | [comments1] | [shares1] | [views1] | [duration1] | [conversion1] | [theme1] |\n| [title2] | [description2] | [likes2] | [comments2] | [shares2] | [views2] | [duration2] | [conversion2] | [theme2] |\n\n### View Videos\n\n- [title1]: [url1]\n- [title2]: [url2]\n\n### Strategies to Make Video Viral\n\n[strategies]\n\n**Step 3: Step-by-Step Strategy to Create For-You Video Content:**\n\n**1. Video Concept:**\n- Title: [Generated Title]\n- Theme: [Generated Theme]\n- Your Goal: ${objective}\n\n**2. Hook:**\n- Type: [Generated Hook Type]\n- Scripted Hook: [Generated Hook Script]\n\n**3. Content Structure:**\n- Beginning: [Generated Beginning Content]\n- Middle: [Generated Middle Content]\n- End: [Generated End Content]\n\n**4. Call-to-Action (CTA):**\n\n\"[Generated CTA]\"\n\n**Detailed Script with Timestamp and Shot Descriptions**\n\n| Timestamp | Screen Content | Script |\n| ----------- | ---------------- | -------- |\n| [Timestamp] | [Screen Content] | [Script] |\n\n**5. Background Music:**\n\n\"[Generate a suitable background music for the generated video idea.]\"\n\n**6. Thumbnail Image:**\n\n\"[Generate a suitable thumbnail image for this video content, idea, and the product being promoted. If it is a product or service, you can add a discount of 75% in the image to promote it as an advertisement.]\"\n\n**7. Full Script for the video content**\n\n\"[Generate an interesting, captivating script for the whole duration of the video. The script should be concise and less than or equal to 150 words.]\"",
        "type": "detailed"
    }
]);
