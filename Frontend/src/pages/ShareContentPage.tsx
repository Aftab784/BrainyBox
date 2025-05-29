import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SocialCard, MasonryGrid } from '@/components/ui/Card';
import { Grid, List } from 'lucide-react';
import { contentService } from '@/services/content.service';

interface ContentItem {
  _id: string;
  type: "youtube" | "twitter" | "instagram" | "linkedin" | "notion" | "eraser" | "excalidraw";
  link: string;
  title: string;
  createdAt: string;
}

interface SharedContent {
  username: string;
  content: ContentItem[];
}

interface ApiResponse {
  username: string;
  content: ContentItem[];
}

export function SharedContentPage() {
  const { hash } = useParams<{ hash: string }>();
  const [data, setData] = useState<SharedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [columns, setColumns] = useState(3);
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

  // Update the fetch URL to match the backend route
  useEffect(() => {
    const fetchSharedContent = async () => {
      if (!hash) {
        setError('Invalid share link');
        setIsLoading(false);
        return;
      }

      try {
        const result = await contentService.getSharedContent(hash) as ApiResponse;
        console.log('Received data:', result); // Debug log
        
        if (!result) {
          throw new Error('Failed to fetch shared content');
        }

        // Ensure content is an array
        const content = Array.isArray(result.content) ? result.content : [];
        console.log('Formatted content:', content); // Debug log
        
        const formattedContent = content.map((item: ContentItem) => ({
          ...item,
          createdAt: new Date(item.createdAt || Date.now()).toISOString()
        }));

        setData({
          username: result.username,
          content: formattedContent
        });
      } catch (error: any) {
        console.error('Error fetching shared content:', error);
        setError(
          error.response?.data?.message || 
          error.message || 
          'Failed to load content'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedContent();
  }, [hash]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#881ae5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#881ae5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Content Not Available</h1>
          <p className="text-gray-200">{error || 'Content not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#881ae5] to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section */}
            <div>
              <h1 className="text-xl font-bold truncate">Content Library</h1>
              {data.username && (
                <p className="text-sm text-white/80 mt-1">
                  Shared by {data.username}
                </p>
              )}
            </div>

            {/* Middle Section - Layout Controls (Desktop Only) */}
            {!isMobile && (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex bg-white/10 rounded-lg overflow-hidden">
                  <button
                    className={`px-2.5 py-1.5 flex items-center gap-1.5 text-sm ${
                      viewMode === "grid"
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                    Grid
                  </button>
                  <button
                    className={`px-2.5 py-1.5 flex items-center gap-1.5 text-sm ${
                      viewMode === "list"
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:bg-white/10"
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                    List
                  </button>
                </div>

                {viewMode === "grid" && (
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
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          {isMobile || viewMode === "list" ? (
            <div className="flex flex-col gap-4">
              {data.content.map((item) => (
                <SocialCard
                  key={item._id}
                  id={item._id}
                  type={item.type}
                  link={item.link}
                  content={item.link}
                  title={item.title}
                  createdAt={item.createdAt}
                  hideControls
                  className="w-full"
                />
              ))}
            </div>
          ) : (
            <MasonryGrid 
              columns={isMobile ? 1 : columns} 
              gap={isMobile ? 4 : 6}
            >
              {data.content.map((item) => (
                 <SocialCard
                  key={item._id}
                  id={item._id}
                  type={item.type}
                  link={item.link}
                  content={item.link}
                  title={item.title}
                  createdAt={item.createdAt}
                  hideControls
                  className="w-full"
                />
              ))}
            </MasonryGrid>
          )}

          {data.content.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No content available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}