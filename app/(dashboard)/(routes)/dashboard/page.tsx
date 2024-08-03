"use client";

import { tools } from "./constants";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface PersonaData {
  avatar_url_100: string;
  username: string;
  likes_count: number;
  follower_count: number;
  following_count: number;
  tags: string[];
}

const DashboardPage = () => {
  const router = useRouter();
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);

  useEffect(() => {
    const fetchPersonaData = async () => {
      try {
        const response = await fetch("/api/persona", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data from TikTok API");
        }

        const responseJson: PersonaData = await response.json();
        console.log("API Response: ", responseJson);
        setPersonaData(responseJson);
      } catch (error) {
        console.error("Error fetching persona data:", error);
      }
    };

    fetchPersonaData();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-grow mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mt-4">
          Explore the power of ViralizeAI
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Chat with our AI social media strategist
        </p>
        <p className="text-muted-foreground font-bold text-sm md:text-lg text-center">
          Generated personalized, high-quality content in a few seconds!
        </p>
        {personaData && (
          <>
            <section className="py-10">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                  className="shadow-lg rounded-2xl py-10 px-10 xl:py-16 xl:px-20 bg-gray-50 flex items-center justify-between flex-col gap-16 lg:flex-row"
                >
                  <div className="w-full lg:w-60 flex flex-col items-center lg:items-start">
                    <h2 className="font-manrope text-4xl font-bold text-gray-900 mb-4 text-center lg:text-left">
                      {personaData.username}
                    </h2>
                    <Image
                      className="w-32 h-32 bg-gray-300 rounded-full mb-4"
                      src={personaData.avatar_url_100}
                      alt={personaData.username}
                      width={100}
                      height={100}
                    />
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      {personaData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="w-full lg:w-4/5">
                    <div className="flex flex-col flex-1 gap-10 lg:gap-0 lg:flex-row lg:justify-between">
                      {[personaData.likes_count,
                        personaData.follower_count,
                        personaData.following_count].map((stat, index) => (
                        <div key={index} className="block">
                          <div className="font-manrope font-bold text-4xl text-indigo-600 mb-3 text-center lg:text-left">
                            {stat}
                          </div>
                          <span className="text-gray-900 text-center block lg:text-left">
                            {["Like Count", "Follower Count", "Following Count"][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
        <div className="px-4 md:px-20 lg:px-32 mb-4 mt-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Card
                onClick={() => { router.push(tool.href) }}
                key={tool.href}
                className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-8 h-8", tool.color)} />
                  </div>
                  <div className="font-semibold">
                    {tool.label}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
