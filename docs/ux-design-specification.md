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
- After 6 arrows, two rounded action icons appear to the right of the row:
  - Green rounded check icon (confirm end)
  - Red rounded cross icon (cancel end / edit)
- If user taps the green check: attempt to persist the end to backend and lock the row on success.
- If user taps the red cross: clear the current end (or allow left-to-right deletes) and stay on that end for editing.

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
4. After 6th arrow, check and cancel icons appear; tapping check persists to backend and locks the row.
5. On network failure the app shows "Failed to save. Retry?" and allows retry or queues for background sync.
6. If app closed mid-end, returning to scoresheet restores the incomplete end and focuses the next arrow.
7. Athlete cannot edit earlier ends once locked; host/refs can override via separate admin UI.

---

## Edge cases & notes

- If host closes scoring for the competition between entries, POST returns 412 — show message: "Scoring closed by host." and rollback local end.
- If duplicate confirm attempts occur, backend must be idempotent (use request idempotency key).
- Consider small haptic feedback on confirm for native wrappers; for web, a micro-animation is sufficient.

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

## Next steps (implementation-ready)

1. **Design System Decision**: Choose color palette, typography, spacing system (next workflow step)
2. **Component Scaffolding**: Generate Vue 3 component skeletons with props/events contracts
3. **High-Fidelity Prototype**: Create interactive HTML/CSS prototype (mobile 375px width)
4. **Story Sequencing**: Insert new UX stories into Epic 5 & 10 with proper dependencies

This spec is approved and ready for component design.
