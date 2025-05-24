import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { User, LogOut, BookOpen, LayoutGrid, LayoutList } from "lucide-react";
import { ShareIcon } from "@/icons/ShareIcon";
import { PlusIcon } from "@/icons/PlusIcon";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Dashboard } from "../components/ui/DashBoard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { SocialCard, MasonryGrid } from "@/components/ui/Card";
import { CreateContentModel } from "../components/ui/CreateContentModel";
import { ShareContentModal } from "../components/ui/ShareContent";
import { WelcomeGuide } from "@/components/ui/Welcome";
import { Button } from "@/components/ui/Button";
import { AtomIcon as PlatformIcon } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { contentService } from '@/services/content.service';

// Define types and interfaces
type SocialCardType =
  | "youtube"
  | "twitter"
  | "instagram"
  | "linkedin"
  | "notion"
  | "eraser"
  | "excalidraw";

interface ContentItem {
  _id: string;
  type: SocialCardType;
  link: string;
  title: string;
  userId: string;
}

const ContentPage: React.FC = () => {
  // State management
  const [content, setContent] = useState<ContentItem[]>([]);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [columns, setColumns] = useState(3);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDashboardView, setIsDashboardView] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch content when component mounts
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await contentService.getMyContent();
        // Assert the type of response to access content safely
        if (response && typeof response === "object" && "content" in response) {
          setContent((response as { content: ContentItem[] }).content);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
        toast.error('Failed to load your content');
      }
    };

    fetchContent();
  }, []);

  // Handlers
  const handleDashboardClick = () => {
    setIsDashboardView(true);
    setActiveFilter(null);
  };

  const handleContentLibraryClick = () => {
    setIsDashboardView(false);
    setActiveFilter(null);
  };

  const handleFilterChange = (filter: string | null) => {
    setActiveFilter(filter);
    setIsDashboardView(false);
  };

  const handleAddContent = (newContent: {
    title: string;
    type: string;
    link: string;
  }) => {
    setContent((prevContent) => [
      {
        _id: Date.now().toString(), // Temporary ID until refresh
        ...newContent,
        type: newContent.type as SocialCardType,
        userId: 'current-user'
      },
      ...prevContent
    ]);
  };

  // Filter content
  const filteredContent = React.useMemo(() => {
    if (!activeFilter) return content;
    return content.filter((item) => item.type === activeFilter);
  }, [content, activeFilter]);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
          onDashboardClick={handleDashboardClick}
          isDashboardActive={isDashboardView}
          onContentLibraryClick={handleContentLibraryClick}
        />
        <SidebarInset className="flex-1">
          {isDashboardView ? (
            <Dashboard />
          ) : (
            <div className="min-h-screen bg-gray-50">
              {/* Header Section */}
              <div className="bg-gradient-to-br from-[#881ae5] to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex items-center gap-3">
                      <SidebarTrigger className="md:hidden text-white" />
                      <h1 className="text-xl font-bold truncate">Content Library</h1>
                    </div>

                    {/* Middle Section - Layout Controls (Desktop Only) */}
                    {!isMobile && (
                      <div className="hidden md:flex items-center gap-2">
                        <div className="flex bg-white/10 rounded-lg overflow-hidden">
                          <button
                            className={`px-2.5 py-1.5 flex items-center gap-1.5 text-sm ${
                              layout === "grid"
                                ? "bg-white/20 text-white"
                                : "text-white/80 hover:bg-white/10"
                            }`}
                            onClick={() => setLayout("grid")}
                          >
                            <LayoutGrid className="w-4 h-4" />
                            Grid
                          </button>
                          <button
                            className={`px-2.5 py-1.5 flex items-center gap-1.5 text-sm ${
                              layout === "list"
                                ? "bg-white/20 text-white"
                                : "text-white/80 hover:bg-white/10"
                            }`}
                            onClick={() => setLayout("list")}
                          >
                            <LayoutList className="w-4 h-4" />
                            List
                          </button>
                        </div>

                        {layout === "grid" && (
                          <div className="flex bg-white/10 rounded-lg overflow-hidden">
                            {[2, 3].map((col) => (
                              <button
                                key={col}
                                className={`px-3 py-1.5 text-sm ${
                                  columns === col
                                    ? "bg-white/20 text-white"
                                    : "text-white/80 hover:bg-white/10"
                                }`}
                                onClick={() => setColumns(col)}
                              >
                                {col}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setIsShareModalOpen(true)}
                        className="bg-white/10 text-white hover:bg-white/20 transition-colors h-9"
                        size="sm"
                      >
                        <ShareIcon className="w-4 h-4" />
                        <span className="ml-1.5 hidden sm:inline">Share</span>
                      </Button>
                      
                      <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-white text-[#881ae5] hover:bg-white/90 transition-colors h-9"
                        size="sm"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span className="ml-1.5 hidden sm:inline">Add Content</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="max-w-7xl mx-auto p-4">
                {filteredContent.length === 0 && !activeFilter ? (
                  <WelcomeGuide />
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                    {isMobile || layout === "list" ? (
                      <div className="flex flex-col gap-4">
                        {filteredContent.map((item, index) => (
                          <SocialCard
                            key={item._id}
                            type={item.type}
                            link={item.link}
                            title={item.title}
                            className="w-full"
                          />
                        ))}
                      </div>
                    ) : (
                      <MasonryGrid 
                        columns={isMobile ? 1 : columns} 
                        gap={isMobile ? 4 : 6}
                      >
                        {filteredContent.map((item, index) => (
                          <SocialCard
                            key={index}
                            type={item.type}
                            link={item.link}
                            title={item.title}
                          />
                        ))}
                      </MasonryGrid>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </SidebarInset>
      </div>
      
      <CreateContentModel
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleAddContent}
      />
      <ShareContentModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
      <ToastContainer />
    </SidebarProvider>
  );
};

// SocialCard wrapper component
const SocialCardWrapper = ({ type, link, title, tags, className, ...props }: any) => {
  function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
  }
  
  return (
    <Card 
      className={cn("break-inside-avoid w-full transition-all duration-200", className)} 
      {...props}
    >
      <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-2">
        <CardTitle className="flex items-center gap-2 flex-1 min-w-0">
          <PlatformIcon type={type} />
          <span className="truncate">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video sm:aspect-auto">
          {/* Content rendering */}
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 rounded-md bg-purple-100 text-purple-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentPage;