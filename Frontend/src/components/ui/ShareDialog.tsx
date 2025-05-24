import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./Dialog";
import { Input } from "./input";
import { toast } from "sonner";
import { Copy, X } from "lucide-react";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareDialog({ isOpen, onClose }: ShareDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [shareHash, setShareHash] = useState<string | null>(null);

  // Generate link when dialog opens
  useEffect(() => {
    if (isOpen) {
      handleGenerateLink();
    }
  }, [isOpen]);

  const handleGenerateLink = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('http://localhost:2000/api/v1/brainybox/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ share: true })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate share link');
      }

      if (data.hash) {
        setShareHash(data.hash);
        toast.success('Share link generated successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Share link generation failed:', error);
      toast.error(error.message || 'Failed to generate share link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSharing = async () => {
    try {
      await fetch('http://localhost:2000/api/v1/brainybox/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({ share: false })
      });
      
      onClose();
      toast.success('Stopped sharing content');
    } catch (error) {
      console.error('Failed to stop sharing:', error);
      toast.error('Failed to stop sharing');
    }
  };

  const handleCopy = async () => {
    if (!shareHash) return;
    
    const shareLink = `${window.location.origin}/shared/${shareHash}`;
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[425px] p-6 bg-[#881ae5] text-white rounded-2xl border-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Share Content
          </h2>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Input
              value={`http://localhost:5173/shared/${shareHash || 'undefined'}`}
              readOnly
              className="flex-1 bg-white/10 border-white/20 text-white rounded-lg"
            />
            <button
              onClick={handleCopy}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              title="Copy link"
            >
              <Copy className="w-5 h-5 text-white" />
            </button>
          </div>

          <button
            onClick={handleStopSharing}
            disabled={isLoading}
            className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            Stop Sharing
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}