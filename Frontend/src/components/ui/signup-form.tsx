import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormErrors {
  Name?: string
  email?: string
  password?: string
  general?: string
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [Name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = () => {
    const newErrors: FormErrors = {}
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await authService.signup(Name, email, password)
      toast.success(response.message || "Account created successfully!")
      navigate("/login")
    } catch (error: any) {
      console.error("Signup error:", error)
      setErrors({
        general: error.response?.data?.message || "Failed to create account"
      })
      toast.error(error.response?.data?.message || "Failed to create account")
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
        <h1 className="text-3xl font-bold text-white">Join BrainyBox</h1>
        <p className="text-base text-white/80">
          Create your second brain account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-lg"
            required
          />

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-lg"
            required
          />

          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-lg"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        {errors.general && (
          <p className="text-red-500 text-sm text-center">{errors.general}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-lg bg-gradient-to-r from-[#e57a7a] to-[#ef8247] hover:opacity-90 text-white font-semibold"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>

        <p className="text-center text-white/80">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#ef8247] hover:text-[#e57a7a] transition-colors font-semibold"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}