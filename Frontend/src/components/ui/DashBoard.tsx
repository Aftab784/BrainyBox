import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { 
  LayoutDashboard, Layout, TrendingUp, Hash,
  ThumbsUp, MessageCircle, Bookmark, Share2
} from "lucide-react";
import { WelcomeGuide } from './Welcome';

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
    <Card className={`flex items-center gap-6 p-6 ${gradient} transition-transform hover:scale-[1.02]`}>
      <div className="rounded-full bg-white bg-opacity-20 p-4">
        {icon}
      </div>
      <div>
        <CardTitle className="text-xl text-white mb-2">{name}</CardTitle>
        <CardContent className="text-3xl font-bold text-white">{count}</CardContent>
      </div>
    </Card>
  );
}

// Simple StatsCard component definition
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
}

export function StatsCard({ title, value, icon, gradient }: StatsCardProps) {
  return (
    <Card className={`flex items-center gap-4 p-4 ${gradient}`}>
      <div className="rounded-full bg-white bg-opacity-20 p-2">
        {icon}
      </div>
      <div>
        <CardTitle className="text-white">{title}</CardTitle>
        <CardContent className="text-lg font-bold text-white">{value}</CardContent>
      </div>
    </Card>
  );
}

// Add new interface for guide cards
interface GuideCardProps {
  title: string;
  description: string;
  type: 'guide' | 'blog';
  icon: React.ReactNode;
}

// Add GuideCard component
function GuideCard({ title, description, type, icon }: GuideCardProps) {
  return (
    <Card className="p-6 transition-all duration-200 hover:shadow-lg border-2 border-purple-100">
      <CardHeader className="flex flex-row items-start gap-4 pb-4">
        <div className="p-3 rounded-lg bg-purple-50">
          {icon}
        </div>
        <div>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 mb-2 inline-block">
            {type === 'guide' ? 'How to Use' : 'Blog Post'}
          </span>
          <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-gray-600 whitespace-pre-line">
        {description}
      </CardContent>
    </Card>
  );
}

// Add interface for content items
interface ContentItem {
  id: string;
  platform: string;
  title: string;
  link: string;
  tags?: string[];
}

export function Dashboard() {
  const [platformCounts, setPlatformCounts] = useState<Record<string, number>>({
    youtube: 0,
    twitter: 0,
    linkedin: 0,
    instagram: 0,
    notion: 0,
    eraser: 0,
    excalidraw: 0
  });

  const [totalContent, setTotalContent] = useState(0);
  const [activeTags, setActiveTags] = useState(0);

  useEffect(() => {
    // Get content from localStorage or your API
    const savedContent = JSON.parse(localStorage.getItem('brainbox_content') || '[]') as ContentItem[];
    
    // Calculate platform counts
    const counts = savedContent.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate unique tags
    const uniqueTags = new Set(
      savedContent.flatMap(item => item.tags || [])
    );

    setPlatformCounts(counts);
    setTotalContent(savedContent.length);
    setActiveTags(uniqueTags.size);
  }, []);

  // Update platforms data to include default SVG icons
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
      icon: <svg className="w-4 h-4 text-white" /* LinkedIn SVG */ />
    },
    {
      id: 'instagram',
      name: 'Instagram',
      count: platformCounts.instagram || 0,
      gradient: 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500',
      icon: <svg className="w-4 h-4 text-white" /* Instagram SVG */ />
    },
    {
      id: 'notion',
      name: 'Notion',
      count: platformCounts.notion || 0,
      gradient: 'bg-gradient-to-r from-gray-800 to-gray-900',
      icon: <svg className="w-4 h-4 text-white" /* Notion SVG */ />
    },
    {
      id: 'eraser',
      name: 'Eraser',
      count: platformCounts.eraser || 0,
      gradient: 'bg-gradient-to-r from-[#EC2C40] to-[#00A9E5]',
      icon: <svg className="w-4 h-4 text-white" /* Eraser SVG */ />
    },
    {
      id: 'excalidraw',
      name: 'Excalidraw',
      count: platformCounts.excalidraw || 0,
      gradient: 'bg-gradient-to-r from-[#6965db] to-[#8783ff]',
      icon: <svg className="w-4 h-4 text-white" /* Excalidraw SVG */ />
    }
  ];

  // Add guides and blog posts
  const guides = [
    {
      title: "Getting Started with BrainBox",
      description: `BrainBox is your personal knowledge management system designed to help you:

• Organize content from different platforms in one place
• Build a searchable library of valuable information
• Create connections between different pieces of content
• Track engagement and impact of saved content

Quick Start:
1. Click "Add Content" to save from your favorite platforms
2. Use tags to organize and find content easily
3. Track engagement metrics to see what resonates
4. Build your second brain systematically`,
      type: 'guide' as const,
      icon: <LayoutDashboard className="w-6 h-6 text-purple-600" />
    },
    {
      title: "Building Your Second Brain",
      description: `Learn how to effectively build your digital knowledge base:

• Choose what content to save (quality over quantity)
• Organize content using the PARA method:
  - Projects: Current initiatives
  - Areas: Ongoing responsibilities
  - Resources: Topics of interest
  - Archives: Inactive items

Tips:
• Review and organize weekly
• Add your own insights to saved content
• Share and connect with others
• Use tags consistently`,
      type: 'blog' as const,
      icon: <Layout className="w-6 h-6 text-purple-600" />
    }
  ];

  return (
    <>
      <WelcomeGuide />
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <StatsCard
            title="Total Content"
            value={totalContent}
            icon={<Layout className="w-4 h-4 text-white" />}
            gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatsCard
            title="Active Tags"
            value={activeTags}
            icon={<Hash className="w-4 h-4 text-white" />}
            gradient="bg-gradient-to-r from-indigo-500 to-indigo-600"
          />
        </div>

        {/* Platform Stats - update to 4 columns */}
        <h2 className="text-xl font-semibold mb-6">Platform Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {platforms.map((platform) => (
            <PlatformCard 
              key={platform.id}
              id={platform.id}
              name={platform.name}
              count={platform.count}
              gradient={platform.gradient}
              icon={platform.icon}
            />
          ))}
        </div>
        
        {/* Guides and Blog Posts */}
        <h2 className="text-xl font-semibold mb-6">Guides & Resources</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {guides.map((guide) => (
            <GuideCard
              key={guide.title}
              {...guide}
            />
          ))}
        </div>
      </div>
    </>
  );
}