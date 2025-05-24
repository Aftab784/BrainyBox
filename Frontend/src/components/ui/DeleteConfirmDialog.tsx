import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./Dialog"
import { Button } from "./Button"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#881ae5] backdrop-blur-xl border-white/30">
        <DialogHeader>
          <DialogTitle className="text-white">Delete Content</DialogTitle>
          <DialogDescription className="text-white/70">
            Are you sure you want to delete "{title}"?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white/10 text-white hover:bg-white/20"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-500/80 hover:bg-red-500"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}