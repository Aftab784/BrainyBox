import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { authService } from "@/services/auth.service"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!Name.trim()) {
      newErrors.Name = "Name is required"
    } else if (Name.length < 3) {
      newErrors.Name = "Name must be at least 3 characters"
    } else if (Name.length > 10) {
      newErrors.Name = "Name cannot exceed 10 characters"
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter"
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter"
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number"
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one special character"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await authService.signup(Name, email, password)
      toast.success("Account created successfully!")
      navigate("/login")
    } catch (error: any) {
      console.error("Signup error:", error)
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to create account"

      if (error.response?.data?.error && Array.isArray(error.response.data.error)) {
        // Handle backend validation errors
        const backendErrors = error.response.data.error
        const formattedErrors: FormErrors = {}

        backendErrors.forEach((err: string) => {
          if (err.toLowerCase().includes("name")) {
            formattedErrors.Name = err
          } else if (err.toLowerCase().includes("email")) {
            formattedErrors.email = err
          } else if (err.toLowerCase().includes("password")) {
            formattedErrors.password = err
          } else {
            formattedErrors.general = err
          }
        })

        setErrors(formattedErrors)
      } else {
        setErrors({ general: errorMessage })
      }

      toast.error(errorMessage)
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
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-lg",
                errors.Name && "border-red-500"
              )}
              required
            />
            {errors.Name && (
              <p className="text-red-500 text-sm">{errors.Name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-lg",
                errors.email && "border-red-500"
              )}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-lg",
                errors.password && "border-red-500"
              )}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm text-center">{errors.general}</p>
          )}

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