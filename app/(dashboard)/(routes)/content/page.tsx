"use client";

import * as z from "zod";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { MessageSquare } from "lucide-react";
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

const ContentGenerationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const examplePrompts = [
    "How do I promote my shirt for my brand? I am a small startup that sells aesthetic wear for sports.",
    "What are some content ideas for my bakery's social media? We specialize in artisan breads and pastries.",
    "How can I increase engagement for my online yoga classes on TikTok?",
  ];
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const handleExampleClick = (examplePrompt: string) => {
    form.setValue("prompt", examplePrompt);
    form.handleSubmit(onSubmit)();
    setIsButtonVisible(false);
  };

  const createPrompt = (userInput: string) => {
    const personaPrompt = `You are a TikTok social media strategist helping your client create the best TikTok content to drive traffic, engagement, and followers. You are innovative, creative, and experienced in generating viral content.`;
    const inferCategoryPrompt = `Infer the category the user is in based on their description of the profile.`;
    const objective =
      "Increase in reach, Increase in Traffic, Increase in offline customers, Customer retention [follow account]";

    const detailedPrompt = `${personaPrompt} Based on your client's input: "${userInput}", ${inferCategoryPrompt} Generate video ideas for the inferred category. 
    Based on all this information, create one TikTok video strategy to help your client tap into the latest trend and achieve their goal of promoting their store. 
    The strategy should be in the following format where the Detailed Script with Timestamp and Shot Descriptions section's content should be returned as a table:
    
    **TikTok Video Strategy: Steps for promoting your business**

    **Step-by-Step Strategy to create For-You Video Content:**

    **1. Video Concept:**
       - Title: [Generated Title]
       - Theme: [Generated Theme]
       - Goal: ${objective}

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

    | Timestamp | Screen Content                   | Lines                                           |
    |-----------|----------------------------------|-------------------------------------------------|
    | [Generated Timestamp] | [Generated Screen Content] | [Generated Lines] |`;

    return detailedPrompt;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const userInput = values.prompt;
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

      const response = await fetch("/api/content", {
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulatedText += decoder.decode(value);
        setMessages((current) => [
          ...current.filter((msg) => msg.role !== "assistant"),
          { role: "assistant", content: accumulatedText },
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      router.refresh();
      form.setValue("prompt", "");
    }
  };

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
          p: ({ node, ...props }) => <p {...props} className="" />,
          ul: ({ node, ...props }) => (
            <ul {...props} className="list-disc list-inside pl-6" />
          ),
          li: ({ node, ...props }) => <li {...props} className="" />,
          table: ({ node, ...props }) => (
            <table
              {...props}
              className="table-auto justify-center border-collapse border border-gray-200 my-2"
            />
          ),
          th: ({ node, ...props }) => (
            <th
              {...props}
              className="text-center border text-pink-900 bg-pink-100 border-gray-200 px-4 py-2"
            />
          ),
          td: ({ node, ...props }) => (
            <td {...props} className="border border-gray-200 px-4 py-2" />
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
        title="Idea & Content Generation"
        description="Your personal AI social media strategist"
        icon={MessageSquare}
        iconColor="text-orange-500"
        bgColor="bg-orange-500/10"
      />
      <div className="flex items-left justify-center">
        <h3 className="bg-orange-500/20 text-center text-orange-500 font-bold py-2 px-6 rounded-lg rounded-full">
          Describe your business, your product and yourself. What do you want to
          achieve?
        </h3>
      </div>
      <div
        className="flex-1 overflow-auto px-4 my-4 lg:px-8"
        ref={chatContainerRef}
      >
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full items-center justify-center bg-muted flex">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                {typeof message.content === "string" ? (
                  <div className="whitespace-pre-wrap">
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
      <div className="flex justify-center mb-8">
        {isButtonVisible &&
          examplePrompts.map((prompt, index) => (
            <Button
              key={index}
              onClick={() => handleExampleClick(prompt)}
              className="p-4 my-2 mx-2 max-w-96 box-content bg-orange-500"
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
            className="rounded-lg border w-full p-4 mb-4 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
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
              className="w-full p-2 col-span-12 lg:col-span-2"
            >
              Generate
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ContentGenerationPage;
