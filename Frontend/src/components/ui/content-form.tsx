import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/services/api"

export function ContentForm() {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [type, setType] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/api/v1/content', {
        title,
        link,
        type
      }, {
        headers: {
          token: localStorage.getItem('token')
        }
      })

      const data = response.data as { message?: string }
      toast.success(data.message || "Content added successfully!")
      // Reset form
      setTitle("")
      setLink("")
      setType("")
    } catch (error: any) {
      console.error("Content creation error:", error)
      toast.error(
        error.response?.data?.message ||
        "Failed to add content. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Content</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white/20 border border-white/30 text-white placeholder:text-white/60"
            required
          />
          
          <Input
            placeholder="Content Link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="bg-white/20 border border-white/30 text-white placeholder:text-white/60"
            required
          />
          
          <Select 
            value={type} 
            onValueChange={setType}
          >
            <SelectTrigger className="bg-white/20 border border-white/30 text-white">
              <SelectValue placeholder="Select Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="notion">Notion</SelectItem>
              <SelectItem value="eraser">Eraser</SelectItem>
              <SelectItem value="excalidraw">Excalidraw</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[#e57a7a] to-[#ef8247] hover:opacity-90 text-white font-semibold py-2.5"
          >
            {loading ? "Adding Content..." : "Add Content"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}