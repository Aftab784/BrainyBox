import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function WelcomeGuide() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if it's the user's first visit
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setIsOpen(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to BrainBox! 🎉
        </h2>

        <div className="prose prose-purple">
          <p className="text-gray-600">
            Let's get you started with building your second brain.
          </p>

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900">Quick Start Guide</h3>
              <ul className="mt-2 space-y-2 text-gray-700">
                <li>➡️ Add content from your favorite platforms</li>
                <li>🏷️ Organize with tags and categories</li>
                <li>🔍 Easily search and filter your content</li>
                <li>🔄 Build connections between different pieces</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Key Features</h3>
              <ul className="mt-2 space-y-2 text-gray-700">
                <li>📱 Support for multiple platforms</li>
                <li>🎯 PARA organization method</li>
                <li>📊 Content analytics</li>
                <li>🤝 Easy sharing options</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}