import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logoImage from "figma:asset/f9a9e70ab33c2f607bdeadf1c0791a99735686fd.png";
import { ThemeToggle } from "../ThemeToggle";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onStartAssessment: () => void;
  onOpenFindResults: () => void;
}

export function Navigation({
  currentPage,
  onNavigate,
  onStartAssessment,
  onOpenFindResults,
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "guide", label: "Tool Guide", href: "/guide" },
    { id: "about", label: "About", href: "/about" },
  ];

  // Close mobile menu on page change (in case parent updates currentPage)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPage]);

  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-white/10 dark:border-white/5">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-6xl">
        <div className="flex items-center space-x-2">
          <img
            src={logoImage}
            alt="SectorSync Logo"
            className="h-15"
          />
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 rounded ${isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="ghost">Sign In</Button>
          <Button onClick={onStartAssessment}>
            Start Assessment
          </Button>
          <Button variant="outline" onClick={onOpenFindResults}>Find Results</Button>

        </div>

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
                  className={`text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 rounded ${isActive
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
            <Button variant="ghost" className="justify-start">
              Sign In
            </Button>
            <Button
              className="justify-start"
              onClick={onStartAssessment}
            >
              Start Assessment
            </Button>
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost">Sign In</Button>
              <Button onClick={onStartAssessment}>Start Assessment</Button>
              <Button variant="outline" onClick={onOpenFindResults}>Find Results</Button>
            </div>

          </nav>
        </div>
      )}
    </header>
  );
}
