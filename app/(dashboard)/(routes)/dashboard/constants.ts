import {
  Music,
  Youtube,
  ArrowRight,
  ScrollIcon,
  ImageIcon,
  VideoIcon,
  AreaChart,
  User,
  LucideLineChart,
} from "lucide-react";

export const tools = [
  {
    label: "Persona Analysis",
    icon: User,
    href: "/persona",
    color: "text-red-500",
    bgColor: "bg-red-800/10",
  },
  {
    label: "Hottest Tiktok Trends ?",
    icon: AreaChart,
    href: "/trends",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Thumbnail Image Generation",
    icon: ImageIcon,
    href: "/image",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Idea & Content Generation",
    icon: ScrollIcon,
    href: "/content",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    label: "Music Generation & Scoring",
    icon: Music,
    href: "/music",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: "/video",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    label: "Video Analysis",
    icon: LucideLineChart,
    href: "/video-analysis",
    color: "text-blue-500",
  },
  {
    label: "ViralizeMe - All in One",
    icon: Youtube,
    href: "/viralizeai",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];
