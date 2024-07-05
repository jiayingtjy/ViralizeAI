"use client";

import { useAuth } from '@clerk/clerk-react';
import { auth } from "@clerk/nextjs/server";
import Link from 'next/link';
import { use } from 'react';
import TypewriterComponent from "typewriter-effect";
import { Button } from './ui/button';

export const LandingHero = () => {
  //const {isSignedIn }= useAuth();

  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>Your Personal <br></br> AI Social Media Strategist</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 p-2">
          <TypewriterComponent
            options={{
              strings: [
                "Chatbot.",
                "Idea & Content Generation.",
                "Image & Thumbnail Generation.",
                "Backgound Music Generation.",
                "Video Generation.",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="text-sm md:text-xl font-light text-zinc-400">
        Create TikTok content using ViralizeAI 10x faster and 10x more viral.
      </div>
      <div>
        <Link href={false ? "/dashboard" : "/sign-up"}>
          <Button variant="premium" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
            Start Generating For Free
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingHero;
