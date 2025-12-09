# SectorSync Architecture Documentation

## Overview

SectorSync is a project management methodology recommendation tool built with React, TypeScript, and Tailwind CSS. The application follows a page-based architecture for better code organization and maintainability.

## Directory Structure

```
src/
├── pages/                      → Page-level components (routes)
│   ├── index.tsx              → Landing page with hero, features, pricing, FAQ
│   ├── survey.tsx             → 12-question assessment questionnaire
│   ├── results.tsx            → Results display with methodology recommendations
│   ├── pitch.tsx              → Full-screen presentation mode
│   ├── print.tsx              → Print-friendly deck layout
│   ├── benchmark.tsx          → Industry benchmark comparison
│   ├── guide.tsx              → Tool guide and instructions
│   └── about.tsx              → About page with mission and science
│
├── components/                → Reusable UI components
│   ├── layout/                → Layout components
│   │   ├── Navigation.tsx     → Top navigation bar with theme toggle
│   │   └── Footer.tsx         → Site footer
│   │
│   ├── ui/                    → ShadCN UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   └── ...                → All ShadCN components
│   │
│   ├── figma/                 → Figma-specific components
│   │   └── ImageWithFallback.tsx
│   │
│   ├── LandingHero.tsx        → Hero section for landing page
│   ├── Features.tsx           → Features showcase section
│   ├── Benefits.tsx           → Benefits grid section
│   ├── Testimonials.tsx       → Customer testimonials
│   ├── FAQ.tsx                → Frequently asked questions
│   ├── DemoModal.tsx          → Demo modal wrapper component
│   ├── AssessmentDemo.tsx     → Interactive animated assessment walkthrough
│   ├── ThemeProvider.tsx      → Dark/light theme context provider
│   ├── ThemeToggle.tsx        → Theme toggle button
│   ├── MoodPlayer.tsx         → Ambient sound player with 6 mood options
│   ├── buildSlides.tsx        → Slide builder utility for print deck
│   └── ...
│
├── utils/                     → Utility functions and logic
│   ├── scoringEngine.ts       → Fuzzy logic scoring algorithm
│   ├── questions.ts           → Question data and configuration
│   └── constants.ts           → App-wide constants
│
├── hooks/                     → Custom React hooks
│   └── useAmbientSound.ts     → Web Audio API ambient sound generation
│
├── styles/                    → Global styles
│   └── globals.css            → Tailwind directives and custom styles
│
└── App.tsx                    → Main application component with routing logic
```

## Key Design Decisions

### Page-Based Architecture

**Why Pages?**
- Clear separation between route-level logic and reusable components
- Easier to understand the application's main flows
- Better code organization as the app scales
- Follows common React patterns (Next.js-style structure)

**Page Responsibilities:**
- Handle page-specific state
- Coordinate multiple components
- Manage data fetching and transformation
- Implement page-specific business logic

**Component Responsibilities:**
- Encapsulate reusable UI patterns
- Maintain presentation logic only
- Accept props for configuration
- Remain framework-agnostic where possible

### Component Organization

#### `/components/layout/`
Contains components that define the application's structure:
- Navigation bar
- Footer
- Future: Sidebar, PageWrapper, etc.

#### `/components/ui/`
ShadCN UI component library. These are pre-built, accessible components:
- Never modify directly unless absolutely necessary
- Use composition to extend functionality
- Keep all ShadCN components in this directory

#### `/components/` (root)
Section-level components used by pages:
- Landing page sections (Hero, Features, Benefits, etc.)
- Shared widgets (MoodPlayer, DemoModal)
- Theme management (ThemeProvider, ThemeToggle)
- Utility components (buildSlides)

### State Management

**Current Approach:**
- Component-level state with `useState`
- Context for theme management (`ThemeProvider`)
- Props drilling for callbacks and data

**State Flow:**
```
App.tsx (main state container)
  ├── currentPage: "home" | "guide" | "about"
  ├── state: "landing" | "questionnaire" | "results" | "pitch" | "print" | "benchmark"
  └── results: ScoringResult | null

Pages receive:
  ├── Data props (results, etc.)
  └── Callback props (onComplete, onBack, etc.)
```

## Application Flow

### User Journey

1. **Landing** (`/pages/index.tsx`)
   - User arrives at homepage
   - Views features, benefits, pricing
   - Clicks "Start Assessment"

2. **Assessment** (`/pages/survey.tsx`)
   - User answers 12 questions
   - Progress tracked with visual indicator
   - Validates answers before proceeding
   - Calls `onComplete(answers)` when finished

3. **Results** (`/pages/results.tsx`)
   - Displays top methodology recommendation
   - Shows detailed scoring breakdown
   - Provides educational video
   - Offers export options (JSON, CSV)
   - Can open Pitch Mode, Print Mode, or Benchmark

4. **Pitch Mode** (`/pages/pitch.tsx`)
   - Full-screen presentation view
   - 6 slides with auto-advance option
   - Keyboard navigation (←, →, ESC)
   - Includes methodology overview and benchmark data

5. **Print Mode** (`/pages/print.tsx`)
   - Print-optimized layout
   - One slide per page
   - Includes branding and metadata
   - Browser print dialog integration

6. **Benchmark** (`/pages/benchmark.tsx`)
   - **Methodology-aware adaptive benchmarking system**
   - 16 metrics across 6 pillars: Flow, Quality, Predictability, Value, Customer, Waste
   - Each metric has relevance scores (0-1) for each of 8 methodologies
   - Answer-driven cohort matching (size, planning, compliance, sourcing, goal)
   - Three-way comparison: Cohort Avg, Industry Avg, Company Exemplar
   - Industry peer filtering (E-commerce/Retail, SaaS, FinTech, Healthcare, Manufacturing)
   - Methodology-specific exemplars with source citations
   - Pillar emphasis radar chart showing metric family importance
   - Only displays metrics relevant to user's recommended methodology

### Navigation Flow

```
App.tsx orchestrates all navigation:
  ├── Top Nav (Navigation component)
  │   ├── Home → sets currentPage="home", state="landing"
  │   ├── Tool Guide → sets currentPage="guide", state="landing"
  │   └── About → sets currentPage="about", state="landing"
  │
  └── Assessment Flow
      ├── "Start Assessment" → state="questionnaire"
      ├── Complete Survey → state="results"
      ├── Open Pitch → state="pitch"
      ├── Open Print → state="print"
      ├── Open Benchmark → state="benchmark"
      └── Restart → state="landing", currentPage="home"
```

## Scoring Engine

Located in `/utils/scoringEngine.ts`:

### Algorithm Overview (v4.0.2-fuzzy-stable)

**Important:** SectorSync uses a fuzzy text matching scoring system, not AI or machine learning. The algorithm is deterministic and rule-based, providing transparent and reproducible results.

#### Fuzzy Matching Algorithm

The engine compares user answers against methodology profiles using natural language matching:

1. **Exact Match** → 1.0 score
   - User input exactly matches methodology descriptor
   
2. **Contains Match** → 0.8 score
   - Either string contains the other (e.g., "small" matches "small or medium")
   
3. **Word Overlap** → 0.6 score
   - At least one word in common (e.g., "continuous" in both inputs)
   
4. **Fallback** → 0.3 score
   - No clear match, but still contributes to overall score

#### Methodology Profiles

Each methodology is defined by natural language descriptors for 12 factors:
- Example: Scrum prefers "iterative" planning, "small or medium" project size
- Example: Waterfall prefers "up-front" planning, "firm fixed price" payment

#### Scoring Process

1. Normalize all user inputs to lowercase
2. For each methodology, compare user answer to methodology preference for all 12 factors
3. Sum fuzzy match scores across all factors
4. Calculate average score (total ÷ number of factors answered)
5. Rank methodologies by final score

**Benefits of Fuzzy Matching:**
- More forgiving of input variations
- No need for complex weight tuning
- Natural language-based, easier to understand
- Simpler to maintain and extend
   - Captures synergies that linear scoring misses

4. **Normalization & Ranking**
   - Scores are normalized to 0-100 scale
   - Methodologies ranked by final score
   - Confidence calculated from score separation

### Output Structure

```typescript
interface ScoringResult {
  engineVersion: string;
  ranking: Array<{
    method: string;
    score: number;
    contributions: Array<{
      factor: string;
      delta: number;
    }>;
  }>;
}
```

## Styling Approach

### Glassmorphism Theme

The application uses a modern "liquid glass" aesthetic:

- **Glass Cards** (`glass-card`, `glass-strong`, `glass-subtle`)
  - Frosted glass effect with `backdrop-blur`
  - Translucent backgrounds
  - Subtle borders with opacity

- **Interactive Effects**
  - Mouse tracking spotlight on cards
  - 3D tilt effects on hover
  - Smooth transitions (300ms duration)
  - Scale transforms on hover

- **Dark Theme Support**
  - Fully supported via ThemeProvider
  - CSS variables for color management
  - Automatic theme detection
  - Persistent theme preference (localStorage)

### Tailwind Configuration

- **No font classes** unless specifically requested
  - Relies on `styles/globals.css` typography
  - System font stack for performance
  - Consistent type scale

- **Color System**
  - Primary, secondary, accent colors
  - Muted variants for backgrounds
  - Border colors with opacity

## Core Logic Systems

### Scoring Engine (v4.0.2-fuzzy-stable)

**Location:** `/utils/scoringEngine.ts`

**Algorithm:** Fuzzy text matching with natural language descriptors

**How It Works:**
1. User answers 12 questions with multiple-choice options
2. Each answer maps to descriptive tags (e.g., "agile", "waterfall", "continuous")
3. Fuzzy matcher compares answer tags against methodology profiles
4. Four matching levels:
   - **Exact match** (1.0): Answer tag exactly matches methodology tag
   - **Contains match** (0.8): One contains the other
   - **Word overlap** (0.6): Shared words between multi-word phrases
   - **Default** (0.3): No match, baseline score
5. Scores accumulated across all 12 questions
6. Rankings produced with contribution breakdowns

**Why Fuzzy Matching:**
- More intuitive than numerical sensitivity weights
- Easier to maintain and debug
- Handles natural language variations gracefully
- No complex calibration needed

**Methodologies Supported:**
1. Scrum
2. SAFe (Scaled Agile Framework)
3. Waterfall
4. PRINCE2
5. Lean Six Sigma
6. Disciplined Agile
7. Hybrid
8. Continuous Delivery

### Methodology-Aware Benchmark System

**Location:** `/pages/benchmark.tsx`

**Framework:** Adaptive metric catalog with methodology-specific relevance scoring

**Six Pillars:**

1. **Flow** - Cycle Time, Lead Time, Throughput, Flow Efficiency
2. **Quality** - Escapes to Production, Rework %, First Pass Yield
3. **Predictability** - Plan Reliability, SPI (Schedule Performance Index), CPI (Cost Performance Index)
4. **Value** - Time-to-Value, Business Value Delivered
5. **Customer** - NPS/CSAT, SLA/SLO Adherence
6. **Waste** - Queue/Wait Ratio, Batch Size

**Methodology Relevance:**
Each metric has a relevance score (0.0-1.0) for each methodology:
- **Scrum:** High on Flow, Quality, Value; Medium on Predictability
- **Waterfall:** High on Predictability (SPI, CPI); Lower on Flow
- **Continuous Delivery:** Maximum on Flow and Waste reduction
- **Lean Six Sigma:** Maximum on Quality and Waste
- **SAFe:** Balanced across pillars
- **PRINCE2:** High on Predictability and governance
- **Disciplined Agile:** Balanced with emphasis on Value
- **Hybrid:** Medium-high across most metrics

**Cohort System:**
Maps user assessment answers to context dimensions:
- **Size:** small, medium, large (from project_size answer)
- **Planning:** iterative, continuous_flow, up_front (from planning answer)
- **Compliance:** low, medium, high (from compliance answer)
- **Sourcing:** internal, mixed, outsourced (from sourcing answer)
- **Goal:** speed, predictable, innovation (from goals answer)

Creates cohort key: `size:X|plan:Y|comp:Z|src:W|goal:V`

**Predefined Cohorts:**
1. "Large, Regulated, Up-Front Planning" - Higher predictability, lower escapes
2. "Product Teams Optimizing for Speed" - Lower cycle time, higher throughput
3. "Startup-like Innovation" - Fastest cycle times, higher risk tolerance

**Industry Peer Data:**
Numeric benchmarks for 6 key metrics across 5 industries:
- E-commerce/Retail (Nike, Adidas, Under Armour, etc.)
- SaaS (Salesforce, Slack, Shopify)
- FinTech (Stripe, Square, PayPal)
- Healthcare (Epic, Cerner, Teladoc)
- Manufacturing (GE Digital, Siemens)

**Company Exemplars:**
One exemplar per methodology with source citations:
- Spotify (Scrum) - engineering.atspotify.com
- John Deere (SAFe) - public case studies
- Boeing (Waterfall) - systems engineering approach
- VocaLink/Mastercard (PRINCE2) - payment systems
- Toyota (Lean Six Sigma) - TPS documentation
- TD Bank (Disciplined Agile) - PMI resources
- Nike (Hybrid) - medium.com/nikeengineering
- Amazon (Continuous Delivery) - AWS DevOps blog

## Key Features

### MoodPlayer Component

6 ambient mood options with Web Audio API synthesis:
- Calming (C major chord, relaxed)
- Focus (Soft piano-like tones)
- Uplifting (Major 7th chord)
- Deep Work (Low drone)
- Creative (Bright, sparkly)
- Ambient (Ethereal soundscape)

**Features:**
- Persistent settings (localStorage)
- Volume control with visual feedback
- 2x3 grid layout
- Auto-play on mood selection

### Theme System

- Light and dark mode support
- System preference detection
- Manual toggle in navigation
- Smooth transitions between themes
- Persistent preference storage

## Future Enhancements

### Potential Additions

1. **React Router Integration**
   - Replace state-based routing with proper URLs
   - Enable deep linking to results
   - Browser back/forward support

2. **API Integration**
   - Backend for result persistence
   - Real peer benchmark data
   - User account management

3. **Enhanced Analytics**
   - Track methodology selection trends
   - A/B test recommendation algorithms
   - User feedback collection

4. **Export Features**
   - PDF generation
   - PowerPoint export
   - Email results
   - Shareable links

5. **Team Collaboration**
   - Multi-user assessments
   - Consensus building mode
   - Team dashboard

## Development Guidelines

### Adding a New Page

1. Create `pages/new-page.tsx`
2. Export a component with appropriate props
3. Add route logic to `App.tsx`
4. Update navigation if needed
5. Update this documentation

### Adding a New Component

1. Determine if it's page-specific or reusable
2. Place in appropriate directory
3. Use TypeScript interfaces for props
4. Follow existing naming conventions
5. Keep components focused and single-purpose

### Styling Guidelines

1. Use Tailwind utility classes
2. Avoid custom font classes (rely on globals.css)
3. Use CSS variables for theming
4. Follow glassmorphism patterns for cards
5. Ensure dark mode compatibility

### State Management

1. Keep state as close to usage as possible
2. Use context for app-wide concerns (theme)
3. Lift state only when necessary
4. Pass callbacks for state updates
5. Consider reducers for complex state

## Performance Considerations

- Lazy load heavy components
- Memoize expensive calculations
- Optimize images with proper formats
- Code split by route
- Use Web Audio API efficiently (stop sounds when not in use)

## Accessibility

- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in modals
- Color contrast compliance
- Screen reader friendly

## Browser Support

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features (no IE11)
- CSS Grid and Flexbox
- Web Audio API for sound
- LocalStorage for persistence

---

**Last Updated:** November 2, 2025  
**Version:** 3.0  
**Maintainer:** SectorSync Team
