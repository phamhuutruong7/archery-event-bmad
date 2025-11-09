# UX Design Specification — Score Input (Qualification)

_Created: 2025-11-09_
_Author: Sally — UX Designer (BMad)_

## Purpose

This document captures the detailed UX specification for the Athlete Score Input (qualification round) experience. It is scoped to the mobile-first scoresheet flow where athletes enter scores per end (6 arrows), confirm the end, and resume mid-end if interrupted.

## Summary (high level)

- Core experience: Athletes input scores quickly and sequentially, per end, with clear visual feedback and minimal distraction.
- Platform: Mobile-first web (Vue 3 + Vuetify). Scoresheet is a focused screen — no leaderboard/rank shown on the same screen.
- Scoring modes: Qualification (per end of 6 arrows), Elimination (set-based; separate design not covered here).

---

## Screen: Scoresheet (Qualification)

Top area (static header):
- Competition name: e.g. "Men's 70m" (bold)
- Summary row: Distance | Golds (count of X+10) | Average (live)

Scoresheet area (scrollable):
- Rows for each end. Example row structure:
  - [end-index-small] [arrow1][arrow2][arrow3][arrow4][arrow5][arrow6]  (confirmIcon)(cancelIcon)  [end-sum]
  - Past confirmed ends show a small green check indicator (locked)
  - Current active end is expanded and highlighted

Behavior details:
- Input is strictly sequential (left → right). Users cannot jump between ends.
- Tapping anywhere in the scoresheet focuses/opens the latest incomplete end.
- Each arrow cell is a rounded pill with colored background (target ring color) and a numeric/text label (X,10,...,1,M).
- After each arrow input, the row sum recalculates immediately.
- After 6 arrows, a green rounded check icon (confirm end) appears to the right of the row.
- If user taps the green check: attempt to persist the end to backend and lock the row on success.
- To edit arrows before confirmation, use the delete button (←) in the score pad to remove arrows sequentially from right to left.

Network behavior:
- On confirm action, UI shows transient state: "Saving..." (spinner) near the end row.
- On success: show locked state with small green check (locked) and remove confirm/cancel icons.
- On network failure: show an inline error near the row: "Failed to save. Retry?" with a Retry button.
  - Retry attempts re-send the end payload.
  - If offline, persist end locally in app storage (IndexedDB/localStorage) and queue for retry; visually show "Queued — will sync when online".

Mid-end resume behavior:
- If athlete leaves mid-end (e.g., 3 arrows entered): upon returning, app opens directly to the same event → competition → scoresheet and focuses the in-progress end/arrow.
- Partial input must be persisted locally immediately (debounced) to support resume after app close or crash.

Input pad (fixed at bottom):
- Above pad: small header with live Average and Total entered so far (e.g., "Avg: 9.33 | Total: 186/240").
- Pad layout (3 rows):
  Row 1: [ X ][10][9][8][←]
  Row 2: [7][6][5][4]
  Row 3: [3][2][1][M][ ]
- The `←` deletes the most recently entered arrow (sequential undo). No direct edits of an earlier arrow allowed.
- Tapping a score writes it into the next empty arrow slot on the current end, and the UI immediately updates colors and end sum.

Color mapping (visual authenticity):
- X, 10, 9 → Yellow: #e8de27 (text color: black)
- 8, 7 → Red: #d92d41 (text color: white)
- 6, 5 → Blue: #1884cc (text color: white)
- 4, 3 → Black: #000000 (text color: white)
- 2, 1 → White: #f5f5f5 (text color: black)
- M (miss) → Green: #0a8c0a (text color: white)

Accessibility:
- All interactive elements must be reachable by keyboard and screen reader.
- Provide aria-labels for each arrow button ("Enter 10", "Enter X", "Enter miss").
- Color should not be the only indicator; use subtle icons or outlines for contrast (especially for black/white rings).

---

## Data contract (suggested)

API: Confirm End (POST)
- POST /api/v1/events/{eventId}/competitions/{competitionId}/rounds/{roundId}/ends
  - Payload:
    {
      "athleteId": "uuid",
      "endNumber": 4,
      "arrows": ["10","9","10","8","9","10"],
      "timestamp": "2025-11-09T08:12:34Z"
    }
  - Success: 200 OK { confirmed: true, lockedAt: timestamp }
  - Failure: 503 Service Unavailable or 412 Conflict (if host locked the competition)

Local persistence (offline):
- Save in local queue: {eventId, competitionId, roundId, endNumber, arrows, sum, status: queued}
- Background sync worker tries to flush queue when connectivity returns.

---

## Acceptance Criteria (QA)

1. Athlete can enter six arrows sequentially; each tap fills the next slot left-to-right.
2. End sum updates immediately after each arrow entry.
3. Golds counter updates when X or 10 is entered and decrements when undone.
4. After 6th arrow, green check icon appears; tapping check persists to backend and locks the row.
5. On network failure the app shows "Failed to save. Retry?" and allows retry or queues for background sync.
6. If app closed mid-end, returning to scoresheet restores the incomplete end and focuses the next arrow.
7. Athlete cannot edit earlier ends once locked; host/refs can override via separate admin UI.

---

## Edge cases & notes

- If host closes scoring for the competition between entries, POST returns 412 — show message: "Scoring closed by host." and rollback local end.
- If duplicate confirm attempts occur, backend must be idempotent (use request idempotency key).
- Consider small haptic feedback on confirm for native wrappers; for web, a micro-animation is sufficient.

---

## Responsive Design Strategy

**Mobile-First Philosophy:**
The scoresheet is primarily designed for **mobile athletes** entering scores in the field. The interface must feel native and use every pixel efficiently.

**Viewport Behavior:**

| Device | Orientation | Strategy | Rationale |
|--------|-------------|----------|-----------|
| Mobile (< 768px) | Portrait | **Full Screen** - No borders, 100vw × 100dvh | Athletes need maximum space for score input, native app feel |
| Tablet (768-1023px) | Portrait | Constrained (500px max), centered | Comfortable reading width, professional appearance |
| Tablet/Desktop | Landscape | **Full Width** - 100vw utilization | Horizontal space abundant, maximize content visibility |

**Implementation Details:**
- Use `100dvh` (dynamic viewport height) to handle mobile browser chrome hiding/showing
- Remove default padding from v-main container: `<v-main class="pa-0">`
- Scoresheet container has responsive CSS with media queries for each breakpoint
- All touch targets minimum 44×44px (WCAG AAA compliance)
- Score pad buttons scale proportionally using `aspect-ratio: 1`

**Adaptive Features:**
- Font sizes: 14px (mobile) → 16px+ (desktop)
- Button spacing: 8px (mobile) → 12px (desktop)
- Header padding: 12px (mobile) → 20px (desktop)
- End row spacing adapts to available vertical space

---

## Design Modularity & Adaptability

**Critical requirement:** The scoresheet UI must adapt to different competition formats (Qualification, Elimination, Team, etc.).

**Strategy:**
- Component-based architecture: `ScoreInput` wrapper with pluggable layouts
- Layout variants driven by props: `competitionType`, `arrowsPerEnd`, `scoringMethod`
- Shared components: `ScorePad`, `EndRow`, `ArrowCell`, `SummaryHeader`
- Layout-specific components: `QualificationLayout`, `EliminationLayout`, `TeamLayout`

**Example adaptive behavior:**
- Qualification → 6 arrows/end, cumulative scoring, no opponent
- Elimination → 3 arrows/set, set points (2-1-0), opponent side-by-side
- Team → same as Elimination but aggregated team score

**Implementation:**
```vue
<ScoreInput 
  :competition-type="currentCompetition.type" 
  :arrows-per-end="currentCompetition.arrowsPerEnd"
  :scoring-method="currentCompetition.scoringMethod"
/>
```

---

## Story Breakdown (UX Implementation)

This UX specification covers the **Athlete Score Input** experience. To maintain BMAD modularity, implementation will be broken into:

**Epic 10: Mobile & Responsive UI** (existing epic)
- Story 10.x: Core Scoresheet Component Library (`ScorePad`, `EndRow`, `ArrowCell`)
- Story 10.x+1: Qualification Scoresheet Layout & Flow
- Story 10.x+2: Offline Queue & Resume Logic
- Story 10.x+3: Elimination Scoresheet Layout Variant

**Epic 5: Real-Time Qualification Scoring** (existing epic)
- Story 5.x: Backend API for End Submission (idempotency, validation)
- Story 5.x+1: SignalR Hub for Score Broadcast

**Additional screens** (Login, Event Creation, Join Event) will have separate UX specs and stories.

---

## Vuetify Theme Configuration

**Design System:** Vuetify (Material Design 3)  
**Primary Brand Color:** Deep Blue (#1565c0) - Professional, trustworthy  
**Accent Color:** Energetic Orange (#ff6f00) - CTAs, notifications  
**Personality:** Energetic & Modern

**Color Theme:**

```typescript
// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          // Brand Colors
          primary: '#1565c0',
          'primary-lighten-1': '#1976d2',
          'primary-darken-1': '#0d47a1',
          secondary: '#424242',
          accent: '#ff6f00',
          
          // Semantic Colors
          success: '#4caf50',
          warning: '#ff9800',
          error: '#f44336',
          info: '#2196f3',
          
          // Target Ring Colors (Custom)
          'ring-yellow': '#e8de27',
          'ring-red': '#d92d41',
          'ring-blue': '#1884cc',
          'ring-black': '#000000',
          'ring-white': '#f5f5f5',
          'ring-green': '#0a8c0a',
        }
      }
    }
  },
  defaults: {
    // Global component defaults for energetic feel
    VBtn: {
      rounded: 'xl',
      elevation: 2,
      style: [{ textTransform: 'none', fontWeight: 600 }]
    },
    VCard: {
      elevation: 2,
      rounded: 'lg'
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable'
    }
  }
})
```

**Visual Preview:** See `ux-color-themes.html` for interactive color swatches and score pad demo.

---

---

## Component Architecture (Vue 3 + TypeScript)

### Component Hierarchy

```
ScoresheetView.vue (Page/View)
├── ScoresheetHeader.vue
│   ├── CompetitionTitle
│   └── SummaryStats (Distance, Golds, Average)
├── EndsList.vue (Scrollable area)
│   └── EndRow.vue (v-for each end)
│       ├── EndIndex
│       ├── ArrowCell.vue (x6 per end)
│       ├── ConfirmButton
│       ├── CancelButton
│       └── EndSum
└── ScorePad.vue (Fixed bottom)
    ├── LiveStats (Avg, Total)
    └── ScoreButton.vue (grid of score buttons)
```

### Type Definitions

```typescript
// types/scoring.ts

export type ScoreValue = 'X' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2' | '1' | 'M'

export interface Arrow {
  value: ScoreValue | null
  timestamp?: Date
}

export interface End {
  endNumber: number
  arrows: Arrow[]
  sum: number
  confirmed: boolean
  locked: boolean
  status: 'pending' | 'saving' | 'saved' | 'error'
  errorMessage?: string
}

export interface Competition {
  id: string
  name: string
  distance: string
  arrowsPerEnd: number
  totalEnds: number
  competitionType: 'qualification' | 'elimination' | 'team'
}

export interface ScoreStats {
  totalScore: number
  goldsCount: number // X + 10
  average: number
  arrowsEntered: number
}
```

### Component Specifications

#### 1. `ScoresheetView.vue`

**Purpose:** Container view managing scoresheet state and API interactions

**Props:**
```typescript
interface Props {
  competitionId: string
  athleteId: string
}
```

**State (Pinia Store):**
```typescript
// stores/scoring.ts
interface ScoringState {
  competition: Competition | null
  ends: End[]
  currentEndIndex: number
  stats: ScoreStats
  isOnline: boolean
  queuedEnds: End[]
}
```

**Key Methods:**
- `loadCompetition()` - Fetch competition details
- `loadExistingEnds()` - Restore athlete's ends from backend
- `submitEnd(end: End)` - POST end to API with idempotency
- `retryFailedEnd(endNumber: number)` - Retry after network failure
- `syncQueuedEnds()` - Background sync when online
- `resumeIncompleteEnd()` - Restore mid-end progress

**Events Emitted:**
- `@end-confirmed` - When end successfully saved
- `@network-error` - When API call fails

---

#### 2. `EndRow.vue`

**Purpose:** Display single end with arrows, sum, and actions

**Props:**
```typescript
interface Props {
  end: End
  isActive: boolean
  isLocked: boolean
}
```

**Emits:**
```typescript
interface Emits {
  (e: 'confirm'): void
  (e: 'focus'): void
}
```

**Computed:**
- `showConfirm` - Show confirm button when 6 arrows entered
- `endSum` - Sum of arrow values (X=10, M=0)

**Visual States:**
- Active: Highlighted border, expanded
- Locked: Gray background, small green check icon
- Saving: Spinner overlay
- Error: Red border, inline error message with Retry button

---

#### 3. `ArrowCell.vue`

**Purpose:** Display single arrow score with ring-authentic color

**Props:**
```typescript
interface Props {
  value: ScoreValue | null
  index: number // 0-5
}
```

**Computed:**
- `backgroundColor` - Maps score to ring color (#e8de27, #d92d41, etc.)
- `textColor` - Black or white for contrast
- `isEmpty` - Returns true if value is null

**Template:**
```vue
<div 
  class="arrow-cell"
  :style="{
    background: backgroundColor,
    color: textColor
  }"
>
  {{ displayValue }}
</div>
```

---

#### 4. `ScorePad.vue`

**Purpose:** Fixed bottom input pad with score buttons

**Props:**
```typescript
interface Props {
  disabled: boolean // True when end is confirmed/locked
  currentArrowIndex: number // Which arrow slot to fill next
}
```

**Emits:**
```typescript
interface Emits {
  (e: 'score-input', value: ScoreValue): void
  (e: 'delete-last'): void
}
```

**Layout:**
```typescript
const scoreLayout = [
  ['X', '10', '9', '8', '←'],
  ['7', '6', '5', '4', null],
  ['3', '2', '1', 'M', null]
]
```

**Behavior:**
- Buttons use Vuetify `v-btn` with `:color="getRingColor(score)"`
- Delete button (←) only enabled when arrows exist in current end
- All buttons disabled when `disabled` prop is true

---

#### 5. `ScoresheetHeader.vue`

**Purpose:** Display competition name and live stats

**Props:**
```typescript
interface Props {
  competition: Competition
  stats: ScoreStats
}
```

**Template:**
```vue
<div class="scoresheet-header">
  <h2>{{ competition.name }}</h2>
  <div class="stats-row">
    <span>{{ competition.distance }}</span>
    <span>Golds: {{ stats.goldsCount }}</span>
    <span>Avg: {{ stats.average.toFixed(2) }}</span>
  </div>
</div>
```

---

### Composition Functions (Composables)

#### `useScoreCalculation.ts`

```typescript
export function useScoreCalculation() {
  const scoreToNumber = (value: ScoreValue): number => {
    if (value === 'X' || value === '10') return 10
    if (value === 'M') return 0
    return parseInt(value)
  }
  
  const calculateEndSum = (arrows: Arrow[]): number => {
    return arrows.reduce((sum, arrow) => 
      sum + (arrow.value ? scoreToNumber(arrow.value) : 0), 0
    )
  }
  
  const isGold = (value: ScoreValue): boolean => {
    return value === 'X' || value === '10'
  }
  
  return { scoreToNumber, calculateEndSum, isGold }
}
```

#### `useOfflineSync.ts`

```typescript
export function useOfflineSync() {
  const isOnline = ref(navigator.onLine)
  const queue = ref<End[]>([])
  
  const queueEnd = (end: End) => {
    queue.value.push(end)
    localStorage.setItem('scoreQueue', JSON.stringify(queue.value))
  }
  
  const syncQueue = async () => {
    if (!isOnline.value || queue.value.length === 0) return
    
    for (const end of queue.value) {
      try {
        await apiSubmitEnd(end)
        queue.value = queue.value.filter(e => e.endNumber !== end.endNumber)
      } catch (error) {
        console.error('Sync failed for end', end.endNumber)
      }
    }
    
    localStorage.setItem('scoreQueue', JSON.stringify(queue.value))
  }
  
  // Listen to online/offline events
  window.addEventListener('online', () => {
    isOnline.value = true
    syncQueue()
  })
  
  return { isOnline, queueEnd, syncQueue }
}
```

---

---

## Interactive Prototype

**File:** `ux-scoresheet-prototype.html`

**Features Demonstrated:**
- Mobile device frame (375px × 667px)
- Sequential arrow input (left-to-right, 6 arrows per end)
- Ring-authentic color coding for all scores
- Live statistics (Golds count, Average, Total)
- Confirm action after 6th arrow (green check button)
- Delete last arrow (← button in score pad)
- Locked end state after confirmation
- Saving overlay simulation (800ms delay)
- Auto-advance to next end after confirmation
- Scrollable ends list with active end highlighting
- Orange sum display on the right after 6 arrows entered or confirmed

**Try it:**
1. Open `ux-scoresheet-prototype.html` in a browser
2. Tap score buttons (X, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, M)
3. After 6 arrows, tap green ✓ to confirm or red ✕ to cancel
4. Watch stats update in real-time
5. Scroll to see all 12 ends

---

## Workflow Outputs Summary

**Artifacts Created:**

1. **UX Design Specification** (`ux-design-specification.md`)
   - Screen layout and behavior
   - Data contract (API endpoints)
   - Color mapping and accessibility
   - Design modularity strategy
   - Component architecture
   - TypeScript type definitions
   - Composables for scoring logic and offline sync

2. **Color Theme System** (`ux-color-themes.html`)
   - Brand colors (Primary #1565c0, Accent #ff6f00)
   - Semantic colors (Success, Error, Warning, Info)
   - Target ring colors with visual swatches
   - Vuetify theme configuration code
   - Score pad demo preview

3. **Interactive Prototype** (`ux-scoresheet-prototype.html`)
   - Fully functional mobile scoresheet
   - Ring-authentic colors
   - Sequential input flow
   - Confirm/cancel logic
   - Live statistics

---

## Implementation Roadmap

### Epic 10: Mobile & Responsive UI

**Story 10.3: Core Scoresheet Component Library**
- **Deliverables:**
  - `ArrowCell.vue` - Single arrow display with ring colors
  - `ScoreButton.vue` - Score input button with touch feedback
  - `useScoreCalculation.ts` - Composable for score logic
- **Acceptance Criteria:**
  - ArrowCell displays correct color for each score value
  - ScoreButton has proper touch target size (48dp minimum)
  - Score-to-number conversion handles X/10/M correctly
- **Estimated Effort:** 2-3 hours

**Story 10.4: Qualification Scoresheet Layout**
- **Deliverables:**
  - `ScoresheetView.vue` - Main container view
  - `ScoresheetHeader.vue` - Competition name + stats
  - `EndRow.vue` - Single end display
  - `EndsList.vue` - Scrollable list wrapper
  - `ScorePad.vue` - Fixed bottom input pad
- **Acceptance Criteria:**
  - Sequential input works left-to-right
  - Confirm/cancel appears after 6 arrows
  - Active end is highlighted, locked ends are grayed
  - Stats update immediately on input
- **Estimated Effort:** 4-6 hours
- **Depends on:** Story 10.3

**Story 10.5: Offline Queue & Resume Logic**
- **Deliverables:**
  - `useOfflineSync.ts` - Composable for queue management
  - `scoring.store.ts` - Pinia store for scoresheet state
  - IndexedDB schema for local persistence
- **Acceptance Criteria:**
  - Failed end submissions queue locally
  - Background sync flushes queue when online
  - Mid-end progress persists across app close/reopen
  - Resume opens to the incomplete end/arrow
- **Estimated Effort:** 3-4 hours
- **Depends on:** Story 10.4

**Story 10.6: Elimination Scoresheet Variant**
- **Deliverables:**
  - `EliminationLayout.vue` - Set-based scoring (3 arrows/set)
  - Opponent side-by-side display
  - Set points calculation (2-1-0)
- **Acceptance Criteria:**
  - Layout adapts to `competitionType="elimination"`
  - Shows opponent scores in real-time (SignalR)
  - Calculates set winners correctly
- **Estimated Effort:** 3-4 hours
- **Depends on:** Story 10.4

### Epic 5: Real-Time Qualification Scoring

**Story 5.4: Backend API for End Submission**
- **Deliverables:**
  - `POST /api/v1/events/{eventId}/competitions/{competitionId}/rounds/{roundId}/ends`
  - Idempotency key support (prevent duplicate submissions)
  - Validation (athlete authorized, scoring open, arrows count correct)
- **Acceptance Criteria:**
  - Returns 200 OK on success with locked timestamp
  - Returns 412 Conflict if scoring closed
  - Returns 503 if service unavailable
  - Duplicate requests return cached response
- **Estimated Effort:** 2-3 hours
- **Depends on:** Epic 1 (Infrastructure), Epic 2 (Auth)

**Story 5.5: SignalR Hub for Score Broadcast**
- **Deliverables:**
  - `ScoringHub.cs` - SignalR hub for real-time updates
  - Client event: `OnEndConfirmed(athleteId, endNumber, sum)`
  - Frontend: Subscribe to hub and update leaderboard
- **Acceptance Criteria:**
  - All connected clients receive end updates within 500ms
  - Reconnection logic handles dropped connections
  - Updates scoped to competition (not global broadcast)
- **Estimated Effort:** 2-3 hours
- **Depends on:** Story 5.4

---

## Next Steps (Post-UX Design)

1. ✅ **Design Completed** - All artifacts ready for implementation
2. **Review with Dev Team** - Walk through component specs and API contract
3. **Story Prioritization** - Add Epic 10.3-10.6 and Epic 5.4-5.5 to sprint backlog
4. **Begin Implementation** - Start with Story 10.3 (Core Components)
5. **UX Validation** - Test prototype with real users (archers) for feedback

---

**UX Design Workflow Complete** ✅

All deliverables saved:
- `docs/ux-design-specification.md`
- `docs/ux-color-themes.html`
- `docs/ux-scoresheet-prototype.html`
