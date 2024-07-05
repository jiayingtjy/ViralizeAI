"use client";

import * as z from "zod";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { Music } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";

const MusicGeneratorPage = () => {
  const router = useRouter();
  const [music, setMusic] = useState<string | null>(null);
  
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
      setMusic(null); // Reset the music state
      const response = await axios.post("/api/music", values);
      setMusic(response.data); // Update the music state with the response URL
      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Music Generation & Scoring"
        description="Your personal AI music generator for any videos."
        icon={Music}
        iconColor="text-yellow-800"
        bgColor="bg-yellow-500/10"
      />
      <div className="flex items-left justify-center mb-4">
        <h3 className="bg-yellow-500/20 text-center text-yellow-800 font-bold py-2 px-6 rounded-lg mb-2 rounded-full">
          Cannot seem to find the right background music? No worry, provide your content and we will personalize a music track for you.
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
                    placeholder="E.g. Generate a background music for my advertisement video."
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
        {!music && !isLoading && (
          <Empty label="No music generated." />
        )}
        {music && (
          
          <audio controls className="w-full mt-8 p-1">
            <p>Your Personalized Music is generated!</p>
            <source src={music}/>
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
}

export default MusicGeneratorPage;
