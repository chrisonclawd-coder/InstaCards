# Article-to-Flashcards - UI/UX Fixes Checklist

## Content & Data Issues

### 1. Title Mismatch
- **Issue:** Page titled "Article-to-Flashcards" but content is generic "Project Dashboard"
- **Fix:** Update page title to match content or rebrand content to "Project Dashboard"

### 2. Inconsistent Task Statuses
- **Issue:** "Set Up Environment Variables" shows ✅ and "In-Progress" simultaneously
- **Issue:** "Submit to Chrome Web Store" shows 0% progress but status "Done"
- **Fix:** Ensure single source of truth for status/progress
  - Either: Status field determines progress
  - Or: Progress field determines status
  - Remove duplicate status indicators

### 3. Missing Status & Priority Labels
- **Issue:** "Setup SEO" task missing status label (To Do / In Progress / Done)
- **Issue:** "Setup SEO" missing priority at end of line
- **Fix:** Add missing status and priority to all tasks

### 4. Unclear Metrics
- **Issue:** Metrics shown as raw numbers: "Active Projects 8", "Tasks Completed 42%", etc.
- **Fix:**
  - Add visual hierarchy (larger text for key metrics)
  - Add explanations/labels (e.g., "8 Active Projects" instead of just "8")
  - Show trend indicators (↑ ↓) where applicable

---

## UX & Structure Issues

### 5. No Project Separation
- **Issue:** All tasks in one long column, hard to scan by project
- **Fix:** Group tasks by project with visual separators
  - Add project headers or cards
  - Use collapsible sections for each project
  - Add color coding by project

### 6. Non-functional Filters
- **Issue:** Search, status, priority filters don't appear to affect content
- **Fix:**
  - Implement filter logic in frontend
  - Add "No results found" message when filters exclude all tasks
  - Add visual feedback when filters are active

### 7. Inconsistent Progress Representation
- **Issue:** Some tasks show "Progress 100%" with checkmark, others show 0–50%
- **Issue:** Promised progress bars/charts not visible
- **Fix:**
  - Implement visual progress bars for all tasks
  - Add circular charts for overall project progress
  - Show progress consistently across all tasks

### 8. Unclear "AI PLATFORMS" Section
- **Issue:** List (Claude, ChatGPT, Gemini, Grok, Perplexity) looks clickable but has no behavior
- **Fix:**
  - Add hover effects/indications
  - Make them actual interactive buttons with tooltips
  - Or rebrand as informational badges

---

## Visual / Layout Issues

### 9. Cramped Icons & Labels
- **Issue:** Project icon, name, progress, priority, status all tight together
- **Fix:**
  - Increase spacing between elements
  - Use badges/labels for status/priority instead of inline text
  - Group related info in card-like containers

### 10. "Projects" Summary Mixed with List
- **Issue:** "All Projects 21 total tasks" appears mixed with project list
- **Fix:**
  - Move summary to top as a sticky header
  - Use card layout for project list
  - Add "View All Projects" / "View Specific Project" navigation

### 11. Footer Actions Look Raw
- **Issue:** "Copy Markdown", "Download .md", "Minimize Overlay", "Open with MDify", "logo icon" look like raw labels
- **Fix:**
  - Style as proper toolbar buttons
  - Add icons to each action
  - Add hover effects and tooltips
  - Group related actions

---

## Consistency & Naming Issues

### 12. Priority Labels Without Visual Cues
- **Issue:** "HIGH", "MEDIUM" labels appear without color badges
- **Fix:**
  - Add color coding (🔴 HIGH, 🟡 MEDIUM, 🟢 LOW)
  - Use badges or colored text for consistency

### 13. Inconsistent Session Task Wording
- **Issue:** X Strategy tasks use different wording (some "Engage with 10 posts + post 1 trending topic", others "+ growth insights")
- **Fix:** Standardize wording format across all session tasks

### 14. Missing Status Text Endings
- **Issue:** Some tasks end abruptly (e.g., "Setup SEO" line ends at "0%" with no priority/status)
- **Fix:** Ensure all tasks follow consistent format

---

## Recommended Order of Fixes

1. **High Priority (Blocks usability):**
   - Fix #2: Inconsistent task statuses
   - Fix #5: Add project separation
   - Fix #6: Make filters functional

2. **Medium Priority (Improves clarity):**
   - Fix #3: Add missing labels
   - Fix #12: Add visual priority cues
   - Fix #7: Add progress bars/charts

3. **Low Priority (Polish):**
   - Fix #1: Title mismatch
   - Fix #8: Clarify AI Platforms section
   - Fix #9: Improve spacing
   - Fix #10: Better project summary
   - Fix #11: Style footer
   - Fix #13-14: Standardize wording

---

## Data Model Updates Needed

### Task Status Field
- Current: Mix of ✅ emoji, text statuses ("In-Progress", "Done")
- Better: Single enum field: `TODO | IN_PROGRESS | DONE`
- Progress field: `0-100` percentage
- Relationship: Status derived from progress (100% = DONE)

### Project Structure
- Separate projects array with metadata
- Tasks array with `projectId` reference
- Filter by `projectId` to group tasks

### UI Components Needed
- Project card component
- Task list with project grouping
- Progress bar component
- Badge component for status/priority
- Filter toolbar component

---

## Next Steps

1. **Priority 1:** Fix task status inconsistency (#2)
2. **Priority 2:** Implement project separation (#5)
3. **Priority 3:** Make filters functional (#6)
4. **Priority 4:** Add visual progress bars (#7)
5. **Priority 5:** Polish remaining issues

Would you like me to start fixing these issues in the code? I can prioritize based on your preferences.
