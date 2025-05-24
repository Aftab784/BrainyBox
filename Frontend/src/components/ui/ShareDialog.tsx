import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./Dialog"
import { Button } from "./Button"
import { Input } from "./input"
import { toast } from "sonner"
import { Copy, Check } from "lucide-react"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  shareUrl: string
  onStopSharing: () => void
}

export function ShareDialog({ isOpen, onClose, shareUrl, onStopSharing }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("Link copied!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#881ae5] backdrop-blur-xl border-white/30">
        <DialogHeader>
          <DialogTitle className="text-white">Share Content</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={shareUrl}
              readOnly
              className="bg-white/20 border border-white/30 text-white"
            />
            <Button
              onClick={handleCopy}
              className={copied ? "bg-green-600" : "bg-white/10 text-white hover:bg-white/20"}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button
            onClick={onStopSharing}
            variant="destructive"
            className="w-full bg-red-500/80 hover:bg-red-500"
          >
            Stop Sharing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}