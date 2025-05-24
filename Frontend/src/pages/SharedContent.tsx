import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SocialCard } from '@/components/ui/Card';
import { Loader2, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type SocialCardType = "youtube" | "twitter" | "instagram" | "linkedin" | "notion" | "eraser" | "excalidraw";

interface ContentItem {
  _id: string;
  type: SocialCardType;
  link: string;
  title: string;
  createdAt: string;
}

interface SharedContent {
  username: string;
  content: ContentItem[];
}

export function SharedContentPage() {
  const { hash } = useParams();
  const [data, setData] = useState<SharedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchSharedContent = async () => {
      if (!hash) {
        setError('Invalid share link');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Clean the hash parameter and use the correct endpoint
        const cleanHash = hash.replace('~', '');
        const response = await fetch(`http://localhost:2000/api/v1/brainybox/~${cleanHash}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch shared content');
        }

        if (!result.content || !Array.isArray(result.content)) {
          throw new Error('Invalid content format');
        }

        setData(result);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching shared content:', error);
        setError(error.message || 'Failed to load content');
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#881ae5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Content Not Available</h1>
          <p className="text-gray-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#881ae5]">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">Content Library</h1>
            
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex items-center bg-white/10 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-1.5 ${viewMode === 'grid' ? 'bg-white/20' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4 text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-1.5 ${viewMode === 'list' ? 'bg-white/20' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {data?.content && data.content.length > 0 ? (
          <div className={`
            grid gap-6
            ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}
          `}>
            {data.content.map((item) => (
              <div key={item._id} className={`
                bg-white/5 rounded-xl p-4
                ${viewMode === 'list' ? 'flex items-start space-x-4' : ''}
              `}>
                <SocialCard
                  id={item._id}
                  type={item.type}
                  link={item.link}
                  title={item.title}
                  createdAt={item.createdAt}
                  hideControls
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/60 py-12">
            No content available
          </div>
        )}
      </div>
    </div>
  );
}