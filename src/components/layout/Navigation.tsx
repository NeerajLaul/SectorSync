import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logoImage from "figma:asset/final sector sync logo.png";
import { ThemeToggle } from "../ThemeToggle";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onStartAssessment: () => void;
  onOpenFindResults: () => void;

  // NEW: auth + profile wiring
  onSignIn?: () => void;
  user?: { email: string; fullName?: string | null; company?: string | null } | null;
  onSignOut?: () => void;
  showProfile?: boolean;
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

  // Close mobile menu on page change (in case parent updates currentPage)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPage]);

  const handleSignInClick = () => {
    if (onSignIn) onSignIn();
  };

  const handleSignOutClick = () => {
    if (onSignOut) onSignOut();
  };

  const displayName =
    user?.fullName && user.fullName.trim().length > 0
      ? user.fullName
      : user?.email;

  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-white/10 dark:border-white/5">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-6xl">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src={logoImage}
            alt="SectorSync Logo"
            className="h-15"
          />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 rounded ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />

          {/* Auth area */}
          {!user && (
            <Button variant="ghost" onClick={handleSignInClick}>
              Sign In
            </Button>
          )}
          {user && (
            <>
              <span className="text-xs text-muted-foreground">
                {displayName}
              </span>
              <Button variant="ghost" onClick={handleSignOutClick}>
                Sign Out
              </Button>
            </>
          )}

          <Button onClick={onStartAssessment}>
            Start Assessment
          </Button>

          <Button variant="outline" onClick={onOpenFindResults}>
            Find Results
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary/40"
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 dark:border-white/5 glass">
          <nav className="flex flex-col space-y-4 p-4">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 rounded ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>

            {/* Mobile auth + actions */}
            {!user && (
              <Button
                variant="ghost"
                className="justify-start"
                onClick={handleSignInClick}
              >
                Sign In
              </Button>
            )}
            {user && (
              <>
                <span className="text-xs text-muted-foreground">
                  {displayName}
                </span>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={handleSignOutClick}
                >
                  Sign Out
                </Button>
              </>
            )}

            <Button
              className="justify-start"
              onClick={onStartAssessment}
            >
              Start Assessment
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={onOpenFindResults}
            >
              Find Results
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
