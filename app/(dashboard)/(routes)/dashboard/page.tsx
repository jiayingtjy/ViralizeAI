//accessed using http://localhost:3000/dashboard 

"use client";

import { Music, Youtube, ArrowRight, MessageSquare, ScrollIcon, ImageIcon, VideoIcon, AreaChart, List, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
const tools = [

  {
    label:"Persona Analysis",
    icon:User,
    href:"/persona",
    color:"text-red-500",
    bgColor:"bg-red-800/10"
  },
  {
      label:"Hottest Tiktok Trends ?",
      icon:AreaChart,
      href:"/trends",
      color:"text-violet-500",
      bgColor:"bg-violet-500/10"
  },
  {
    label:"Thumbnail Image Generation",
    icon:ImageIcon,
    href:"/image",
    color:"text-emerald-500", 
    bgColor:"bg-emerald-500/10"
  },
  {
    label:"Idea & Content Generation",
    icon:ScrollIcon,
    href:"/content",
    color:"text-orange-500",
    bgColor:"bg-orange-500/10"
  },{
    label:"Music Generation & Scoring",
    icon:Music,
    href:"/music",
    color:"text-yellow-500"
  },
  {
    label:"Video Generation",
    icon: VideoIcon,
    href:"/video",
    color:"text-cyan-500"
  },
  {
      label:"ViralizeMe - All in One",
      icon: Youtube,
      href:"/viralizeai",
      color:"text-pink-500"
  }
]


const DashboardPage = () => {
  const router = useRouter();
  return (
    <div className="mb-8 space-y-4">
      <h2 className="text-2xl md:text-4xl font-bold text-center">
        Explore the power of ViralizeAI
      </h2>
      <p className="p-3 text-muted-foreground font-light text-sm md:text-lg text-center">
        Chat with our AI social media strategist
      </p>
      <p className="p-1 text-muted-foreground font-bold text-sm md:text-lg text-center">
        Generated personalized, high-quality content in a few seconds!
      </p>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) =>(
          <Card 
            onClick = {() => {router.push(tool.href)}}
            key={tool.href}
            className = "p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
              <div className = "flex items-center gap-x-4">
                <div className = {cn("p-2 w-fit rounded-md",tool.bgColor)}>
                  <tool.icon className = {cn("w-8 h-8",tool.color)}/>
                </div>
                <div className = "font-semibold">
                  {tool.label}
                </div>
              </div>
              <ArrowRight className = "w-5 h-5"/>
          </Card>
        )
      )}
      </div>
    </div>
  );
};

export default DashboardPage;
