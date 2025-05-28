import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/Button"
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
        toast.success("Login successful!")
        navigate("/content")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error("Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "w-full max-w-[400px] rounded-[20px] border border-white/30 bg-white/10 backdrop-blur-xl p-8",
        className
      )}
      {...props}
    >
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
          className="h-12 bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-lg"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-lg"
          required
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-lg bg-gradient-to-r from-[#e57a7a] to-[#ef8247] hover:opacity-90 text-white font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center text-white/80">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#ef8247] hover:text-[#e57a7a] transition-colors font-semibold"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}