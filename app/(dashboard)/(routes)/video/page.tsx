"use client";

import * as z from "zod";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { Music, Video, VideoIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";

const VideoGeneratorPage = () => {
  const router = useRouter();
  const [video, setVideo] = useState<string | null>(null);
  
  // Initialize the form with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Control validation of the form, cannot be empty
    defaultValues: {
      prompt: ""
    }
  });

  // Track the form's submission state
  const isLoading = form.formState.isSubmitting;

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(null); // Reset the music state
      const response = await axios.post("/api/video", values);
      setVideo(response.data[0]); // Update the music state with the response URL
      form.reset();
    } catch (error: any) {
      console.error(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Video Generation"
        description="Your personal AI video generator for any content."
        icon={VideoIcon}
        iconColor="text-cyan-800"
        bgColor="bg-cyan-500/10"
      />
      <div className="flex items-left justify-center mb-4">
        <h3 className="bg-cyan-500/20 text-center text-cyan-800 font-bold py-2 px-6 rounded-lg mb-2 rounded-full">
          Cannot seem to film the right content? No worry, provide your content and we will personalize a music track for you.
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
                    placeholder="E.g. Generate a video content for my makeup product."
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
        {!video && !isLoading && (
          <Empty label="No video generated." />
        )}
        {video && (
          
          <video controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
            <p>Your Personalized Music is generated!</p>
            <source src={video}/>
            Your browser does not support the audio element.
          </video>
        )}
      </div>
    </div>
  );
}

export default VideoGeneratorPage;
