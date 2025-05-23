import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './Dialog';
import { Button } from './Button';
import { Input } from './input';
import { Label } from './label';
import { toast } from 'sonner';
import api from '@/services/api';

interface ContentItem {
  _id: string; // Changed from id to _id to match MongoDB
  title: string;
  type: string;
  link: string;
  userId: string;
  createdAt: string;
}

interface CreateContentModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: ContentItem) => void;
}

export function CreateContentModel({ isOpen, onClose, onSubmit }: CreateContentModelProps) {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('youtube');
  const [link, setLink] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/v1/content', {
        title,
        type,
        link
      }, {
        headers: {
          token: localStorage.getItem('token')
        }
      });

      if (response.data) {
        toast.success('Content added successfully');
        onSubmit(response.data as ContentItem); // The backend should return the complete content item
        
        // Reset form
        setTitle('');
        setType('youtube');
        setLink('');
        onClose();
      }
    } catch (error: any) {
      console.error('Failed to add content:', error);
      toast.error(error.response?.data?.message || 'Failed to add content');
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal is closed
  React.useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setType('youtube');
      setLink('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6 bg-[#881ae5] text-white">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Add New Content
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter content title"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type" className="text-white">Type</Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white text-[#881ae5] px-3 py-2 appearance-none cursor-pointer hover:bg-[#f4f4f5] transition-colors"
              required
            >
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="notion">Notion</option>
              <option value="excalidraw">Excalidraw</option>
              <option value="eraser">Eraser</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="link" className="text-white">Link</Label>
            <Input
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter content link"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              required
            />
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-white/20">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto border-white text-white hover:bg-white/20 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-white text-[#881ae5] hover:bg-[#f4f4f5] transition-colors"
            >
              {loading ? 'Adding...' : 'Add Content'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}



