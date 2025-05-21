import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './Dialog';
import { Button } from './Button';
import { Input } from './input';
import { Label } from './label';

interface CreateContentModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: {
    title: string;
    type: string;
    link: string;
    tags: string[];
  }) => void;
}

export function CreateContentModel({ isOpen, onClose, onSubmit }: CreateContentModelProps) {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('youtube');
  const [link, setLink] = React.useState('');
  const [tags, setTags] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      type,
      link,
      tags: tags.split(',').map(tag => tag.trim())
    });
    
    // Reset form
    setTitle('');
    setType('youtube');
    setLink('');
    setTags('');
    onClose();
  };

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
              <option value="youtube" className="bg-white/30">YouTube</option>
              <option value="twitter" className="bg-white/30">Twitter</option>
              <option value="linkedin" className="bg-white/30">LinkedIn</option>
              <option value="instagram" className="bg-white/30">Instagram</option>
              <option value="notion" className="bg-white/30">Notion</option>
              <option value="excalidraw" className="bg-white/30">Excalidraw</option>
              <option value="eraser" className="bg-white/30">Eraser</option>
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
          
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-white">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags (comma-separated)"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <p className="text-sm text-white/70">Separate tags with commas</p>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-white/20">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto border-white text-white hover:bg-white/20 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="w-full sm:w-auto bg-white text-[#881ae5] hover:bg-[#f4f4f5] transition-colors"
            >
              Add Content
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}



