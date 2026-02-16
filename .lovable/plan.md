

## Fix: Uneven Gap Between Pain Point Cards on Mobile

### Problem
On mobile, the Problem section stacks three groups vertically: left cards (1-2), center image, and right cards (3-4). The outer container uses `gap-12` (3rem) between these groups, but the cards within each group use `space-y-6` (1.5rem). This creates a noticeably larger gap between cards 2 and 3 (where the image sits in between).

### Solution
Change `gap-12` to `gap-6` on mobile so the spacing between all four cards is uniform. The desktop gap (`md:gap-8`) stays unchanged.

### Files to Edit
Replace `gap-12 md:gap-8` with `gap-6 md:gap-8` on the cinematic grid layout div in all 5 variants:

- `src/pages/TheProducerBlueprint001.tsx` (line 969)
- `src/pages/TheProducerBlueprint002Spotify.tsx` (line 928)
- `src/pages/TheProducerBlueprint003Career.tsx` (line 966)
- `src/pages/TheProducerBlueprint004Gear.tsx` (line 963)
- `src/pages/TheProducerBlueprint005Workflow.tsx` (line 959)

One-line change per file. No other elements affected.
