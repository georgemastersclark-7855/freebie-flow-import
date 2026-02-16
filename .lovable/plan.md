

## Mobile Testimonial Readability Fix

**Problem**: The "More Feedback From The Community" masonry grid uses `columns-2` on mobile, making each DM screenshot too small to read comfortably.

**Solution**: Switch to a single-column layout on mobile with a "show more" pattern to keep the section manageable, while keeping the current 2/3-column masonry on tablet/desktop.

### Changes (applied to ALL variants)

**1. Single-column masonry on mobile**
- Change `columns-2 lg:columns-3` to `columns-1 sm:columns-2 lg:columns-3`
- This makes each screenshot full-width on phones, so text in the DMs is actually readable

**2. Collapse with "Show More" on mobile**
- Show only the first 4 screenshots on mobile by default
- Add a "Show More" button that reveals the rest
- Desktop remains unchanged (all visible, no button)
- This prevents an overwhelmingly long scroll on phones while keeping all social proof accessible

**3. Increase mobile card width**
- Remove the `max-w-[92%]` constraint on the mini social proof section's mobile cards as well, letting them use full container width for better readability

### Technical Details

- Add a `showAllWallOfProof` state variable (useState, default false)
- On mobile, render only the first 4 items; when toggled, render all
- The toggle button uses the existing muted text styling (`text-zinc-500`, `border-zinc-800`)
- Hide the toggle on `md:` breakpoint since desktop shows all items naturally
- Apply the `columns-1 sm:columns-2 lg:columns-3` change to the wall-of-proof grid in all 5 variant files

### Files to modify
- `src/pages/TheProducerBlueprint001.tsx`
- `src/pages/TheProducerBlueprint002Spotify.tsx`
- `src/pages/TheProducerBlueprint003Career.tsx`
- `src/pages/TheProducerBlueprint004Gear.tsx`
- `src/pages/TheProducerBlueprint005Workflow.tsx`
