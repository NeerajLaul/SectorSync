import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Play, X } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAssessment: () => void;
}

export function DemoModal({ isOpen, onClose, onStartAssessment }: DemoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">See How It Works</DialogTitle>
          <DialogDescription>
            Learn how SectorSync helps you find the perfect project management methodology
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Demo Video Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-purple-100/50 rounded-lg flex items-center justify-center border-2 border-dashed">
            <div className="text-center">
              <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-lg">
                <Play className="h-12 w-12 text-primary" />
              </div>
              <p className="text-muted-foreground">Demo video coming soon</p>
            </div>
          </div>

          {/* Quick Overview */}
          <div className="space-y-4">
            <h3 className="text-xl">Quick Overview</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mb-2 text-blue-600">
                  1
                </div>
                <h4 className="mb-1">Answer 12 Questions</h4>
                <p className="text-sm text-muted-foreground">
                  About your project size, team, planning approach, and more
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center mb-2 text-purple-600">
                  2
                </div>
                <h4 className="mb-1">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Our algorithm scores 8 methodologies based on your context
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mb-2 text-green-600">
                  3
                </div>
                <h4 className="mb-1">Get Results</h4>
                <p className="text-sm text-muted-foreground">
                  Ranked recommendations with detailed scoring breakdown
                </p>
              </div>
            </div>
          </div>

          {/* Sample Question */}
          <div className="space-y-3">
            <h3 className="text-xl">Sample Question</h3>
            <div className="p-6 border-2 rounded-lg bg-white">
              <h4 className="mb-2">What is your typical project size?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Consider team size, budget, and scope
              </p>
              <div className="space-y-2">
                {["Small", "Medium", "Large"].map((option) => (
                  <div
                    key={option}
                    className="p-3 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer"
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sample Result */}
          <div className="space-y-3">
            <h3 className="text-xl">Sample Result</h3>
            <div className="p-6 border-2 rounded-lg bg-gradient-to-br from-green-50 to-blue-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-yellow-400 p-2 rounded-full">
                  <span className="text-lg">🏆</span>
                </div>
                <div>
                  <div className="text-xs text-green-600 mb-1">TOP MATCH</div>
                  <h4 className="text-xl">Scrum</h4>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Agile framework emphasizing iterative development, self-organizing teams, 
                and continuous improvement through sprints.
              </p>
              <div className="bg-green-200 h-2 rounded-full">
                <div className="bg-green-600 h-2 rounded-full w-[95%]"></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Match Score: 0.95</p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onStartAssessment} className="flex-1" size="lg">
              Start Your Assessment
            </Button>
            <Button onClick={onClose} variant="outline" size="lg">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
