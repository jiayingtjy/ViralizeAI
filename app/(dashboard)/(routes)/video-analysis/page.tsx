"use client";

import * as z from "zod";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LucideLineChart } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { useState, useEffect, useRef } from "react";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

const ContentGenerationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      video: undefined,
    },
  });

  const { handleSubmit, setValue, reset } = form;

  const addChatMessage = (
    senderId: string,
    message: string,
    message_type: string
  ) => {
    const chat_type = "video-analysis";

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
      const videoFile = values.video;

      // Add user input message
      const messageContent =
        userInput +
        (videoFile
          ? `\n Selected Video: ${videoFile.name} (${(
              videoFile.size /
              1024 /
              1024
            ).toFixed(2)} MB)`
          : "No video file selected");

      const userMessage: ChatCompletionMessageParam = {
        role: "user",
        content: messageContent,
      };

      setMessages((current) => [...current, userMessage]);

      addChatMessage("dummyUser", messageContent, "text");

      // Simulate loading time
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Add assistant response message
      const assistantMessage: ChatCompletionMessageParam = {
        role: "assistant",
        content: `
**Video Analysis Report**

**Related Tags**
\#Fashion \#OOTD \#Joyful \#Excited \#Dance
\#HappyVibes \#PositiveEnergy \#Trendy \#FashionInspo
\#OutfitShowcase \#DanceMoves \#FeelGood \#MusicAndFashion


**1. Video Quality:**
- **Resolution:** 1080p HD
- **Frame Rate:** 30 fps
- **Overall Quality:** Excellent

**2. Content Analysis:**
- **Hook:** The first 5 seconds grab attention with a bold, catchy statement. Great job on capturing the viewer's interest quickly.
- **Main Content:** The middle section is well-structured, providing valuable information with clear visuals and concise narration.
- **Ending:** The video ends with a strong call-to-action, encouraging viewers to like, comment, and subscribe.

**3. Engagement Factors:**
- **Visuals:** High-quality visuals and smooth transitions keep the audience engaged. Consider adding more dynamic elements like animations to enhance visual interest.
- **Audio:** Clear and crisp audio with appropriate background music. Ensure the background music volume is slightly lower to avoid overshadowing the narration.
- **Pacing:** The pacing is consistent and keeps the viewer's attention throughout. However, consider adding brief pauses to allow viewers to absorb the information better.

**4. SEO and Social Media Optimization:**
- **Title and Description:** The video title is catchy and relevant. Ensure the description includes relevant keywords and a brief summary of the video content.
- **Tags:** Utilize more specific tags related to your niche to improve searchability.
- **Thumbnail:** The thumbnail is visually appealing and relevant to the video content. Consider using text overlays to highlight the main topic.

**5. Overall Feedback:**
- The video is highly engaging and informative, making it likely to perform well on social media platforms. Keep up the good work on maintaining high production quality.
- For future videos, consider experimenting with different content formats and styles to keep your audience engaged.
- Engage with viewers in the comments section to build a community around your content.

**Recommendations:**
- Continue producing high-quality content with a strong focus on engagement.
- Experiment with shorter video formats to cater to audiences with shorter attention spans.
- Use analytics to track performance and identify areas for improvement.
`,
      };

      setMessages((current) => [...current, assistantMessage]);

      addChatMessage("dummyRobot", assistantMessage.content as string, "text");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      reset();
      form.reset();
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setVideoFile(file);
    setValue("video", file ?? undefined);
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const chatHistory = await getChatHistory("video-analysis");
        if (chatHistory && chatHistory.messages) {
          setMessages(
            chatHistory.messages.map(
              (msg: { sender_id: string; message: any }) => ({
                role: msg.sender_id === "dummyUser" ? "user" : "assistant",
                content: msg.message,
              })
            )
          );
        } else {
          console.error("Chat history is null or messages are missing.");
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
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
              className="border border-gray-200 px-4 py-2 break-words"
            />
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
        title="Video Content Analyser"
        description="Check to ensure your video content meets your needs"
        icon={LucideLineChart}
        iconColor="text-blue-500"
        bgColor="bg-blue-500/10"
      />
      <div className="flex items-left justify-center">
        <h3 className="bg-blue-500/20 text-center text-blue-500 font-bold py-2 px-6 rounded-lg rounded-full">
          Describe your business, your product and yourself. What do you want to
          achieve?
        </h3>
      </div>
      <div
        className="flex-1 overflow-auto px-4 my-4 lg:px-8"
        ref={chatContainerRef}
      >
        <div className="space-y-4 mt-4">
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
        </div>
      </div>
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-lg border w-full p-4 mb-4 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2 relative"
          >
            <div className="col-span-12 mb-4">
              {!videoFile ? (
                <FormField
                  name="video"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className="m-0 p-0">
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                MP4, AVI, MOV (MAX. 100MB)
                              </p>
                            </div>
                            <input
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                              accept="video/*"
                              onChange={handleVideoChange}
                            />
                          </label>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              ) : (
                <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-gray-700">Selected Video:</p>
                  <p className="text-gray-500">{videoFile.name}</p>
                  <p className="text-gray-500">
                    {videoFile.size &&
                      (videoFile.size / 1024 / 1024).toFixed(2)}{" "}
                    MB
                  </p>
                  <Button className="mt-2" onClick={() => setVideoFile(null)}>
                    Change Video
                  </Button>
                </div>
              )}
            </div>
            <div className="col-span-12 lg:col-span-10">
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem>
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
            </div>
            <div className="col-span-12 lg:col-span-2">
              <Button disabled={isLoading} className="w-full p-2">
                Generate
              </Button>
            </div>
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
