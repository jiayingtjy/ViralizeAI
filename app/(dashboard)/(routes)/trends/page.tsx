"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { useState } from "react";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {  AreaChart, UserIcon } from "lucide-react";
import { Heading } from "@/components/ui/heading";
const TrendsPage = () => {
  const router = useRouter();
  const [trendData, setTrendData] = useState<ChatCompletionMessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle button click for trend analysis
  const onAnalyseTrends = async () => {
    setIsLoading(true);
    try {
      const detailedPrompt = createTrendAnalysisPrompt();
      const trends: ChatCompletionMessageParam = {
        role: "user",
        content: detailedPrompt,
      };

      const newTrends = [...trendData, trends];
      const response = await axios.post("/api/content", {
        messages: newTrends,
      });

      console.log(response);

      setTrendData((current) => [...current, response.data]);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  // Generate trend analysis prompt
  const createTrendAnalysisPrompt = () => {
    const trendPrompt = `You are a TikTok social media strategist helping your client create the best TikTok content to drive traffic, engagement, and followers. You are innovative, creative, and experienced in generating viral content. You are an expert in analyzing the hottest and most viral content on TikTok and finding common similarities that make them hot on TikTok.`;
    const tiktokVideoData = `
      1. Title: #wopchallenge, Description: The dancer performs a viral dance routine to the popular song "WAP" by Cardi B and Megan Thee Stallion, Likes: 9400000, Comments: 108600, Shares: 169200, Views: 83800000, Duration: 21 seconds, Share URL: https://www.tiktok.com/@seventeen17_official/video/7316083339788569857?is_from_webapp=1&sender_device=pc&web_id=7384727992465901072
      2. Title: @tiktok it’s your turn! ⚡️🙋🏿‍♂️ 🙌🏿😂 #tiktoklearnfromkhaby#learnfromkhaby, Description: The creator mimics the facial expressions and gestures of the popular TikTok creator Khaby Lame, Likes: 24400000, Comments: 255900, Shares: 94000, Views: 190800000, Duration: 11 seconds, Share URL: https://www.tiktok.com/@khaby.lame/video/6965122051178892549?is_from_webapp=1&sender_device=pc&web_id=7384727992465901072
    `;

    const detailedPrompt = `${trendPrompt} Based on the following TikTok video data, please generate a detailed analysis in table format of each of the hottest trending videos on TikTok by analyzing the video description, like_count, comment_count, share_count, view_count, duration. 
        Calculate the likes conversion rate as the percentage of likes/views. Also at the end please analyse and summarize the strategies to make the video viral.
        
      ### TikTok Video Data
      ${tiktokVideoData}
        
      ### Analysis of Videos
        
      | Title      | Video Description                                                   | Like Count  | Comment Count | Share Count | View Count | Duration    | Likes Conversion | Theme           |
      |------------|---------------------------------------------------------------------|-------------|---------------|-------------|------------|-------------|------------------|-----------------|
      | [---title1---] | [---description1---]                                            | [---like1---] | [---comment1---] | [---share1---] | [---view1---] | [---duration1---] | [---conversion1---] | [---theme1---] |
      | [---title2---] | [---description2---]                                            | [---like2---] | [---comment2---] | [---share2---] | [---view2---] | [---duration2---] | [---conversion2---] | [---theme2---] |

      ### View Videos
      - [---title1---]: [---url1---]
      - [---title2---]: [---url2---]

      ### Strategies to Make Video Viral
      [---strategies---]`;

      return detailedPrompt;
  };

  const renderMessageContent = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 {...props} className="text-2xl font-bold mb-4" />,
          h2: ({ node, ...props }) => <h2 {...props} className="text-xl font-bold mb-3" />,
          h3: ({ node, ...props }) => <h3 {...props} className="text-lg font-bold mb-2" />,
          strong: ({ node, ...props }) => <strong {...props} className="font-bold" />,
          p: ({ node, ...props }) => <p {...props} className="" />,
          ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside pl-6" />,
          li: ({ node, ...props }) => <li {...props} className="" />,
          table: ({ node, ...props }) => <table {...props} className="table-auto justify-center border-collapse border border-gray-200 my-2" />,
          th: ({ node, ...props }) => <th {...props} className="text-center border text-violet-900 bg-violet-100 border-gray-200 px-4 py-2" />,
          td: ({ node, ...props }) => <td {...props} className="border border-gray-200 px-4 py-2" />,
          tr: ({ node, ...props }) => <tr {...props} className="even:bg-violet-100" />,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div>

      <Heading
        title="Hottest Trends Analysis"
        description="Understand your social media popularity and theme."
        icon={AreaChart}
        iconColor="text-violet-700"
        bgColor="bg-violet-700/10"
      />
      <div className="flex items-left justify-center mb-4">
        <h3 className="bg-violet-500/20 text-center text-violet-700 font-bold py-2 px-6 rounded-lg mb-2 rounded-full">
          Curious what kind of videos will lead to the highest likes and views?
        </h3>
      </div>
      {/* Step 2: Analyze Hottest Trends */}
      <div className="px-4 lg:px-8">
        <div className="mb-8 bg-violet-300/20 rounded-lg border w-full p-4 px-3 focus-within:shadow-sm gap-8">
          <h3 className="text-center text-violet-800 font-bold py-2 px-6">
            Find out the hottest trend on TikTok
          </h3>
          <div className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
            <Button disabled={isLoading} onClick={onAnalyseTrends} className="w-full lg:w-auto p-2 col-span-12 lg:col-span-12 bg-violet-800">
              Retrieve hottest trends on Tiktok
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        {isLoading && (
          <div className="p-8 rounded-lg w-full items-center justify-center bg-muted flex">
            <Loader />
          </div>
        )}
        {trendData.length === 0 && !isLoading && (
          <p className="text-muted-foreground text-sm text-center mb-10">
            No trends retrieved.
          </p>
        )}

        <div className="flex flex-col-reverse gap-y-4">
          {trendData.map((message, index) => (
            <div
              key={index}
              className={cn(
                "p-8 w-full flex items-start gap-x-8 rounded-lg",
                message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
              )}
            >
              {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
              {typeof message.content === "string" ? (
                <div className="whitespace-pre-wrap">{renderMessageContent(message.content)}</div>
              ) : (
                "Invalid message content"
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;
