# Demo Component Architecture

## Component Hierarchy

```
App.tsx
  ├── Navigation
  ├── ThemeProvider
  └── Pages
      ├── IndexPage (Landing)
      │   ├── LandingHero
      │   │   └── "Watch Demo" Button → opens DemoModal
      │   ├── Features
      │   ├── Benefits
      │   ├── Testimonials
      │   ├── FAQ
      │   └── DemoModal ⭐
      │       ├── DialogContent
      │       ├── AssessmentDemo ⭐⭐
      │       │   ├── Demo Controls (Play/Pause/Restart)
      │       │   ├── Progress Bar
      │       │   ├── Phase: Intro
      │       │   ├── Phase: Questions (12)
      │       │   └── Phase: Results
      │       ├── Quick Overview (3 cards)
      │       ├── Sample Question
      │       ├── Sample Result
      │       └── CTA Buttons
      │
      └── GuidePage
          ├── Demo Video Section → opens DemoModal
          ├── How It Works
          ├── Question Categories
          ├── Methodologies Covered
          ├── Tips for Best Results
          └── DemoModal ⭐ (same as above)
```

## Data Flow

```
User Action Flow:
================

1. User clicks "Watch Demo" button (Landing) or video placeholder (Guide)
   └─→ setIsDemoOpen(true)

2. DemoModal opens with AssessmentDemo component
   └─→ AssessmentDemo receives onStartRealAssessment callback

3. User interacts with demo controls
   ├─→ [Play] → setIsPlaying(true) → auto-advance starts
   ├─→ [Pause] → setIsPlaying(false) → auto-advance stops
   └─→ [Restart] → reset state → back to intro

4. Demo auto-advances through phases
   Intro (2s) → Q1 (3s) → Q2 (3s) → ... → Q12 (3s) → Results (5s)

5. User clicks "Start Your Assessment" in results
   └─→ onStartRealAssessment() called
       └─→ setIsDemoOpen(false)
           └─→ onStartAssessment() in parent
               └─→ setState("questionnaire") in App.tsx
                   └─→ Renders SurveyPage
```

## State Management

```javascript
// App.tsx (root state)
const [state, setState] = useState("landing");
const [results, setResults] = useState(null);

// IndexPage.tsx
const [isDemoOpen, setIsDemoOpen] = useState(false);

// AssessmentDemo.tsx (local state)
const [isPlaying, setIsPlaying] = useState(false);      // Auto-advance control
const [currentStep, setCurrentStep] = useState(0);      // Question index (0-11)
const [phase, setPhase] = useState("intro");            // "intro" | "questions" | "results"
const [selectedAnswer, setSelectedAnswer] = useState(null); // For animation
```

## Props Interface

```typescript
// DemoModal Props
interface DemoModalProps {
  isOpen: boolean;              // Controls modal visibility
  onClose: () => void;          // Called when modal closes
  onStartAssessment: () => void; // Called when starting real assessment
}

// AssessmentDemo Props
interface AssessmentDemoProps {
  onStartRealAssessment?: () => void; // Optional callback for CTA button
}
```

## Component Responsibilities

### DemoModal
- **Purpose**: Container for demo content
- **Responsibilities**:
  - Manage modal open/close state
  - Provide dialog structure
  - Include educational content
  - Pass callbacks to AssessmentDemo
- **Styling**: Max width 6xl, scrollable content

### AssessmentDemo
- **Purpose**: Interactive demo simulation
- **Responsibilities**:
  - Auto-advance through phases
  - Handle play/pause/restart controls
  - Animate transitions
  - Display questions and results
  - Trigger assessment start callback
- **Styling**: Full width, aspect-video container, glass effects

## Animation Timeline

```
Time | Phase      | Action
-----|------------|----------------------------------
0s   | Intro      | Show welcome screen
2s   | Questions  | Transition to Q1
4s   |            | Select answer, show selection
5s   |            | Transition to Q2
7s   |            | Select answer, show selection
8s   |            | Transition to Q3
...  |            | (continue pattern)
38s  |            | Select answer Q12
39s  | Results    | Transition to results
39.2s|            | Trophy icon appears
39.4s|            | "TOP MATCH" badge appears
39.6s|            | "Scrum" title appears
39.8s|            | Description appears
40s  |            | Score bar animates
41s  |            | Score reaches 95%
41.2s|            | CTA button appears
44s  |            | Auto-pause (demo complete)
```

## Motion Animations Used

```javascript
// Fade in/out with scale
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 1.1 }}
/>

// Slide in from right
<motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -50 }}
/>

// Staggered list items
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: idx * 0.1 }}
/>

// Scale spring effect
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring" }}
/>

// Progress bar fill
<motion.div
  initial={{ width: 0 }}
  animate={{ width: "95%" }}
  transition={{ duration: 1, ease: "easeOut" }}
/>
```

## Event Handlers

```javascript
// Play/Pause Control
handlePlayPause() {
  setIsPlaying(!isPlaying)
  // useEffect handles auto-advance
}

// Restart Control
handleRestart() {
  setIsPlaying(false)
  setCurrentStep(0)
  setPhase("intro")
  setSelectedAnswer(null)
}

// Start Real Assessment
onStartRealAssessment() {
  // Defined in parent (DemoModal)
  // Closes modal and triggers App.tsx state change
}
```

## CSS Classes Used

```css
/* Glass effects */
.glass-card
.glass-subtle
.glass-hover

/* Theme support */
dark:from-primary/10
dark:border-white/10

/* Animations */
animate-pulse
animate-glow

/* Layout */
aspect-video
max-w-6xl
overflow-hidden

/* Interactions */
cursor-pointer
hover:scale-[1.02]
transition-all
```

## Integration Points

### Landing Page Hero
```tsx
<Button onClick={onWatchDemo}>
  <Play /> Watch Demo
</Button>
```

### Guide Page Video Section
```tsx
<div onClick={() => setIsDemoOpen(true)}>
  <Play className="h-16 w-16" />
  Click to watch the demo
</div>
```

## Testing Scenarios

### Unit Tests (Recommended)
- ✅ Component renders without crashing
- ✅ Play button starts auto-advance
- ✅ Pause button stops auto-advance
- ✅ Restart button resets state
- ✅ Phases transition correctly
- ✅ onStartRealAssessment callback fires

### Integration Tests (Recommended)
- ✅ Modal opens from landing page
- ✅ Modal opens from guide page
- ✅ Demo plays through all phases
- ✅ Starting assessment closes modal
- ✅ Starting assessment triggers survey page

### E2E Tests (Recommended)
- ✅ Complete user journey from landing → demo → assessment
- ✅ Dark mode switching during demo
- ✅ Responsive behavior on mobile/tablet/desktop
- ✅ Keyboard navigation (Tab, Enter, Escape)

## Dependencies Graph

```
AssessmentDemo.tsx
  ├── react (useState, useEffect)
  ├── motion/react (motion, AnimatePresence)
  ├── ./ui/button (Button)
  ├── ./ui/progress (Progress)
  ├── lucide-react (Icons)
  └── ../utils/questions (QUESTIONS)

DemoModal.tsx
  ├── ./ui/dialog (Dialog, DialogContent, DialogHeader, etc.)
  ├── ./ui/button (Button)
  ├── ./AssessmentDemo (AssessmentDemo)
  └── lucide-react (X icon)
```

## File Sizes

```
AssessmentDemo.tsx:      ~15KB (380 lines)
DemoModal.tsx:           ~4KB  (123 lines)
README-AssessmentDemo.md: ~8KB  (documentation)
Total:                   ~27KB (uncompressed)
```

## Performance Considerations

### Optimizations
- ✅ Timer cleanup in useEffect prevents memory leaks
- ✅ AnimatePresence mode="wait" prevents overlapping animations
- ✅ Motion animations use GPU acceleration
- ✅ Conditional rendering based on phase
- ✅ No unnecessary re-renders

### Lazy Loading (Optional)
Consider code-splitting if bundle size becomes an issue:

```javascript
const AssessmentDemo = lazy(() => import('./components/AssessmentDemo'));
```

## Browser Support

Works in all modern browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Requires support for:
- CSS backdrop-filter (glassmorphism)
- CSS Grid
- ES6+ JavaScript
- Motion animations
