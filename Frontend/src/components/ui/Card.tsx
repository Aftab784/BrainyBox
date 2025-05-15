import * as React from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement | null) => void;
      };
    };
    instgrm?: {
      Embeds: {
        process: (element?: HTMLElement | null) => void;
      };
    };
  }
}

const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const extractTweetId = (url: string): string | null => {
  const regExp = /^https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const extractInstagramId = (url: string): string | null => {
  const regExp = /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const extractLinkedInPostId = (url: string): string | null => {
  const regExp = /^https?:\/\/(?:www\.)?linkedin\.com\/(?:posts|feed\/update)\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

// Platform icons
const PlatformIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "youtube":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-600">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
      );
    case "twitter":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
        </svg>
      );
    case "instagram":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-pink-600">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    case "linkedin":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-700">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      );
    case "notion":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800">
          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.793.934 1.5v16.377c0 1.167-.373 1.634-1.68 1.727l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
        </svg>
      );
    case "eraser":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <path d="M20 14c.5.5.5 1 0 1.5l-4 4a1 1 0 0 1-1.5 0L2 7c-.5-.5-.5-1 0-1.5l4-4a1 1 0 0 1 1.5 0Z"/>
          <path d="M10 4 4 10"/>
          <path d="m20 9-9 9"/>
          <path d="m21 15-2 2"/>
        </svg>
      );
    case "excalidraw":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M15 2v4h4"/>
          <path d="M13.4 14.8 19 9.2"/>
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      );
  }
};

interface EmbedProps {
  type: "youtube" | "twitter" | "instagram" | "linkedin" | "notion" | "eraser" | "excalidraw";
  link: string;
  title?: string;
}

const Embed: React.FC<EmbedProps> = ({ type, link, title }) => {
  const embedRef = React.useRef<HTMLDivElement>(null);
  // Removed unused error state
  
  // Handle Excalidraw popup error
  React.useEffect(() => {
    if (type === "excalidraw") {
      // Add encryption key parameter to Excalidraw URL if needed
      if (!link.includes("encryptionKey=")) {
        const urlObj = new URL(link);
        // Adding a default encryption key of 22 characters
        urlObj.searchParams.append("encryptionKey", "0123456789abcdefghijkl");
        link = urlObj.toString();
      }
    }
  }, [type, link]);

  React.useEffect(() => {
    if (type === "twitter") {
      // Clean up any existing Twitter script to avoid conflicts
      const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
      
      script.onload = () => {
        if (window.twttr && embedRef.current) {
          window.twttr.widgets.load(embedRef.current);
        }
      };
      
      return () => {
        if (existingScript) {
          document.body.appendChild(existingScript);
        }
      };
    }
    
    if (type === "instagram") {
      // Clean up any existing Instagram script to avoid conflicts
      const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        if (window.instgrm && embedRef.current) {
          window.instgrm.Embeds.process(embedRef.current);
        }
      };
      
      return () => {
        if (existingScript) {
          document.body.appendChild(existingScript);
        }
      };
    }
  }, [type, link]);

  switch (type) {
    case "youtube": {
      const videoId = extractVideoId(link);
      return videoId ? (
        <div className="w-full aspect-video">
          <iframe
            className="w-full h-full rounded-xl"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title || "YouTube video player"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : <div className="text-red-500">Invalid YouTube URL</div>;
    }
    case "twitter": {
      const tweetId = extractTweetId(link);
      return tweetId ? (
        <div ref={embedRef} className="w-full min-h-[200px]">
          <blockquote className="twitter-tweet" data-conversation="none">
            <a href={`https://twitter.com/x/status/${tweetId}`}>{title || "Loading tweet..."}</a>
          </blockquote>
        </div>
      ) : (
        <div className="text-red-500">Invalid Twitter URL</div>
      );
    }
    case "instagram": {
      const postId = extractInstagramId(link);
      return postId ? (
        <div ref={embedRef} className="w-full overflow-hidden">
          <blockquote
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink={`https://www.instagram.com/p/${postId}/`}
            style={{
              maxWidth: "540px",
             
              width: "100%",
              margin: "0 auto",
            }}
          >
            <a href={link}>{title || "Instagram Post"}</a>
          </blockquote>
        </div>
      ) : (
        <div className="text-red-500">Invalid Instagram URL</div>
      );
    }
    case "linkedin": {
      return (
        <div className="w-full min-h-[200px] border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-blue-700">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span className="font-bold text-lg">LinkedIn Post</span>
          </div>
          <p className="text-gray-700 mb-4">{title || "View this post on LinkedIn"}</p>
          <a href={link} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white py-2 px-4 rounded-md inline-block hover:bg-blue-700 transition-colors">View on LinkedIn</a>
        </div>
      );
    }
    case "notion": {
      return (
        <div className="w-full min-h-[250px] border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800">
              <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.793.934 1.5v16.377c0 1.167-.373 1.634-1.68 1.727l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
            </svg>
            <span className="font-bold text-lg">Notion Document</span>
          </div>
          <p className="text-gray-700 mb-4">{title || "View this document on Notion"}</p>
          <a href={link} target="_blank" rel="noopener noreferrer" className="bg-black text-white py-2 px-4 rounded-md inline-block hover:bg-gray-800 transition-colors">Open in Notion</a>
        </div>
      );
    }
    case "eraser": {
      return (
        <div className="w-full min-h-[250px] border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <path d="M20 14c.5.5.5 1 0 1.5l-4 4a1 1 0 0 1-1.5 0L2 7c-.5-.5-.5-1 0-1.5l4-4a1 1 0 0 1 1.5 0Z"/>
              <path d="M10 4 4 10"/>
              <path d="m20 9-9 9"/>
              <path d="m21 15-2 2"/>
            </svg>
            <span className="font-bold text-lg">Eraser Whiteboard</span>
          </div>
          <p className="text-gray-700 mb-4">{title || "View this whiteboard on Eraser"}</p>
          <a href={link} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white py-2 px-4 rounded-md inline-block hover:bg-blue-700 transition-colors">Open in Eraser</a>
        </div>
      );
    }
    case "excalidraw": {
      // Add encryption key to URL to resolve the popup issue
      let modifiedLink = link;
      if (!link.includes("encryptionKey=")) {
        const urlObj = new URL(link);
        // Adding a default encryption key of 22 characters
        urlObj.searchParams.append("encryptionKey", "0123456789abcdefghijkl");
        modifiedLink = urlObj.toString();
      }
      
      return (
        <div className="w-full aspect-video">
          <iframe
            src={modifiedLink}
            className="w-full h-full rounded-xl"
            allowFullScreen
            loading="lazy"
            title={title || "Excalidraw Whiteboard"}
          />
        </div>
      );
    }
    default:
      return <div className="text-red-500">Unsupported embed type.</div>;
  }
};

export { Embed };

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("bg-white rounded-xl border border-gray-300 p-4 shadow-sm", className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center justify-between gap-2 mb-4", className)} {...props} />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("text-lg font-semibold flex items-center gap-2", className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex-1", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center justify-between mt-4 gap-4 text-sm text-gray-500", className)} {...props} />
  );
}

interface SocialCardProps extends React.ComponentProps<"div"> {
  type: EmbedProps["type"];
  link: string;
  title: string;
  tags?: string[];
  hideControls?: boolean;
}

function SocialCard({ 
  type, 
  link, 
  title, 
  tags = [], 
  hideControls = false,
  className, 
  children, 
  ...props 
}: SocialCardProps) {
  const formattedDate = React.useMemo(() => {
    const date = new Date();
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  }, []);

  return (
    <Card className={cn("break-inside-avoid mb-4", className)} {...props}>
      <CardHeader>
        <CardTitle>
          <PlatformIcon type={type} />
          <span className="capitalize">{title}</span>
        </CardTitle>
        {!hideControls && (
          <div className="flex gap-3 text-gray-400">
            <button title="Share" className="hover:text-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </button>
            
            <button title="Delete" className="hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Embed type={type} link={link} title={title} />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <span>Added on {formattedDate}</span>
      </CardFooter>
    </Card>
  );
}

// Add the MasonryGrid component to Card.tsx
const MasonryGrid: React.FC<{ 
  children: React.ReactNode; 
  columns?: number; 
  gap?: number; 
  className?: string 
}> = ({ 
  children, 
  columns = 3, 
  gap = 4, 
  className = "" 
}) => {
  const [currentColumns, setCurrentColumns] = React.useState(columns);
  
  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCurrentColumns(1); // Mobile: 1 column
      } else if (width < 1024) {
        setCurrentColumns(2); // Tablet: 2 columns
      } else {
        setCurrentColumns(columns); // Desktop: use provided columns
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns]);
  
  return (
    <div 
      className={cn("w-full", className)}
      style={{
        columnCount: currentColumns,
        columnGap: `${gap * 0.25}rem`,
      }}
    >
      {children}
    </div>
  );
};

export {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  SocialCard,
  MasonryGrid
};