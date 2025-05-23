import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Your login logic here
      // After successful login:
      toast.success("Successfully logged in!", {
        position: "top-center",
        duration: 2000,
      })
    } catch (error) {
      toast.error("Login failed. Please try again.")
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
          <h1 className="text-3xl font-bold text-white">Sup brainiac</h1>
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

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-white/80 hover:text-white"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-[#e57a7a] to-[#ef8247] hover:opacity-90 text-white font-semibold py-2.5"
          >
            Submit
          </Button>

          <div className="text-center text-white/80 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#FF8E53] hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
