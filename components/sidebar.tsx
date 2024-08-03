'use client';

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";

import { cn } from "@/lib/utils";
import { ScrollIcon, Music, House,Camera,List, Youtube, MessageCircleMoreIcon, AreaChart,MessageCircleQuestionIcon, ImageIcon, Video, User, TerminalSquare, Scale, Handshake, Users} from "lucide-react";
import { usePathname } from "next/navigation";

const montserrat = Montserrat({weight:"600", subsets:["latin"]});

//generate an array to handle all routes
const routes = [
    {
        label:"Home",
        icon:House,
        href:"/dashboard",
        color:"text-sky-500"
    },
    {
        label:"Persona Analysis",
        icon:User,
        href:"/persona",
        color:"text-red-500"
    },
    {
        label:"Hottest Tiktok Trends ?",
        icon:AreaChart,
        href:"/trends",
        color:"text-violet-500"
    },{
        label:"Thumbnail Image Generation",
        icon:ImageIcon,
        href:"/image",
        color:"text-emerald-500"
    },{
        label:"Idea & Content Generation",
        icon:ScrollIcon,
        href:"/content",
        color:"text-orange-500"
    },{
        label:"Music Generation & Scoring",
        icon:Music,
        href:"/music",
        color:"text-yellow-500"
    },
    {
        label:"Video Generation",
        icon: Video,
        href:"/video",
        color:"text-cyan-500"
    },
    {
        label:"ViralizeAI - All in One",
        icon: Youtube,
        href:"/viralizeai",
        color:"text-pink-500"
    },
    {
        label:"About Us",
        icon: Users,
        href:"/about-us",
        color:"text-pink-200"
    },
    {
        label:"Terms of Service",
        icon: Handshake,
        href:"/terms-of-service",
        color:"text-pink-200"
    },
    {
        label:"Privacy Policy",
        icon: Scale,
        href:"/privacy-policy",
        color:"text-pink-200"
    }
]
const Sidebar = () =>{
    const pathname = usePathname();
    return (
        <div className = "space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
           <div className ="px-3 py-2 flex-1">
                <Link href="/dashboard" className = "flex items-center pl-3 mb-14">
                    <div className="relative w-12 h-12 mr-4">
                        <Image fill alt="Logo" src="/logo.png" className="object-contain"/>
                    </div>
                    <h1 className = {cn("text-2xl font-bold",montserrat)}>
                        ViralizeMe
                        <p className = {cn("text-sm text-pink-300 font-bold ",montserrat)}>
                         A Smarter Tiktok Studio
                    </p>
                    </h1>
                </Link>
                <div className = "space-y-1">
                    {routes.map((route) => (
                        <Link 
                            href={route.href}
                            key = {route.href}
                            className = {
                                cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                    pathname == route.href? "text-white bg-white/10":"text-zinc-400")}>
                        
                            <div className = "flex items-center flex-1">
                                <route.icon className = {cn("h-5 w-5 mr-3", route.color)}/>
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>                    
                

           </div>
        </div>
    );
}

export default Sidebar;