import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Brainylogo } from "@/assets/logog";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add your login logic here
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#881ae5] to-purple-700">
      {/* Remove the img tag since we're using CSS gradient */}

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Section - Branding */}
          <div className="text-white space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <Brainylogo />
              <h1 className="text-4xl font-bold tracking-tight">BrainyBox</h1>
            </div>
            <p className="text-xl text-white/80">Cloud for Your Thoughts</p>
          </div>

          {/* Right Section - Login Form */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-white text-center">
                Sup brainiac
              </h2>
              <p className="text-white/80 text-center">
                Ready to vibe with your second brain?
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/20 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/20 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
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
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Submit"}
                </Button>
                <div className="text-center text-white/80 text-sm">
                  Already have an account?{" "}
                  <Link to="/signup" className="text-white hover:underline">
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}