# AssessmentDemo Component

## Overview

The `AssessmentDemo` component provides an interactive, animated walkthrough of the SectorSync assessment experience. It simulates a complete assessment flow from start to finish, showing users exactly what to expect.

## Features

### Three-Phase Demo Flow

1. **Intro Phase** (2 seconds)
   - Welcome screen with icon and description
   - Automatically transitions to questions

2. **Questions Phase** (2 seconds per question + 1 second selection)
   - Shows all 12 questions sequentially
   - Animated answer selection
   - Progress bar updates
   - Question count indicator
   - Uses sample answers that lead to Scrum recommendation

3. **Results Phase** (5 seconds)
   - Top match badge with trophy emoji
   - Methodology name (Scrum)
   - Description text
   - Animated score bar (0.95 / 1.00)
   - Top 3 rankings
   - Optional CTA to start real assessment

### User Controls

- **Play/Pause Button**: Start or pause the demo at any time
- **Restart Button**: Reset demo to beginning
- **Phase Indicator**: Shows current phase (Introduction, Question X of 12, Results)

### Animations

- Motion animations using `motion/react` (Framer Motion)
- Smooth transitions between phases
- Scale and fade effects
- Animated progress bar
- Radio button selection animation
- Score bar fill animation
- Floating gradient background effects

### Styling

- Matches SectorSync's liquid glass aesthetic
- Glassmorphism effects with backdrop blur
- Dark mode support
- Responsive design
- Consistent with survey.tsx question styling

## Usage

### Basic Usage

```tsx
import { AssessmentDemo } from '../components/AssessmentDemo';

<AssessmentDemo />
```

### With Start Assessment Callback

```tsx
import { AssessmentDemo } from '../components/AssessmentDemo';

<AssessmentDemo 
  onStartRealAssessment={() => {
    // Handle starting the real assessment
    console.log('Starting assessment...');
  }}
/>
```

### In a Modal (DemoModal)

```tsx
import { AssessmentDemo } from './AssessmentDemo';
import { Dialog, DialogContent } from './ui/dialog';

<Dialog open={isOpen}>
  <DialogContent className="max-w-6xl">
    <AssessmentDemo onStartRealAssessment={handleStart} />
  </DialogContent>
</Dialog>
```

## Sample Data

The demo uses pre-defined sample answers that create a realistic Scrum recommendation:

- Project Size: Small
- Planning: Iterative
- Sourcing: Internal Sourcing
- Goals: Speed
- Customer Size: Medium
- Customer Communication: Continuous Feedback Loops
- Payment Method: Time & Materials
- Design: Emergent
- Teams: Cross-functional
- Development: Iterative
- Integration/Testing: Continuous
- Closing: Team Acceptance

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onStartRealAssessment` | `() => void` | No | Callback function triggered when user clicks "Start Your Assessment" button in results phase |

## Integration Points

The component is currently integrated in:

1. **Landing Page** - Via `DemoModal` opened by "Watch Demo" button in hero
2. **Guide Page** - Via `DemoModal` opened by video placeholder click

## Technical Details

### Dependencies

- `react` - useState, useEffect hooks
- `motion/react` - Motion animations and AnimatePresence
- `./ui/button` - Button component
- `./ui/progress` - Progress bar component
- `lucide-react` - Icons (Play, Pause, RotateCcw, CheckCircle2, TrendingUp, ArrowRight)
- `../utils/questions` - QUESTIONS array for question data

### Auto-Advance Timing

- Intro Phase: 2 seconds
- Each Question: 2 seconds before selection, 1 second showing selection
- Results Phase: 5 seconds (then auto-pauses)

### State Management

- `isPlaying` - Boolean controlling auto-advance
- `currentStep` - Current question index (0-11)
- `phase` - Current demo phase ("intro" | "questions" | "results")
- `selectedAnswer` - Currently selected answer for animation

## Customization

### Adjusting Timing

Modify the `setTimeout` durations in the `useEffect` hook:

```tsx
// Intro duration
setTimeout(() => { ... }, 2000); // Change from 2000ms

// Question display duration
setTimeout(() => { ... }, 2000); // Change from 2000ms

// Answer selection duration
setTimeout(() => { ... }, 1000); // Change from 1000ms

// Results duration
setTimeout(() => { ... }, 5000); // Change from 5000ms
```

### Changing Sample Answers

Update the `SAMPLE_ANSWERS` array at the top of the component to show different recommendations.

### Modifying Animations

Adjust the `motion` component props to customize animation behavior:

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}  // Starting state
  animate={{ opacity: 1, scale: 1 }}    // End state
  transition={{ delay: 0.2 }}           // Timing
/>
```

## Accessibility

- Semantic HTML structure
- Keyboard accessible controls
- Screen reader friendly text
- High contrast UI elements
- Clear phase indicators

## Performance

- Efficient re-renders using React hooks
- Cleanup of timers in useEffect
- Optimized animations with motion/react
- No memory leaks with proper timer cleanup

## Future Enhancements

Possible improvements:

- [ ] Add audio narration option
- [ ] Add skip to results button
- [ ] Add timeline scrubber for manual navigation
- [ ] Add speed controls (1x, 1.5x, 2x)
- [ ] Add subtitles/captions support
- [ ] Allow users to interact with questions during demo
- [ ] Add analytics tracking for demo completion rates
