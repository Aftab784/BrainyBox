import { Button } from "./components/ui/Button";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/Card";
import { SocialCard, MasonryGrid } from "./components/ui/Card";
import { ShareIcon } from "./icons/ShareIcon";
import { PlusIcon } from "./icons/PlusIcon";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { CreateContentModel } from "./components/ui/CreateContentModel";
import { AtomIcon as PlatformIcon } from "lucide-react";
import { Dashboard } from "./components/ui/DashBoard";
// import { Embed } from "./components/ui/Embed";
// TODO: Uncomment and update the path below if Embed exists elsewhere
// import { Embed } from "@/components/ui/Embed";
import { WelcomeGuide } from './components/ui/Welcome';
import { ShareContentModal } from './components/ui/ShareContent';
import { BookOpen, LayoutGrid, LayoutList } from 'lucide-react';

interface AppProps {
  children?: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  const [layout, setLayout] = React.useState<"grid" | "list">("grid");
  const [columns, setColumns] = React.useState(3);
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isDashboardView, setIsDashboardView] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const handleDashboardClick = () => {
    setIsDashboardView(true);
    setActiveFilter(null);
  };

  const handleContentLibraryClick = () => {
    setIsDashboardView(false);
    setActiveFilter(null);
  };

  const handleFilterChange = (filter: string | null) => {
    setIsDashboardView(false);
    setActiveFilter(filter);
  };

  // Define allowed types for 
  
  type SocialCardType =
    | "youtube"
    | "twitter"
    | "instagram"
    | "linkedin"
    | "notion"
    | "eraser"
    | "excalidraw";

  interface ContentItem {
    type: SocialCardType;
    link: string;
    title: string;
    tags?: string[];
  }

  // Sample content array - replace with your actual content
  const [content, setContent] = React.useState<ContentItem[]>([
    {
      type: "youtube",
      link: "https://www.youtube.com/watch?v=Oo3qsxihXqY",
      title: "YouTube Video",
      tags: ["youtube", "video", "tutorial"],
    },
    {
      type: "linkedin",
      link: "https://www.youtube.com/watch?v=Oo3qsxihXqY",
      title: "YouTube Video",
      tags: ["youtube", "video", "tutorial"],
    },
    {
      type: "twitter",
      link: "https://x.com/amritwt/status/1924821724497109484",
      title: "Twitter Post",
      tags: ["twitter", "tweet", "harkirat"],
    },
    {
      type: "instagram",
      link: "https://www.instagram.com/p/DJb2iAStc0u/?utm_source=ig_web_copy_link",
      title: "CS50",
      tags: ["davidjmalan", "insta", "cs50"],
    },
    {
      type: "notion",
      link: "https://www.youtube.com/watch?v=Oo3qsxihXqY",
      title: "YouTube Video",
      tags: ["youtube", "video", "tutorial"],
    },
    {
      type: "excalidraw",
      link: "https://www.youtube.com/watch?v=Oo3qsxihXqY",
      title: "YouTube Video",
      tags: ["youtube", "video", "tutorial"],
    },
    {
      type: "eraser",
      link: "https://www.youtube.com/watch?v=Oo3qsxihXqY",
      title: "YouTube Video",
      tags: ["youtube", "video", "tutorial"],
    },
    {
      type: "eraser",
      link: "https://www.youtube.com/watch?v=Oo3qsxihXqY",
      title: "YouTube Video",
      tags: ["youtube", "video", "tutorial"],
    },
    {
      type: "eraser",
      link: "https://www.youtube.com/watch?v=Oo3qsxihXqY",
      title: "YouTube Video",
      tags: ["youtube", "video", "tutorial"],
    },
    // ... more content items
  ]);

  const handleAddContent = (newContent: {
    title: string;
    type: string;
    link: string;
    tags: string[];
  }) => {
    setContent((prevContent) => [
      ...prevContent,
      {
        ...newContent,
        type: newContent.type as SocialCardType,
      },
    ]);
  };

  // Filter content based on active filter
  const filteredContent = React.useMemo(() => {
    if (!activeFilter) return content;
    return content.filter((item) => item.type === activeFilter);
  }, [content, activeFilter]);

  // Improve mobile detection with a custom hook
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update the layout section
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
              {/* Updated Header Section */}
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
                            key={index}
                            type={item.type}
                            link={item.link}
                            title={item.title}
                            tags={item.tags}
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
                            tags={item.tags}
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
    </SidebarProvider>
  );
};

// Update your SocialCard usage to use the new Card components:
const SocialCardWrapper = ({ type, link, title, tags, className, ...props }: any) => {
  function cn(...classes: (string | undefined | false | null)[]): string {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <Card className={cn("break-inside-avoid w-full transition-all duration-200", className)} {...props}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-2">
        <CardTitle className="flex items-center gap-2 flex-1 min-w-0">
          <PlatformIcon type={type} />
          <span className="truncate">{title}</span>
        </CardTitle>
        {/* ... rest of your card header content ... */}
      </CardHeader>
      <CardContent>
        <div className="aspect-video sm:aspect-auto">
         
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

export default App;