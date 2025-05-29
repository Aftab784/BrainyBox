import * as React from 'react';
import { Dialog, DialogContent } from './Dialog';
import { Button } from './Button';
import { X, Copy } from 'lucide-react';
import { contentService } from '@/services/content.service';
import { toast } from 'sonner';

interface ShareResponse {
  hash: string;
}

interface ShareContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId?: string;
}

export function  ShareContentModal({ isOpen, onClose }: ShareContentModalProps) {
  const [shareLink, setShareLink] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Generate share link when modal opens
  React.useEffect(() => {
    if (isOpen) {
      generateShareLink();
    }
  }, [isOpen]);

  const generateShareLink = async () => {
    try {
      setLoading(true);
      const response = await contentService.shareContent(true) as ShareResponse;
      if (response && response.hash) {
        const url = `${window.location.origin}/shared/${response.hash}`;
        setShareLink(url);
      }
    } catch (error) {
      toast.error("Failed to generate share link");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success("Link copied!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleStopSharing = async () => {
    try {
      await contentService.shareContent(false);
      setShareLink("");
      onClose();
      toast.success("Sharing stopped");
    } catch (error) {
      toast.error("Failed to stop sharing");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 bg-[#881ae5] border-none rounded-3xl w-[90vw] max-w-[400px]">
        {/* Single close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/80 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          Share Content
        </h2>

        <div className="space-y-4">
          {/* Share link input with copy button */}
          <div className="bg-white/20 rounded-xl flex items-center overflow-hidden">
            <input
              value={shareLink}
              readOnly
              className="flex-1 px-4 py-3 bg-transparent border-none text-white focus:outline-none placeholder:text-white/50"
              placeholder={loading ? "Generating link..." : ""}
            />
            <button
              onClick={handleCopy}
              className="px-4 py-3 text-white hover:bg-white/10 transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>

          {/* Stop sharing button */}
          <Button
            onClick={handleStopSharing}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 font-medium rounded-xl transition-colors"
          >
            Stop Sharing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


