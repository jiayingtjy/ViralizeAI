"use client";

import * as z from "zod";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Download, MessageSquare, Youtube } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { useState, useEffect, useRef } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

import PersonaPage from "../persona/page";
import TrendsPage from "../trends/page";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { set } from "mongoose";

const ContentGenerationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState<{ script: string | null; speech: string | null; music: string | null; thumbnail: string | null }>({
    script: null,
    speech: null,
    music: null,
    thumbnail: null
  });
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const examplePrompts = [
    "How do I promote my shirt for my brand? I am a small startup that sells aesthetic wear for sports.",
    "What are some content ideas for my bakery's social media? We specialize in artisan breads and pastries.",
    "How can I increase engagement for my online yoga classes on TikTok?",
  ];

  const handleExampleClick = (examplePrompt: string) => {
    form.setValue("prompt", examplePrompt);
    form.handleSubmit(onSubmit)();
    setIsButtonVisible(false);
  };

  const createPrompt = (userInput: string) => {
    const tiktokUserData = `TikTok User Data: 235 Following, 36 Followers, 0 Likes.`;
    const tiktokVideoData = `
      1. Title: #wopchallenge, Description: A viral dance to "WAP" by Cardi B and Megan Thee Stallion. Likes: 9,400,000, Comments: 108,600, Shares: 169,200, Views: 83,800,000, Duration: 21 seconds, Share URL: https://www.tiktok.com/@seventeen17_official/video/7316083339788569857?is_from_webapp=1&sender_device=pc&web_id=7384727992465901072
      2. Title: @tiktok it’s your turn! ⚡️🙋🏿‍♂️ 🙌🏿😂 #tiktoklearnfromkhaby#learnfromkhaby, Description: Mimics Khaby Lame’s expressions and gestures. Likes: 24,400,000, Comments: 255,900, Shares: 94,000, Views: 190,800,000, Duration: 11 seconds, Share URL: https://www.tiktok.com/@khaby.lame/video/6965122051178892549?is_from_webapp=1&sender_device=pc&web_id=7384727992465901072`;
    const personaPrompt = `You are a TikTok social media strategist helping your client create the best TikTok content to drive traffic, engagement, and followers. You are innovative, creative, and experienced in generating viral content.`;
    const inferCategoryPrompt = `Infer the category the user is in based on their profile description.`;
    const objective =
      "Increase reach, traffic, offline customers, and customer retention.";

    const detailedPrompt = `
      ${personaPrompt}
      Based on your client's background: ${tiktokUserData}, ${userInput}, ${inferCategoryPrompt}, and the following video data:
      ${tiktokVideoData}
      Generate video ideas for the inferred category. Create a TikTok video strategy to help your client tap into the latest trends and achieve their goals of promoting their store. The strategy must incorporate the latest trend and their persona and must achieve the most popularity on TikTok. The strategy should be formatted as follows:
  
      **TikTok Video Strategy: Steps for promoting your business**
  
      **Step 1: Profile Analysis** 
      - Following: [---following---]
      - Followers: [---followers---]
      - Likes: [---likes---]
      - Bio: [---bio---]
      [Create a short summary paragraph of the user's theme, personality, style, and social media popularity]
  
      **Step 2: Hottest Trend Analysis** 
  
      | Title      | Description  | Likes  | Comments | Shares | Views | Duration | Likes Conversion | Theme |
      |------------|--------------|--------|----------|--------|-------|----------|------------------|-------|
      | [title1]   | [description1] | [likes1] | [comments1] | [shares1] | [views1] | [duration1] | [conversion1] | [theme1] |
      | [title2]   | [description2] | [likes2] | [comments2] | [shares2] | [views2] | [duration2] | [conversion2] | [theme2] |
  
      ### View Videos
      - [title1]: [url1]
      - [title2]: [url2]
  
      ### Strategies to Make Video Viral
      [strategies]
  
      **Step 3: Step-by-Step Strategy to Create For-You Video Content:**
  
      **1. Video Concept:**
      - Title: [Generated Title]
      - Theme: [Generated Theme]
      - Your Goal: ${objective}
  
      **2. Hook:**
      - Type: [Generated Hook Type]
      - Scripted Hook: [Generated Hook Script]
  
      **3. Content Structure:**
      - Beginning: [Generated Beginning Content]
      - Middle: [Generated Middle Content]
      - End: [Generated End Content]
  
      **4. Call-to-Action (CTA):**
      - "[Generated CTA]"
  
      **Detailed Script with Timestamp and Shot Descriptions**
  
      | Timestamp | Screen Content | Script |
      |-----------|----------------|--------|
      | [Timestamp] | [Screen Content] | [Script] |
  
      **5. Background Music:**
      "[Generate a suitable background music for the generated video idea.]"
  
      **6. Thumbnail Image:**
      "[Generate a suitable thumbnail image for this video content, idea, and the product being promoted. If it is a product or service, you can add a discount of 75% in the image to promote it as an advertisement.]"

      **7. Full Script for the video content**
      "[Generate a interesting, captivating script for the whole duration of the video. The script should be concise and less than or equal to 150 words.]"
      `;
    return detailedPrompt;
  };

  const addChatMessage = (senderId: string, message: string, message_type: string) => {
    const chat_type = "viralizeai";

    fetch("/api/chat/set_history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_type,
        senderId,
        message,
        message_type,
      }),
    });
  };

  const getChatHistory = async (chat_type: string) => {
    try {
      const response = await fetch("/api/chat/get_history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chat_type }),
      });

      const parsedData = await response.json();

      return parsedData;
    } catch (error) {
      console.error("Error fetching chat history:", error);
      throw new Error("Failed to fetch chat history");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const userInput = values.prompt;

      addChatMessage("dummyUser", userInput, "text");

      const detailedPrompt = createPrompt(userInput);
  
      const userMessage: ChatCompletionMessageParam = {
        role: "user",
        content: userInput,
      };
  
      setMessages((current) => [...current, userMessage]);
  
      const newMessages = [
        ...messages,
        userMessage,
        { role: "user", content: detailedPrompt },
      ];
  
      const response = await fetch("/api/viralizeai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });
  
      if (!response.body) throw new Error("No response body");
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";
      const removeQuotes = (str: string) => str.replace(/^"|"$/g, '').replace(/\\+$/, ''); // Updated to remove trailing quotes and backslashes
      const urlRegex = /(https?:\/\/[^\s]+)/g; // Regex to match URLs
      const imageUrlRegex = /\.(jpeg|jpg|gif|png|svg)$/i;
      const musicUrlRegex = /\.(mp3)$/i;
      const speechUrlRegex = /\.(wav)$/i;
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const decodedText = decoder.decode(value);
        
        if (decodedText.startsWith("data:")) {
          const contentMatch = decodedText.split("data:")[1];
          if (contentMatch) {
            const content = removeQuotes(contentMatch.match(urlRegex)?.[0] || "");
            if (imageUrlRegex.test(content)) {
              setMedia((prev) => ({ ...prev, thumbnail: content }));
              addChatMessage("dummyRobot", content, "thumbnail");
            } else if (speechUrlRegex.test(content)) {
              setMedia((prev) => ({ ...prev, speech: content }));
              addChatMessage("dummyRobot", content, "speech");
            } else if (musicUrlRegex.test(content)) {
              setMedia((prev) => ({ ...prev, music: content }));
              addChatMessage("dummyRobot", content, "music");
            } else {
              setMedia((prev) => ({ ...prev, script: content }));
              addChatMessage("dummyRobot", content, "script");
            }
          }
        } else {
          accumulatedText += decodedText;
          setMessages((current) => [
            ...current.filter((msg) => msg.role !== "assistant"),
            { role: "assistant", content: accumulatedText },
          ]);
        }
      }

      addChatMessage("dummyRobot", accumulatedText, "text");
    
    } catch (error: any) {
      console.error(error);
    } finally {
      router.refresh();
      form.reset();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      const chatHistory = await getChatHistory("viralizeai");
  
      if (chatHistory && chatHistory.messages) {
        chatHistory.messages.forEach((msg: { sender_id: string; message: any; message_type: string }) => {  
          switch (msg.message_type) {
            case "text":
              setMessages((current) => [
                ...current,
                {
                  role: msg.sender_id === "dummyUser" ? "user" : "assistant",
                  content: msg.message,
                },
              ]);
              break;
            case "speech":
              setMedia((prev) => ({ ...prev, speech: msg.message }));
              break;
            case "thumbnail":
              setMedia((prev) => ({ ...prev, thumbnail: msg.message }));
              break;
            case "music":
              setMedia((prev) => ({ ...prev, music: msg.message }));
              break;
            case "script":
              setMedia((prev) => ({ ...prev, script: msg.message }));
              break;
            default:
              console.warn(`Unknown message type: ${msg.message_type}`);
          }
        });
  
      } else {
        console.error("Chat history is null or messages are missing.");
      }
    };
  
    fetchChatHistory();
  
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  

  const renderMessageContent = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-2xl font-bold mb-4" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-xl font-bold mb-3" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-lg font-bold mb-2" />
          ),
          strong: ({ node, ...props }) => (
            <strong {...props} className="font-bold" />
          ),
          p: ({ node, ...props }) => (
            <p {...props} className="whitespace-pre-wrap break-words" />
          ),
          ul: ({ node, ...props }) => (
            <ul {...props} className="list-disc list-inside pl-6 break-words" />
          ),
          li: ({ node, ...props }) => <li {...props} className="break-words" />,
          table: ({ node, ...props }) => (
            <div className="overflow-auto">
              <table
                {...props}
                className="table-auto justify-center border-collapse border border-gray-200 my-2 w-full"
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              {...props}
              className="text-center border text-pink-900 bg-pink-100 border-gray-200 px-4 py-2 break-words"
            />
          ),
          td: ({ node, ...props }) => (
            <td
              {...props}
              className="border border-gray-200 px-4 py-2 break-words" />
          ),
          tr: ({ node, ...props }) => (
            <tr {...props} className="even:bg-pink-100" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };
  
  

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Heading
        title="All in One Content Generation"
        description="Your personal AI social media strategist"
        icon={Youtube}
        iconColor="text-pink-500"
        bgColor="bg-pink-500/10"
      />
      <div className="flex items-left justify-center mb-4 p-5">
        <h3 className="bg-pink-500/20 text-center text-pink-800 font-bold py-2 px-6 rounded-lg rounded-full">
          Transform any thoughts into high quality content, idea, audio, script,
          music, and video into viral content!
          <br /> Blend your persona with trending topics and your goals for the
          ultimate viral creation!
        </h3>
      </div>
      <div
        className="flex-1 overflow-auto px-4 my-4 lg:px-8"
        ref={chatContainerRef}
      >
        <div className="space-y-4 mt-4">
          {messages.length == 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg break-words",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                {typeof message.content === "string" ? (
                  <div className="whitespace-pre-wrap break-words w-full overflow-auto">
                    {renderMessageContent(message.content)}
                  </div>
                ) : (
                  "Invalid message content"
                )}
              </div>
            ))}
          </div>
          {media.script && (
            <div>
              <h3 className="px-6 bg-pink-500/20 text-center text-pink-800 font-bold py-6 px-3 rounded-lg mb-2 rounded-full">
                Too Lazy to Record? Here is your generated script and voiceover!
              </h3>
              <p>Here is your script: {media.script}</p>
            </div>
          )}
          {media.speech && (
            <div>
              <h3 className="px-6 bg-pink-500/20 text-center text-pink-800 font-bold py-6 px-3 rounded-lg mb-2 rounded-full">
                Here is your generated voiceover for this video content!
              </h3>
              <audio controls className="w-full mt-8 p-1">
                <source src={media.speech} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          {media.music && (
            <div className="space-y-4 mt-4">
              <h3 className="bg-pink-500/20 text-center text-pink-800 font-bold py-6 px-3 rounded-lg mb-2 rounded-full">
                Your Personalized Background Music for this video content is
                generated!
              </h3>
              <audio controls className="w-full mt-8 p-1">
                <source src={media.music} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          {media.thumbnail && (
            <div className="space-y-4 mt-4">
              <h3 className="bg-pink-500/20 text-center text-pink-800 font-bold py-6 px-3 rounded-lg mb-2 rounded-full">
                Your Generated Thumbnail for this video content.
              </h3>
              <Card className="rounded-lg overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={media.thumbnail}
                    alt="generated image"
                    width={500} // Adjust the width as necessary
                    height={500} // Adjust the height as necessary
                    layout="responsive" // Optional: To maintain the aspect ratio
                    objectFit="cover" // Optional: To define how the image should be resized
                  />
                </div>
                <CardFooter className="p-2">
                  <Button
                    onClick={() => media.thumbnail && window.open(media.thumbnail)}
                    variant="secondary"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center mb-8">
        {isButtonVisible &&
          examplePrompts.map((prompt, index) => (
            <Button
              key={index}
              onClick={() => handleExampleClick(prompt)}
              className="p-4 my-2 mx-2 max-w-96 box-content bg-pink-500"
            >
              <div className="text-left">
                <span className="block whitespace-pre-wrap">{prompt}</span>
              </div>
            </Button>
          ))}
      </div>
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border w-full p-4 mb-4 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2 relative"
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="E.g. How do I promote my shirt for my brand? I am a small startup that sells aesthetic wear for sports."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              className="w-full p-2 col-span-12 lg:col-span-2 bg-pink-700"
            >
              Generate
            </Button>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-lg">
                <Loader />
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ContentGenerationPage;
