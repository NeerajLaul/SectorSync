import { Button } from "../ui/button";
import { Menu, X, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import logoImage from "figma:asset/f9a9e70ab33c2f607bdeadf1c0791a99735686fd.png";
import { ThemeToggle } from "../ThemeToggle";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onStartAssessment: () => void;
  onOpenFindResults: () => void;
  onSignIn?: () => void;
  user?: { email: string; fullName?: string | null; company?: string | null } | null;
  onSignOut?: () => void;
  showProfile?: boolean;
  showFindResults?: boolean;
}

export function Navigation({
  currentPage,
  onNavigate,
  onStartAssessment,
  onOpenFindResults,
  onSignIn,
  user,
  onSignOut,
  showProfile = false,
  showFindResults = true,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const baseNavItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "guide", label: "Tool Guide", href: "/guide" },
    { id: "about", label: "About", href: "/about" },
  ];

  const navItems = showProfile
    ? [...baseNavItems, { id: "profile", label: "Profile", href: "/profile" }]
    : baseNavItems;

  const displayName = user?.fullName || user?.email?.split("@")[0] || "User";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavigateClick = (pageId: string) => {
    onNavigate(pageId);
    setIsMenuOpen(false);
  };

  const handleSignInClick = () => {
    if (onSignIn) onSignIn();
    setIsMenuOpen(false);
  };

  const handleSignOutClick = () => {
    if (onSignOut) onSignOut();
    setIsMenuOpen(false);
  };

  const handleStartAssessmentClick = () => {
    onStartAssessment();
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-6xl">

        {/* Logo - Fixed squishing by using w-auto */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate("home")}>
          <img
            src={logoImage}
            alt="SectorSync Logo"
            className="h-8 w-auto object-contain rounded-lg"
          />
          <span className="text-xl font-bold tracking-tight"></span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`text-sm font-medium transition-colors ${currentPage === item.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />

          {/* Find Results - Conditional */}
          {showFindResults && (
            <Button variant="ghost" size="sm" onClick={onOpenFindResults}>
              <Search className="mr-2 h-4 w-4" />
              Find Results
            </Button>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              {/* Start Assessment - Always visible */}
              <Button size="sm" onClick={onStartAssessment}>
                <Sparkles className="mr-2 h-4 w-4" /> Start Assessment
              </Button>

              {/* Profile Avatar - Fixed aspect ratio with shrink-0 */}
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 shrink-0 aspect-square border border-border/50"
                onClick={() => onNavigate("profile")}
                title="Go to Profile"
              >
                <Avatar className="h-full w-full">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onSignIn}>
                Sign In
              </Button>
              <Button size="sm" onClick={onStartAssessment}>
                Start Assessment
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col space-y-4 p-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigateClick(item.id)}
                className={`text-sm font-medium text-left transition-colors ${currentPage === item.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {item.label}
              </button>
            ))}

            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>

            {/* Mobile Actions */}
            {user ? (
              <div className="space-y-3 pt-2 border-t">
                {/* Mobile Profile Link */}
                <div
                  className="flex items-center gap-3 px-1 py-2 cursor-pointer hover:bg-muted/50 rounded-md"
                  onClick={() => handleNavigateClick("profile")}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="justify-start w-full"
                onClick={handleSignInClick}
              >
                Sign In
              </Button>
            )}

            <Button
              className="justify-start w-full"
              onClick={handleStartAssessmentClick}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Start Assessment
            </Button>

            {showFindResults && (
              <Button
                variant="outline"
                className="justify-start w-full"
                onClick={() => {
                  onOpenFindResults();
                  setIsMenuOpen(false);
                }}
              >
                <Search className="mr-2 h-4 w-4" /> Find Results
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}