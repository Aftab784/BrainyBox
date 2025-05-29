import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { 
  LayoutDashboard, Layout, TrendingUp, Hash,
  ThumbsUp, MessageCircle, Bookmark, Share2, PlusCircle, Tag,
  Mail, MessageSquare, Send
} from "lucide-react";
import { WelcomeGuide } from './Welcome';
import { SidebarTrigger } from './app-sidebar';
import { Button } from './Button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Illustration } from '@/assets/illustration';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import api from '@/services/api';

// Define ContentItem interface for type safety
interface ContentItem {
  platform: string;
  tags?: string[];
  // Add other fields as needed, e.g. title, url, etc.
}

// Update PlatformStats interface
interface PlatformStats {
  id: string;
  name: string;
  count: number;
  gradient: string;
  icon: React.ReactNode;
}

// PlatformCard component for rendering platform stats
function PlatformCard({ name, count, gradient, icon }: PlatformStats) {
  return (
    <div className={cn(
      "rounded-[20px] border border-gray-100",
      "transition-all duration-300 transform hover:scale-105",
      "hover:shadow-xl hover:border-purple-200",
      gradient || "bg-white"
    )}>
      <div className="flex items-center gap-3 p-4">
        <div className="rounded-lg bg-white/20 p-2.5">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-white/90">
            {name}
          </h3>
          <p className="text-2xl font-bold text-white mt-0.5">
            {count}
          </p>
        </div>
      </div>
    </div>
  );
}

// Simple StatsCard component definition
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
}

function StatsCard({ title, value, icon, gradient }: StatsCardProps) {
  return (
    <div className={cn(
      "rounded-[20px] border border-white/30 bg-white/10 backdrop-blur-xl",
      "p-6 transition-all duration-200"
    )}>
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-white/20 p-3">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-white/80">{title}</h3>
          <p className="text-3xl font-bold text-white mt-1">
            {/* Show loading state */}
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// Add new interface for guide cards
interface GuideCardProps {
  title: string;
  description: React.ReactNode;
  type: 'guide' | 'blog';
  icon: React.ReactNode;
}

// Update the GuideCard component with better hover animations
function GuideCard({ title, description, type, icon }: GuideCardProps) {
  return (
    <div className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer border border-transparent hover:border-purple-100">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors duration-300">
            {icon}
          </div>
          <div className="space-y-2">
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100/50 text-purple-700 group-hover:bg-purple-200/50 transition-colors duration-300">
              {type === 'guide' ? 'Getting Started' : 'Tips & Tricks'}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
              {title}
            </h3>
          </div>
        </div>
        <div className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </div>
      </div>
    </div>
  );
}

// Update the guides data
const guides = [
 {
    title: "Why Use BrainBox?",
    description: (
      <div className="space-y-4">
        <p className="text-sm">Streamline your digital life with BrainBox - your all-in-one content hub.</p>
        <ul className="space-y-2">
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span className="text-sm">Save time by instantly finding key content</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span className="text-sm">Never lose valuable resources again</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span className="text-sm">Build your personal knowledge base</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span className="text-sm">Connect ideas across tools and platforms</span>
          </li>
        </ul>
        <p className="text-sm font-medium text-purple-600">Organize smarter, not harder.</p>
      </div>
    ),
    type: 'blog' as const,
    icon: <Layout className="w-5 h-5 text-purple-600" />
  },
  {
    title: "Getting Started with BrainBox",
    description: (
      <div className="space-y-4">
        <p className="text-sm">BrainBox helps you save and organize content from any platform in one place.</p>
        <ul className="space-y-2">
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span className="text-sm">Save content from your favorite platforms</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span className="text-sm">Organize with smart tagging</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span className="text-sm">Quick search and filter</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2" />
            <span className="text-sm">Track your knowledge growth</span>
          </li>
        </ul>
        <p className="text-sm font-medium text-purple-600">Get started in seconds - just click "Add Content" and start building your digital library.</p>
      </div>
    ),
    type: 'guide' as const,
    icon: <LayoutDashboard className="w-6 h-6 text-purple-600" />
  }
];

export function Dashboard() {
  const [platformCounts, setPlatformCounts] = useState<Record<string, number>>({
    youtube: 0,
    twitter: 0,
    linkedin: 0,
    instagram: 0,
    notion: 0,
    eraser: 0,
    excalidraw: 0,
    note: 0,
    medium: 0,
    github: 0,
    figma: 0,
    codepen: 0,
    googledocs: 0,
    spotify: 0,
    miro: 0,
    facebook: 0
  });
  const [totalContent, setTotalContent] = useState(0);
  const [activeTags, setActiveTags] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        interface ApiResponse {
          content: any[];
        }

        const response = await api.get<ApiResponse>('/api/v1/content', {
          headers: {
            token: localStorage.getItem('token')
          }
        });

        const content = response.data?.content || [];

        // Calculate platform counts
        const counts = content.reduce((acc: Record<string, number>, item: any) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        }, {});

        // Calculate unique tags
        const uniqueTags = new Set(
          content.flatMap((item: any) => item.tags || [])
        );

        setPlatformCounts(counts);
        setTotalContent(content.length);
        setActiveTags(uniqueTags.size);
      } catch (error) {
        console.error('Failed to fetch content:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Update StatsCard to show loading state
  function StatsCard({ title, value, icon, gradient }: StatsCardProps) {
    return (
      <div className={cn(
        "rounded-[20px] border border-white/30 bg-white/10 backdrop-blur-xl",
        "p-6 transition-all duration-200"
      )}>
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white/20 p-3">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/80">{title}</h3>
            <p className="text-3xl font-bold text-white mt-1">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                value
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Update platforms array to use dynamic counts
  const platforms: PlatformStats[] = [
    {
      id: 'youtube',
      name: 'YouTube',
      count: platformCounts.youtube || 0,
      gradient: 'bg-gradient-to-r from-red-500 to-red-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      )
    },
    {
      id: 'twitter',
      name: 'Twitter',
      count: platformCounts.twitter || 0,
      gradient: 'bg-gradient-to-r from-blue-400 to-blue-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      )
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      count: platformCounts.linkedin || 0,
      gradient: 'bg-gradient-to-r from-blue-600 to-blue-700',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
        </svg>
      )
    },
    {
      id: 'instagram',
      name: 'Instagram',
      count: platformCounts.instagram || 0,
      gradient: 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
        </svg>
      )
    },
    {
      id: 'notion',
      name: 'Notion',
      count: platformCounts.notion || 0,
      gradient: 'bg-gradient-to-r from-gray-800 to-gray-900',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.126 2.77.327 3.615 1.174.845.845 1.3 1.981 1.174 3.615l-.98 13.31c-.126 1.634-.327 2.77-1.174 3.615-.845.845-1.981 1.3-3.615 1.174l-13.31-.98C.774 23.2 0 22.426 0 21.471V2.529C0 1.574.774.8 1.729.8z"/>
        </svg>
      )
    },
    {
      id: 'eraser',
      name: 'Eraser',
      count: platformCounts.eraser || 0,
      gradient: 'bg-gradient-to-r from-[#EC2C40] to-[#00A9E5]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-white">
          <path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4C13.5 3.5 14.5 3.5 15 4L21 10C21.5 10.5 21.5 11.5 21 12L11 22" />
          <path d="M7 20L17 10" />
        </svg>
      )
    },
    {
      id: 'excalidraw',
      name: 'Excalidraw',
      count: platformCounts.excalidraw || 0,
      gradient: 'bg-gradient-to-r from-[#6965db] to-[#8783ff]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
          <path d="M18.277 6.321L12.375.419a1.429 1.429 0 0 0-2.021 0L4.452 6.321a1.429 1.429 0 0 0 0 2.021l5.902 5.902a1.429 1.429 0 0 0 2.021 0l5.902-5.902a1.429 1.429 0 0 0 0-2.021zM2.42 13.694l-1.17 1.17a1.429 1.429 0 0 0 0 2.021l5.902 5.902a1.429 1.429 0 0 0 2.021 0l1.17-1.17L4.44 15.714zm19.16 0l-5.902 5.902 1.17 1.17a1.429 1.429 0 0 0 2.021 0l5.902-5.902a1.429 1.429 0 0 0 0-2.021l-1.17-1.17z" />
        </svg>
      )
    },
    {
      id: 'facebook',
      name: 'Facebook',
      count: platformCounts.facebook || 0,
      gradient: 'bg-gradient-to-r from-[#1877F2] to-[#166CD9]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      id: 'medium',
      name: 'Medium',
      count: platformCounts.medium || 0,
      gradient: 'bg-gradient-to-r from-[#02B875] to-[#02B875]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
          <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
          </svg>
      )
    },
    {
      id: 'github',
      name: 'GitHub',
      count: platformCounts.github || 0,
      gradient: 'bg-gradient-to-r from-[#24292e] to-[#2b3137]',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
      </svg>
    )
  },
  {
    id: 'codepen',
    name: 'CodePen',
    count: platformCounts.codepen || 0,
    gradient: 'bg-gradient-to-r from-[#1E1F26] to-[#2F3138]',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
        <path d="M24 8.182l-.018-.087-.017-.05c-.01-.024-.018-.05-.03-.075-.003-.018-.015-.034-.02-.05l-.035-.067-.03-.05-.044-.06-.046-.045-.06-.045-.046-.03-.06-.044-.044-.04-.015-.02L12.58.19c-.347-.232-.796-.232-1.142 0L.453 7.502l-.015.015-.044.035-.06.05-.038.04-.05.056-.037.045-.05.06c-.02.017-.03.03-.03.046l-.05.06-.02.06c-.02.01-.02.04-.03.07l-.01.05C0 8.12 0 8.15 0 8.18v7.497c0 .044.003.09.01.135l.01.046c.005.03.01.06.02.086l.015.05c.01.027.016.053.027.075l.022.05c0 .01.015.04.03.06l.03.04c.015.01.03.04.045.06l.03.04.04.04c.01.013.01.03.03.03l.06.042.04.03.01.014 10.97 7.33c.164.12.375.163.57.163s.39-.06.57-.18l10.99-7.28.014-.01.046-.037.06-.043.048-.036.052-.058.033-.045.04-.06.03-.05.03-.07.016-.052.03-.077.015-.045.03-.08v-7.5c0-.05 0-.095-.016-.14l-.014-.045.044.003zm-11.99 6.28l-3.65-2.44 3.65-2.442 3.65 2.44-3.65 2.44zm-1.216-6.18l-4.473 3.003-3.612-2.415L12.183 3.2v5.09zm-6.343 3.75l2.53 1.694-2.53 1.69v-3.38zm6.343 3.75V19l-9.3-6.212 3.61-2.41 5.69 3.806zm2.432 0l5.69-3.805 3.61 2.41L12.615 19v-5.09zm6.343-3.75v3.38l-2.53-1.69 2.53-1.694z"/>
      </svg>
    )
  },
  {
    id: 'googledocs',
    name: 'Google Docs',
    count: platformCounts.googledocs || 0,
    gradient: 'bg-gradient-to-r from-[#4285F4] to-[#2A75F3]',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
        <path d="M14.727 6.727H0V24h17.455V9.455L14.727 6.727zM3.879 19.395v-2.969h9.697v2.969H3.879zm9.697-4.848H3.879v-2.97h9.697v2.97zm0-4.849H3.879V6.727h9.697v2.971zM24 6.727l-6.545-6.545v6.545H24z"/>
      </svg>
    )
  },
  {
    id: 'spotify',
    name: 'Spotify',
    count: platformCounts.spotify || 0,
    gradient: 'bg-gradient-to-r from-[#1DB954] to-[#1ED760]',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    )
  },
  {
    id: 'miro',
    name: 'Miro',
    count: platformCounts.miro || 0,
    gradient: 'bg-gradient-to-r from-[#FFD02F] to-[#FFC400]',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
        <path d="M17.392 0H6.608C2.958 0 0 2.958 0 6.608v10.784C0 21.042 2.958 24 6.608 24h10.784C21.042 24 24 21.042 24 17.392V6.608C24 2.958 21.042 0 17.392 0zM12 18.4c-3.6 0-6.4-2.8-6.4-6.4S8.4 5.6 12 5.6s6.4 2.8 6.4 6.4-2.8 6.4-6.4 6.4z"/>
      </svg>
    )
  }
].sort((a, b) => a.name.localeCompare(b.name));

  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (!email.trim() || !message.trim()) {
        toast.error('Please fill in all fields');
        return;
      }

      // For demonstration, just show success toast
      toast.success('Message sent successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form
      setEmail('');
      setMessage('');
      
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with purple background */}
      <div className="bg-[#881ae5]">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden text-white" />
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
            <StatsCard
              title="Total Content"
              value={totalContent}
              icon={<Layout className="w-5 h-5 text-white" />}
              gradient=""
            />
          </div>
        </div>
      </div>

      {/* Main content with white background */}
      <div className="max-w-7xl mx-auto px-4 mt-4 sm:px-6 lg:px-8">
        {/* Platform Summary */}
        <div className="bg-white rounded-[20px] shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Platform Summary
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {platforms.map((platform) => (
              <PlatformCard 
                key={platform.id}
                {...platform}
              />
            ))}
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-0">
          {/* Quick Actions Column */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-purple-50 text-gray-700 transition-all duration-300 ease-in-out transform hover:translate-x-1 hover:shadow-md">
                <PlusCircle className="w-5 h-5 text-purple-600 transition-transform duration-300 group-hover:scale-110" />
                <span>Add New Content</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-purple-50 text-gray-700 transition-all duration-300 ease-in-out transform hover:translate-x-1 hover:shadow-md">
                <Tag className="w-5 h-5 text-purple-600" />
                <span>Filter the Content</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-purple-50 text-gray-700 transition-all duration-300 ease-in-out transform hover:translate-x-1 hover:shadow-md">
                <Share2 className="w-5 h-5 text-purple-600" />
                <span>Share Collection</span>
              </button>
            </div>
          </div>

          {/* Blog Posts Column */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Blog Posts
            </h2>
            <div className="space-y-6">
              {guides.filter(g => g.type === 'blog').map((guide) => (
                <GuideCard
                  key={guide.title}
                  {...guide}
                />
              ))}
            </div>
          </div>

          {/* Guides Column */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Guides & Resources
            </h2>
            <div className="space-y-6">
              {guides.filter(g => g.type === 'guide').map((guide) => (
                <GuideCard
                  key={guide.title}
                  {...guide}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section with purple background */}
      <div className="bg-[#881ae5] mt-16">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">Home</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">Dashboard</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">Content Library</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">Settings</a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">Documentation</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">API Reference</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">Guides</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">Updates</a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Discord Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Twitter
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
              <p className="text-white/80 mb-4">Get the latest updates and news straight to your inbox.</p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-white text-purple-600 hover:bg-white/90"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/80">© 2024 BrainBox. All rights reserved.</p>
              <div className="flex items-center gap-8">
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}