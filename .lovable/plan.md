
## Fix: Visible Ambient Glow Behind Solution Feature Cards

### Why It's Not Working

The current glow div is placed **inside** each individual card, which has `overflow-hidden` set. This clips the glow to the card boundaries. Combined with only 4% white opacity against a near-black background, it's completely invisible.

### The Fix

1. **Remove** the per-card glow div (lines 1402-1403) from inside the `.map()` loop
2. **Add a single large glow** positioned behind the entire 2x2 card grid, outside the cards, with higher opacity

### Technical Details

**File:** `src/pages/TheProducerBlueprint005Workflow.tsx`

**Step 1 -- Delete lines 1402-1403** (the inner-card glow):
```tsx
{/* Desaturated ambient glow behind card */}
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, rgba(200,200,200,0.02) 40%, transparent 70%)' }} />
```

**Step 2 -- Add a glow behind the grid container.** Find the grid wrapper `<div>` (line 1394, the `grid grid-cols-1 md:grid-cols-2 gap-4` div) and wrap it in a `relative` container with an ambient glow behind it:

```tsx
<div className="relative">
  {/* Desaturated ambient glow behind card grid */}
  <div 
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none z-0"
    style={{
      background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(200,200,200,0.03) 40%, transparent 70%)'
    }}
  />
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
    {/* ...existing card map... */}
  </div>
</div>
```

This places a single, larger glow that spans the full card grid area at 6% opacity (visible but desaturated), and isn't clipped by any `overflow-hidden`.
