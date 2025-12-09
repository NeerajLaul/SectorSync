import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Lock, Mail, Eye, EyeOff, Sparkles, Github, Chrome } from "lucide-react";

interface SignInPageProps {
  onSignIn: (email: string, password: string) => void;
  onSignUp: () => void;
  onSkip?: () => void;
}

export function SignInPage({ onSignIn, onSignUp, onSkip }: SignInPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("https://sectorsync-production.up.railway.app/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signin failed");

      onSignIn(email, password); // Notify parent app
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(true);
    // Simulate social sign-in
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSignIn(`user@${provider}.com`, "social-auth");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 flex items-center justify-center py-12 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-amber-500/5 to-pink-500/5 dark:from-amber-500/10 dark:to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 backdrop-blur-sm mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl mb-2">Welcome to SectorSync</h1>
          <p className="text-muted-foreground">
            Sign in to access your methodology recommendations
          </p>
        </div>

        {/* Main Sign In Card */}
        <Card className="glass-card border-white/20 dark:border-white/10 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-700"
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <button
                type="button"
                className="text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-950 px-3 text-xs text-muted-foreground">
              or continue with
            </span>
          </div>

          {/* Social Sign In */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                window.location.href = "/api/auth/google";
              }}
              className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10"
            >
              <Chrome className="h-4 w-4 mr-2" />
              Google
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                window.location.href = "/api/auth/github";
              }}
              className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>

          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button
              type="button"
              onClick={onSignUp}
              className="text-primary hover:underline"
            >
              Sign up
            </button>
          </div>

          {/* Skip Option (Optional) */}
          {onSkip && (
            <>
              <Separator className="my-6" />
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onSkip}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Continue without signing in
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Benefits Footer */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Sign in to unlock:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10">
              Save assessments
            </Badge>
            <Badge variant="secondary" className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10">
              Track progress
            </Badge>
            <Badge variant="secondary" className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10">
              Team insights
            </Badge>
          </div>
        </div>

        {/* Privacy Note */}
        <p className="mt-6 text-xs text-center text-muted-foreground">
          By signing in, you agree to our{" "}
          <button className="text-primary hover:underline">Terms</button> and{" "}
          <button className="text-primary hover:underline">Privacy Policy</button>
        </p>
      </div>
    </div>
  );
}
