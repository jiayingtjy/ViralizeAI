"use client";

import * as z from "zod";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { MessageSquare, UserIcon, Youtube } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

const PersonaPage = () => {
  const router = useRouter();
  const [personaData, setPersonaData] = useState<ChatCompletionMessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  // Handle button click for persona analysis
  const onAnalyseUserPersona = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const userInput = values.prompt;
      const detailedPrompt: string = createPersonaAnalysisPrompt(userInput);
      const userMessage: ChatCompletionMessageParam = {
        role: "user",
        content: detailedPrompt,
      };

      const newPersonaData = [...personaData, userMessage];

      const response = await fetch("/api/persona", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        console.error("Failed to fetch data from TikTok API");
        return;
      }

      const responseJson = await response.json();
      
      // Adding the response data to the personaData array correctly
      setPersonaData((current) => [...current, userMessage]);

      form.reset();
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
};

  // Generate prompt
  const createPersonaAnalysisPrompt = (userInput: string) => {
    const personaPrompt = `You are a TikTok social media strategist helping your client create the best TikTok content to drive traffic, engagement, and followers. You are innovative, creative, and experienced in generating viral content. You are an expert in analyzing the user profile and giving feedback on how they should improve their user following, likes, outreach, etc.`;
    const tiktokUserData = `Here is the TikTok user data: 235 Following, 36 Followers, 0 Likes, Bio: I am a TikTok who likes to create TikTok for dance, playing piano, doing makeup, and eating delicious food.`;

    const detailedPrompt = `${personaPrompt} Based on the client description: ${userInput} and the data provided by TikTok on the user statistics ${tiktokUserData}, please generate a detailed analysis of the user persona showing all the user profile info and statistics, compare to other content creators in the field, and provide some suggestions on how to increase follower base. Make sure the key headers are bolded and limit the suggestions to three.
    In your analysis do not use "this user" instead be more personalized to be: "you"
    below is the format you should follow:
      **1. User Profile Info:**
      - **Following**: [---following---]
      - **Followers**: [---followers---]
      - **Likes**: [---likes---]
      - **Bio**: [---bio---]

      **2. Analysis:**
      [state the user analysis]
      
      **3. Comparison to Other Content Creators:**
      [state the comparison]

      **4. Suggestions to Increase Follower Base:**
      [3 suggestions in point form]`;


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
          th: ({ node, ...props }) => <th {...props} className="text-center border text-red-900 bg-red-100 border-gray-200 px-4 py-2" />,
          td: ({ node, ...props }) => <td {...props} className="border border-gray-200 px-4 py-2" />,
          tr: ({ node, ...props }) => <tr {...props} className="even:bg-red-100" />,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div>

      <Heading
        title="Persona Analysis"
        description="Understand your social media popularity and theme."
        icon={UserIcon}
        iconColor="text-red-700"
        bgColor="bg-red-700/10"
      />
      <div className="flex items-left justify-center mb-4">
        <h3 className="bg-red-500/20 text-center text-red-700 font-bold py-2 px-6 rounded-lg mb-2 rounded-full">
          Dont understand your persona and brand positioning on Tiktok? Cant find the reason for low following rate?
        </h3>
      </div>
      {/* Step 1: Analyse your persona */}
      <div className="px-4 lg:px-8">
        <div className="mb-8 bg-red-300/20 rounded-lg border w-full p-4 px-3 focus-within:shadow-sm gap-8">
          <h3 className="text-center text-red-800 font-bold py-2 px-6">
            Analyse your persona, style, social popularity!
          </h3>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onAnalyseUserPersona)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField name="prompt" render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Describe yourself. E.g. I am a funny content creator that like to make funny themed videos."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )} />
              <Button disabled={isLoading} className="w-full p-2 col-span-12 lg:col-span-2 bg-red-700">
                Analyze your persona
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        {isLoading && (
          <div className="p-8 rounded-lg w-full items-center justify-center bg-muted flex">
            <Loader />
          </div>
        )}
        {personaData.length === 0 && !isLoading && (
          <p className="text-muted-foreground text-sm text-center mb-10">
            No analysis generated yet.
          </p>
        )}

        <div className="flex flex-col-reverse gap-y-4">
          {personaData.map((message, index) => (
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

export default PersonaPage;
