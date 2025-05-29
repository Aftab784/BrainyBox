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

// First update the SocialCardType type
type SocialCardType = 
  | 'youtube' 
  | 'twitter' 
  | 'linkedin' 
  | 'instagram' 
  | 'notion' 
  | 'excalidraw' 
  | 'eraser' 
  | 'note'
  | 'medium'
  | 'github'
  | 'figma'
  | 'codepen'
  | 'googledocs'
  | 'spotify'
  | 'miro'
  | 'facebook';

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
    value: "note" as SocialCardType,
    label: "Note",
    icon: Edit2,
    description: "Create a personal note"
  },
  {
    value: "facebook" as SocialCardType,
    label: "Facebook",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    description: "Share Facebook posts"
  },
  {
    value: "medium" as SocialCardType,
    label: "Medium",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
      </svg>
    ),
    description: "Share Medium blog posts"
  },
  {
    value: "github" as SocialCardType,
    label: "GitHub",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
      </svg>
    ),
    description: "Share GitHub repositories"
  },
  {
    value: "figma" as SocialCardType,
    label: "Figma",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539z"/>
      </svg>
    ),
    description: "Share Figma designs"
  },
  {
    value: "codepen" as SocialCardType,
    label: "CodePen",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 8.182l-.018-.087-.017-.05c-.01-.024-.018-.05-.03-.075-.003-.018-.015-.034-.02-.05l-.035-.067-.03-.05-.044-.06-.046-.045-.06-.045-.046-.03-.06-.044-.044-.04-.015-.02L12.58.19c-.347-.232-.796-.232-1.142 0L.453 7.502l-.015.015-.044.035-.06.05-.038.04-.05.056-.037.045-.05.06c-.02.017-.03.03-.03.046l-.05.06-.02.06c-.02.01-.02.04-.03.07l-.01.05C0 8.12 0 8.15 0 8.18v7.497c0 .044.003.09.01.135l.01.046c.005.03.01.06.02.086l.015.05c.01.027.016.053.027.075l.022.05c0 .01.015.04.03.06l.03.04c.015.01.03.04.045.06l.03.04.04.04c.01.013.01.03.03.03l.06.042.04.03.01.014 10.97 7.33c.164.12.375.163.57.163s.39-.06.57-.18l10.99-7.28.014-.01.046-.037.06-.043.048-.036.052-.058.033-.045.04-.06.03-.05.03-.07.016-.052.03-.077.015-.045.03-.08v-7.5c0-.05 0-.095-.016-.14l-.014-.045.044.003zm-11.99 6.28l-3.65-2.44 3.65-2.442 3.65 2.44-3.65 2.44zm-1.216-6.18l-4.473 3.003-3.612-2.415L12.183 3.2v5.09zm-6.343 3.75l2.53 1.694-2.53 1.69v-3.38zm6.343 3.75V19l-9.3-6.212 3.61-2.41 5.69 3.806zm2.432 0l5.69-3.805 3.61 2.41L12.615 19v-5.09zm6.343-3.75v3.38l-2.53-1.69 2.53-1.694zm0 0"/>
      </svg>
    ),
    description: "Share CodePen snippets"
  },
  {
    value: "googledocs" as SocialCardType,
    label: "Google Docs",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.727 6.727H0V24h17.455V9.455L14.727 6.727zM3.879 19.395v-2.969h9.697v2.969H3.879zm9.697-4.848H3.879v-2.97h9.697v2.97zm0-4.849H3.879V6.727h9.697v2.971zM24 6.727l-6.545-6.545v6.545H24z"/>
      </svg>
    ),
    description: "Share Google Docs"
  },
  {
    value: "spotify" as SocialCardType,
    label: "Spotify",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
    description: "Share Spotify content"
  },
  {
    value: "miro" as SocialCardType,
    label: "Miro",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.392 0H6.608C2.958 0 0 2.958 0 6.608v10.784C0 21.042 2.958 24 6.608 24h10.784C21.042 24 24 21.042 24 17.392V6.608C24 2.958 21.042 0 17.392 0zM12 18.4c-3.6 0-6.4-2.8-6.4-6.4S8.4 5.6 12 5.6s6.4 2.8 6.4 6.4-2.8 6.4-6.4 6.4z"/>
      </svg>
    ),
    description: "Share Miro boards"
  },
  {
    value: 'youtube' as SocialCardType,
    label: 'YouTube',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  {
    value: 'twitter' as SocialCardType,
    label: 'Twitter',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    )
  },
  {
    value: 'linkedin' as SocialCardType,
    label: 'LinkedIn',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  {
    value: 'instagram' as SocialCardType,
    label: 'Instagram',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
      </svg>
    )
  },
  {
    value: 'notion' as SocialCardType,
    label: 'Notion',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
      </svg>
    )
  },
  {
    value: 'excalidraw' as SocialCardType,
    label: 'Excalidraw',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.905 14.106c.162.276.162.614 0 .89l-4.728 8.148c-.185.31-.523.502-.89.502-.37 0-.707-.192-.892-.502L7.667 14.995c-.162-.276-.162-.614 0-.89l4.728-8.148c.185-.31.523-.502.89-.502.37 0 .707.192.892.502l4.728 8.15zM12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/>
      </svg>
    )
  },
  {
    value: 'eraser' as SocialCardType,
    label: 'Eraser',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.5 3L3 14.5V19h4.5L19 7.5L14.5 3zM7 17H5v-2l9-9l2 2l-9 9z"/>
      </svg>
    )
  }
].sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically



