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

interface AppProps {
  children?: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  const [layout, setLayout] = React.useState<"grid" | "list">("grid");
  const [columns, setColumns] = React.useState(3);
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isDashboardView, setIsDashboardView] = React.useState(false);

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
            <div className="flex flex-col gap-4 p-2 sm:gap-6 sm:p-4 md:p-6">
              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center w-full">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="md:hidden" />
                  <h1 className="text-base font-bold md:text-2xl">
                    Content Library
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                  {!isMobile && (
                    <>
                      <div className="hidden md:flex border rounded-lg overflow-hidden">
                        <button
                          className={`px-4 py-2 flex items-center justify-center text-sm ${
                            layout === "grid"
                              ? "bg-blue-100 text-[#881ae5]"
                              : "bg-white text-gray-600"
                          }`}
                          onClick={() => setLayout("grid")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="mr-1"
                          >
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                          </svg>
                          Grid
                        </button>
                        <button
                          className={`px-4 py-2 flex items-center justify-center text-sm ${
                            layout === "list"
                              ? "bg-blue-100 text-[#881ae5]"
                              : "bg-white text-gray-600"
                          }`}
                          onClick={() => setLayout("list")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="mr-1"
                          >
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" />
                            <line x1="3" y1="12" x2="3.01" y2="12" />
                            <line x1="3" y1="18" x2="3.01" y2="18" />
                          </svg>
                          List
                        </button>
                      </div>
                      {layout === "grid" && (
                        <div className="hidden lg:flex border rounded-lg overflow-hidden">
                          {[2, 3].map((col) => (
                            <button
                              key={col}
                              className={`px-4 py-2 text-sm ${
                                columns === col
                                  ? "bg-blue-100 text-[#881ae5]"
                                  : "bg-white text-gray-600"
                              }`}
                              onClick={() => setColumns(col)}
                            >
                              {col}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  
                  <Button
                    color="lightpurple"
                    className="flex-1 sm:flex-none items-center justify-center"
                  >
                    <ShareIcon className="w-4 h-4" />
                    <span className="ml-2 hidden sm:inline">Share All</span>
                  </Button>
                  
                  <Button
                    color="primary"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex-1 sm:flex-none items-center justify-center"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span className="ml-2 hidden sm:inline">Add Content</span>
                  </Button>
                </div>
              </div>

              {/* Show WelcomeGuide when there's no content */}
              {filteredContent.length === 0 && !activeFilter ? (
                <WelcomeGuide />
              ) : (
                <div className="w-full">
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
          )}
        </SidebarInset>
      </div>
      <CreateContentModel
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleAddContent}
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