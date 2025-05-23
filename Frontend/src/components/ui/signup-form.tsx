import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [Name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.signup(
        Name,
        email,
        password
      )
      toast.success(response.message || "Account created successfully!")
      navigate("/login")
    } catch (error: any) {
      console.error("Signup error:", error.response?.data)
      toast.error(
        error.response?.data?.message ||
          "Signup failed. Please try again."
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
          <h1 className="text-3xl font-bold text-white">Join BrainyBox</h1>
          <p className="text-base text-white/80">
            Create your second brain account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <Input
            type="text"
            placeholder="Name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-lg"
            required
          />
         
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
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <p className="text-center text-white/80">
            Already have an account?{" "}
            <Button
              variant="link"
              className="text-white hover:text-[#ef8247]"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}