import { format } from "date-fns"
import { Card, CardContent } from "./Card"
import { Button } from "./Button"
import { Share2 as ShareIcon } from "lucide-react"

interface ContentCardProps {
  title: string
  link: string
  type: string
  createdAt: string
  onShare: () => void
}

export function ContentCard({ title,  createdAt, onShare }: ContentCardProps) {
  return (
    <Card className="w-full bg-white/5 border-white/10">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="text-white/60 hover:text-white"
          >
            <ShareIcon className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-white/60 mb-4">
          {format(new Date(createdAt), "MMM d, yyyy")}
        </p>
        {/* ...existing embed code... */}
      </CardContent>
    </Card>
  )
}