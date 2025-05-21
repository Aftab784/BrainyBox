import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './Dialog';
import { Button } from './Button';
import { Input } from './input';
import { Label } from './label';
import { Share2, Copy, Link, Check } from 'lucide-react';

interface ShareContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareContentModal({ isOpen, onClose }: ShareContentModalProps) {
  const [copied, setCopied] = React.useState(false);

  const shareLink = "https://brainbox.app/share/collection/xyz123";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6 bg-[#881ae5] text-white">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Collection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div>
            <Label className="text-white mb-2 block">Collection Link</Label>
            <div className="flex gap-2">
              <Input
                value={shareLink}
                readOnly
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/50"
              />
              <Button
                onClick={handleCopyLink}
                className="bg-white text-[#881ae5] hover:bg-[#f4f4f5] flex gap-2 items-center transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-white mb-2 block">Share on platforms</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full bg-white text-[#881ae5] hover:bg-[#f4f4f5] transition-colors"
                onClick={() => window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(shareLink))}
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                className="w-full bg-white text-[#881ae5] hover:bg-[#f4f4f5] transition-colors"
                onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(shareLink))}
              >
                LinkedIn
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white mb-2 block">Visibility</Label>
            <select
              className="w-full rounded-md border border-white/20 bg-white text-[#881ae5] px-3 py-2 appearance-none cursor-pointer hover:bg-[#f4f4f5] transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="public" className="bg-white">Public - Anyone with the link</option>
              <option value="private" className="bg-white">Private - Only you</option>
            </select>
          </div>
        </div>

        <DialogFooter className="flex justify-end pt-4 border-t border-white/20 mt-6">
          <Button
            onClick={onClose}
            className="bg-white text-[#881ae5] hover:bg-[#f4f4f5] transition-colors"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}