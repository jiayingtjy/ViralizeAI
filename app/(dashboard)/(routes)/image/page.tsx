"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { Download, ImageIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
import Image from "next/image";
import { Card, CardFooter } from "@/components/ui/card";

const ImageGenerationPage = () => {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  // Initialize the form with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Control validation of the form, cannot be empty
    defaultValues: {
      prompt: "", 
      amount: "1",
      resolution: "512x512",
    }
  });

  // Track the form's submission state
  const isLoading = form.formState.isSubmitting;

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]);
      console.log(values);

      const response = await axios.post("/api/image", values);
      console.log(response.data); // Debugging line

      if (Array.isArray(response.data)) {
        const urls = response.data.map((image: { url: string }) => image.url);
        setImages(urls);
      } else {
        console.error("Unexpected response format:", response.data);
      }
      form.reset();
    } catch (error: any) {
      // Handle errors
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Image Generation"
        description="Your personal AI image generator."
        icon={ImageIcon}
        iconColor="text-emerald-700"
        bgColor="bg-emerald-700/10"
      />
      <div className="flex items-left justify-center mb-4">
        <h3 className="bg-emerald-500/20 text-center text-emerald-700 font-bold py-2 px-6 rounded-lg mb-2 rounded-full">
          Cannot think of an attractive thumbnail for your video or advertisement for Tiktok Shop?
        </h3>
      </div>
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField name="prompt" render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-6">
                <FormControl className="m-0 p-0">
                  <Input
                    className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                    disabled={isLoading}
                    placeholder="E.g. An attractive thumbnail for my makeup remover ad to post on TikTok Shop."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )} />

            <FormField name="amount" control={form.control} render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-2">
                <Select 
                  disabled={isLoading} 
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {amountOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            <FormField name="resolution" control={form.control} render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-2">
                <Select 
                  disabled={isLoading} 
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {resolutionOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          <div className="p-20">
            <Loader />
          </div>
        )}
        {images.length === 0 && !isLoading && (
          <Empty label="No images generated yet." />
        )}

        <div className="  p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {images.map((src) => (
            <Card
              key={src}
              className="rounded-lg overflow-hidden"
            >
              <div className= "relative aspect-square">
                <Image
                  alt="Generated Image"
                  src={src}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardFooter className="p-2">
                <Button   
                  onClick = {() => window.open(src)}
                  variant="secondary" 
                  className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageGenerationPage;
