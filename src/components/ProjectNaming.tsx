import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ArrowRight, FolderKanban } from "lucide-react";
import { motion } from "motion/react";

interface ProjectNamingProps {
  onComplete: (projectName: string, projectDescription?: string) => void;
  onSkip: () => void;
}

export function ProjectNaming({ onComplete, onSkip }: ProjectNamingProps) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleContinue = () => {
    if (projectName.trim()) {
      onComplete(projectName.trim(), projectDescription.trim() || undefined);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 sm:p-8 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/30"></div>
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      
      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="glass-strong p-10 sm:p-12 shadow-2xl border-white/20 dark:border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-4">
              <FolderKanban className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold mb-3">
              Name Your Project
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Give your assessment a memorable name so you can easily find it later in your profile dashboard
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-lg">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="projectName"
                placeholder="e.g., Mobile App Redesign, Q1 2025 Initiative"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="h-12 text-base"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && projectName.trim()) {
                    handleContinue();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="text-lg">
                Description <span className="text-sm text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="projectDescription"
                placeholder="Brief description of your project goals and context..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={4}
                className="text-base resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-muted-foreground"
            >
              Skip for now
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!projectName.trim()}
              className="h-12 px-8 text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Continue to Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Helper text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              💡 Tip: Use descriptive names like "Enterprise CRM Migration" or "Agile Transformation 2025"
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
