import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Textarea } from "./textarea";
import { Check, Edit2, Trash } from "lucide-react";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, content: string) => void;
  className?: string;
}

export function NoteCard({
  id,
  title,
  content,
  createdAt,
  onDelete,
  onUpdate,
  className,
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(content);
  const [tempContent, setTempContent] = useState(content);

  const handleSave = () => {
    setNoteContent(tempContent);
    onUpdate?.(id, tempContent);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "break-inside-avoid w-full",
        "transition-all duration-200",
        "rounded-xl border shadow-sm",
        "bg-gradient-to-br from-yellow-50 to-orange-50",
        "border-yellow-100 hover:border-yellow-200",
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-600"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <h3 className="font-medium text-sm text-gray-800">{title}</h3>
          </div>
          <div className="flex items-center gap-1">
            {isEditing ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSave}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Check className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete?.(id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isEditing ? (
          <Textarea
            value={tempContent}
            onChange={(e) => setTempContent(e.target.value)}
            className="min-h-[120px] bg-white/10 border-yellow-200 focus:border-yellow-300 resize-none"
            placeholder="Write your note here..."
          />
        ) : (
          <div className="whitespace-pre-wrap text-gray-700 text-sm">
            {noteContent}
          </div>
        )}

        <div className="mt-3 text-xs text-gray-500">
          Added on {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}