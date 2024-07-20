"use client";

import * as z from "zod";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

const ContentGenerationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [messages2, setMessages2] = useState<ChatCompletionMessageParam[]>([]);

  // Initialize the form with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Control validation of the form, cannot be empty
    defaultValues: {
      prompt: ""
    }
  });

  // Track the form's submission state
  const isLoading = form.formState.isSubmitting;

  // Prompt Engineering Logic
  const createPrompt = (userInput: string) => {
    const personaPrompt = `You are a TikTok social media strategist helping your client create the best TikTok content to drive traffic, engagement, and followers. You are innovative, creative, and experienced in generating viral content.`;
    const inferCategoryPrompt = `Infer the category the user is in based on their description of the profile.`;
    const objective = "Increase in reach, Increase in Traffic, Increase in offline customers, Customer retention [follow account]";

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

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Generate the detailed prompt
      const userInput = values.prompt;
      const detailedPrompt = createPrompt(userInput);

      // Create a new user message
      const userMessage: ChatCompletionMessageParam = {
        role: "user",
        content: detailedPrompt,
      };
      const userMessage2: ChatCompletionMessageParam = {
        role: "user",
        content: userInput,
      };

      // Append the new message to the existing messages
      const newMessages = [...messages, userMessage];
      const newMessages2 = [...messages2, userMessage2];

      // Send a POST request to the API with the new messages
      const response = await axios.post("/api/content", {
        messages: newMessages
      });

      // Update the messages state with the user message and response
      setMessages((current) => [...current, userMessage, response.data]);
      setMessages2((current) => [...current, userMessage2, response.data]);
      form.reset();

    } catch (error: any) {
      // Handle errors
      console.log(error);
    } finally {
      router.refresh();
    }
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
            table: ({ node, ...props }) => <table {...props} className="table-auto ustify-center border-collapse border border-gray-200 my-2" />,
            th: ({ node, ...props }) => <th {...props} className="text-center border text-pink-900 bg-pink-100 border-gray-200 px-4 py-2" />,
            td: ({ node, ...props }) => <td {...props} className="border border-gray-200 px-4 py-2" />,
            tr: ({ node, ...props }) => <tr {...props} className="even:bg-pink-100" />,
          }}
          
          
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div>
      <Heading
        title="Idea & Content Generation"
        description="Your personal AI social media strategist"
        icon={MessageSquare}
        iconColor="text-orange-500"
        bgColor="bg-orange-500/10"
      />
      <div className="flex items-left justify-center mb-4">
        <h3 className="bg-orange-500/20 text-center text-orange-500 font-bold py-2 px-6 rounded-lg mb-2 rounded-full">
          Describe your business, your product and yourself. What do you want to achieve?
        </h3>
      </div>
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField name="prompt" render={({ field }) => (
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
            )} />
            <Button disabled={isLoading} className="w-full p-2 col-span-12 lg:col-span-2">
              Generate
            </Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4">
        {isLoading && (
          <div className="p-8 rounded-lg w-full items-center justify-center bg-muted flex">
            <Loader />
          </div>
        )}
        {messages.length == 0 && !isLoading && (
          <Empty label="No conversation started." />
        )}
        <div className="flex flex-col-reverse gap-y-4">
          {messages2.map((message, index) => (
            console.log(message),
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
}

export default ContentGenerationPage;
