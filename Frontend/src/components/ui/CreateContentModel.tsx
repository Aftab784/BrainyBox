import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './Dialog';
import { Button } from './Button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea'; // Import Textarea component
import { toast } from 'sonner';
import api from '@/services/api';
import { Edit2 } from 'lucide-react'; // Import Edit2 icon
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

type SocialCardType = 'youtube' | 'twitter' | 'linkedin' | 'instagram' | 'notion' | 'excalidraw' | 'eraser' | 'note';

interface ContentType {
  value: SocialCardType;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface CreateContentModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newContent: { title: string; type: string; link: string }) => void;
  selectedType?: SocialCardType | null;
}

export function CreateContentModal({
  isOpen,
  onClose,
  onSubmit,
  selectedType = null
}: CreateContentModelProps) {
  const [title, setTitle] = React.useState('');
  const [type, setType] = React.useState('youtube');
  const [link, setLink] = React.useState('');
  const [content, setContent] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        type,
        link: type === 'note' ? content : link, // Use content for notes
        content: type === 'note' ? content : link // Store content separately
      };

      const response = await api.post('/api/v1/content', payload, {
        headers: {
          token: localStorage.getItem('token')
        }
      });

      toast.success('Content added successfully!');
      onSubmit(payload); // Pass the full payload
      
      // Reset form
      setTitle('');
      setType('youtube');
      setLink('');
      setContent('');
      onClose();
    } catch (error: any) {
      console.error('Failed to add content:', error);
      toast.error(error.response?.data?.message || 'Failed to add content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#881ae5] border-none text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Add New Content
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label className="text-white">Title</Label>
            <div className="relative">
              {type === "note" && (
                <Edit2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              )}
              <Input
                placeholder="Enter content title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={cn(
                  "bg-white/20 border-white/30 text-white placeholder:text-white/60",
                  type === "note" && "pl-10"
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Type</Label>
            <Select
                          value={type}
                          onValueChange={(value: string) => setType(value as SocialCardType)}
                        >
                          <SelectTrigger className="bg-white/20 border-white/30 text-white">
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                          <SelectContent>
                            {contentTypes.map((type: ContentType) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  {type.icon && <type.icon className="h-4 w-4" />}
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
          </div>

          {/* Note Content Area */}
          {type === "note" ? (
            <div className="space-y-2">
              <Label className="text-white">Content</Label>
              <Textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] bg-white/20 border-white/30 text-white placeholder:text-white/60 resize-none"
                required
              />
              <div className="text-xs text-white/60">
                Characters: {content.length}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-white">Link</Label>
              <Input
                placeholder="Enter content link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-white text-[#881ae5] hover:bg-white/90"
            >
              {loading ? 'Adding...' : 'Add Content'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const contentTypes: ContentType[] = [
  {
    value: "note",
    label: "Note",
    icon: Edit2,
    description: "Create a personal note"
  },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'notion', label: 'Notion' },
  { value: 'excalidraw', label: 'Excalidraw' },
  { value: 'eraser', label: 'Eraser' },
];



