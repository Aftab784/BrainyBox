import { useState } from "react"
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react"
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

const validatePassword = (password: string): string[] => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (!@#$%^&*)"
    )
  }

  return errors
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
  const [showPassword, setShowPassword] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const validateForm = () => {
    const newErrors: FormErrors = {}
    const passwordErrors = validatePassword(password)

    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors.join("\n")
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

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="h-12 bg-white/20 border border-white/30 text-white placeholder:text-white/60 rounded-lg pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {passwordFocused && (
              <div className="absolute z-10 w-full p-4 mt-2 bg-white rounded-lg shadow-lg">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    {password.length >= 8 ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={
                        password.length >= 8 ? "text-green-500" : "text-red-500"
                      }
                    >
                      Password must be at least 8 characters long
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    {/[A-Z]/.test(password) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={
                        /[A-Z]/.test(password) ? "text-green-500" : "text-red-500"
                      }
                    >
                      Password must contain at least one uppercase letter
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    {/[0-9]/.test(password) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={
                        /[0-9]/.test(password) ? "text-green-500" : "text-red-500"
                      }
                    >
                      Password must contain at least one number
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    {/[!@#$%^&*]/.test(password) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={
                        /[!@#$%^&*]/.test(password) ? "text-green-500" : "text-red-500"
                      }
                    >
                      Password must contain at least one special character (!@#$%^&*)
                    </span>
                  </li>
                </ul>
              </div>
            )}
            {errors.password && !passwordFocused && (
              <p className="text-red-500 text-sm mt-1 whitespace-pre-line">
                {errors.password}
              </p>
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