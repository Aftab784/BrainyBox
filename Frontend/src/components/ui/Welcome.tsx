import React, { useState } from 'react';
import { X, Check, Sparkles, BookOpen, Tag, Search } from 'lucide-react';
import { CreateContentModel } from './CreateContentModel';
import { toast } from 'sonner';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ContentItem {
  _id: string;
  title: string;
  type: string;
  link: string;
  userId: string;
  createdAt: string;
}

export function WelcomeGuide() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleAddContent = (newContent: ContentItem) => {
    toast.success('Content added successfully');
    // You might want to redirect to content page or update UI
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold mb-6">Welcome to Your Content Library 🎉</h2>
        
        <div className="space-y-8">
          <div className="bg-purple-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">
              Get Started with BrainBox
            </h3>
            <div className="text-left space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium mb-2">📱 Save Content</h4>
                  <p className="text-gray-600 text-sm">
                    Click the "Add Content" button to start saving content from various platforms
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium mb-2">🏷️ Organize</h4>
                  <p className="text-gray-600 text-sm">
                    Use tags and categories to keep your content organized
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium mb-2">🔍 Find & Filter</h4>
                  <p className="text-gray-600 text-sm">
                    Use the sidebar to filter content by platform or search
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium mb-2">🔄 Build Connections</h4>
                  <p className="text-gray-600 text-sm">
                    Connect related pieces of content using tags
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              PARA Method
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Projects</h4>
                <p className="text-gray-600 text-sm">
                  Active tasks and goals you're working on
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Areas</h4>
                <p className="text-gray-600 text-sm">
                  Long-term responsibilities to maintain
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Resources</h4>
                <p className="text-gray-600 text-sm">
                  Topics and interests you're learning about
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">Archives</h4>
                <p className="text-gray-600 text-sm">
                  Inactive items and completed projects
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Adding Content
          </button>
        </div>
      </div>

      <CreateContentModel
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleAddContent}
      />
    </div>
  );
}