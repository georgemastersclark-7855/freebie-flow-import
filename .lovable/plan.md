

## Fix: Visible Ambient Glow Behind Story Cards

### Why It's Still Invisible

Two problems:

1. **Clipping:** The parent `<section>` (line 1458) has `overflow-x-hidden`, so the glow's `w-[140%]` gets cut off horizontally.
2. **Too faint:** 6% white opacity on a black background is nearly invisible -- same issue as the previous solution cards fix.

### The Fix

Change the glow to stay within bounds (`w-full h-full` instead of 140%) and increase opacity so it's actually visible. Keep it desaturated (white-based, not green).

**File:** `src/pages/TheProducerBlueprint005Workflow.tsx`

**Lines 1494-1499 -- replace the glow div:**

From:
```tsx
<div 
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none z-0"
  style={{
    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, rgba(200,200,200,0.03) 40%, transparent 70%)'
  }}
/>
```

To:
```tsx
<div 
  className="absolute inset-0 pointer-events-none z-0"
  style={{
    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.10) 0%, rgba(200,200,200,0.05) 45%, transparent 75%)'
  }}
/>
```

Changes:
- Use `inset-0` instead of oversized width/height so it isn't clipped by the parent's `overflow-x-hidden`
- Increase opacity from 6%/3% to **10%/5%** so it's actually visible against `bg-black`

Also apply the same fix to the **Solution section** glow (around line 1394) which likely has the same clipping issue.

