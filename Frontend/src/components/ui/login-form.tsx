import { useState } from "react"
import { useNavigate, Link } from "react-router-dom" // Add Link import
import { toast } from "sonner"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.login(email, password)

      if (response.token) {
        toast.success(response.message || "Login successful!")
        navigate("/content")
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data)

      // Show specific error message from backend
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      className={cn(
        "rounded-[20px] border border-white/30 bg-white/10 backdrop-blur-xl w-full max-w-[400px] px-8 py-10",
        className
      )}
      {...props}
    >
      <CardContent className="p-0">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
          <p className="text-base text-white/80">
            Ready to vibe with your second brain?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-lg"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-lg"
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[#e57a7a] to-[#ef8247] hover:opacity-90 text-white font-semibold py-2.5"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Add this signup link section */}
          <div className="text-center mt-2">
            <p className="text-white/80">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#ef8247] hover:text-[#e57a7a] transition-colors font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
