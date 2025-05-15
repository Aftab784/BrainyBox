import { Button } from "./components/ui/Button";
import * as React from "react";
import {
  SocialCard,
  MasonryGrid
} from "./components/ui/Card";
import { ShareIcon } from "./icons/ShareIcon";
import { PlusIcon } from "./icons/PlusIcon";


interface AppProps {
  children?: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  const [layout, setLayout] = React.useState<"grid" | "list">("grid");
  const [columns, setColumns] = React.useState(3);

  return (
    
    <div className="flex flex-col gap-6 p-6 max-w-screen-xl mx-auto">
      {/* Header with title, layout controls, and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Social Media Content Library</h1>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Layout controls */}
          <div className="flex border rounded-lg overflow-hidden">
            <button 
              className={`px-3 py-2 flex items-center ${layout === "grid" ? "bg-blue-100 text-[#881ae5]" : "bg-white text-gray-600"}`}
              onClick={() => setLayout("grid")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              Grid
            </button>
            <button 
              className={`px-3 py-2 flex items-center ${layout === "list" ? "bg-blue-100 text-[#881ae5]" : "bg-white text-gray-600"}`}
              onClick={() => setLayout("list")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
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
          
          {/* Column selector (visible only in grid mode) */}
          {layout === "grid" && (
            <div className="flex border rounded-lg overflow-hidden">
              {[2, 3, 4].map((col) => (
                <button
                  key={col}
                  className={`px-3 py-2 ${columns === col ? "bg-blue-100 text-[#881ae5]" : "bg-white text-gray-600"}`}
                  onClick={() => setColumns(col)}
                >
                  {col}
                </button>
              ))}
            </div>
          )}
          
          {/* Action buttons */}
          <Button color="lightpurple" className="ml-2">
            <ShareIcon /> Share All
          </Button>
          <Button color="primary">
            <PlusIcon /> Add Content
          </Button>
          
        </div>
      </div>



      {/* Content display area */}
      <div className="w-full">
        {layout === "grid" ? (
          <MasonryGrid columns={columns} gap={4}>
            <SocialCard
              type="youtube"
              link="https://www.youtube.com/watch?v=Oo3qsxihXqY"
              title="YouTube Video"
              tags={["youtube", "video", "tutorial"]}
            />

            <SocialCard
              type="twitter"
              link="https://x.com/akshaymarch7/status/1922638544444514481"
              title="Twitter Post"
              tags={["twitter", "social"]}
            />

            <SocialCard
              type="instagram"
              link="https://www.instagram.com/p/DGTG2mltawB/"
              title="Instagram Post"
              tags={["instagram", "photo"]}
            />
            
            <SocialCard
              type="linkedin"
              link="https://www.linkedin.com/feed/update/urn:li:activity:7327669312922476544/"
              title="LinkedIn Post"
              tags={["linkedin", "professional"]}
            />

            

           

            

            
          </MasonryGrid>
        ) : (
          <div className="flex flex-col gap-4">
            <SocialCard
              type="youtube"
              link="https://www.youtube.com/watch?v=Oo3qsxihXqY"
              title="YouTube Video"
              tags={["youtube", "video", "tutorial"]}
              className="w-full"
            />

            <SocialCard
              type="twitter"
              link="https://x.com/akshaymarch7/status/1922638544444514481"
              title="Twitter Post"
              tags={["twitter", "social"]}
              className="w-full"
            />

            <SocialCard
              type="instagram"
              link="https://www.instagram.com/p/DGTG2mltawB/"
              title="Instagram Post"
              tags={["instagram", "photo"]}
              className="w-full"
            />
            
            


            <SocialCard
              type="instagram"
              link="https://www.instagram.com/reel/DJob7Bcyi14/?utm_source=ig_web_copy_link"
              title="Instagram Reel"
              tags={["instagram", "reel", "video"]}
              className="w-full"
            />
            
           
          </div>
        )}
      </div>
    </div>
  );
};

export default App;