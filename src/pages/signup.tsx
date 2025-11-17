import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Lock, Mail, Eye, EyeOff, Sparkles, Github, Chrome, User, Building } from "lucide-react";

interface SignUpPageProps {
  onSignUp: (data: SignUpData) => void;
  onSignIn: () => void;
  onSkip?: () => void;
}

export interface SignUpData {
  fullName: string;
  email: string;
  company?: string;
  password: string;
}

export function SignUpPage({ onSignUp, onSignIn, onSkip }: SignUpPageProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    
    setPasswordMatch(true);
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSignUp({ fullName, email, company, password });
    setIsLoading(false);
  };

  const handleSocialSignUp = async (provider: string) => {
    setIsLoading(true);
    // Simulate social sign-up
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSignUp({
      fullName: `User from ${provider}`,
      email: `user@${provider}.com`,
      password: "social-auth",
    });
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
          <h1 className="text-3xl mb-2">Join SectorSync</h1>
          <p className="text-muted-foreground">
            Create your account and start finding the perfect methodology
          </p>
        </div>

        {/* Main Sign Up Card */}
        <Card className="glass-card border-white/20 dark:border-white/10 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10"
              />
            </div>

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

            {/* Company Field (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Acme Inc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
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
                  minLength={8}
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
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordMatch(true);
                  }}
                  required
                  className={`bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10 pr-10 ${
                    !passwordMatch ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {!passwordMatch && (
                <p className="text-xs text-red-500">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 rounded border-gray-300 dark:border-gray-700"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <button type="button" className="text-primary hover:underline">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="text-primary hover:underline">
                  Privacy Policy
                </button>
              </label>
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-950 px-3 text-xs text-muted-foreground">
              or sign up with
            </span>
          </div>

          {/* Social Sign Up */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignUp("google")}
              disabled={isLoading}
              className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10"
            >
              <Chrome className="h-4 w-4 mr-2" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignUp("github")}
              disabled={isLoading}
              className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <button
              type="button"
              onClick={onSignIn}
              className="text-primary hover:underline"
            >
              Sign in
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
                  Continue without signing up
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Benefits Footer */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            ✨ What you get with an account:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10">
              Save unlimited assessments
            </Badge>
            <Badge variant="secondary" className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10">
              Track methodology trends
            </Badge>
            <Badge variant="secondary" className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10">
              Export detailed reports
            </Badge>
            <Badge variant="secondary" className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-white/20 dark:border-white/10">
              Team collaboration
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
