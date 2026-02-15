

## Diagnose and Fix Invisible Problem Section Glow

### The Problem

The glow div exists at lines 1220-1226 but is invisible because:
- It uses **dark red** colors (`rgba(180,30,30,...)` and `rgba(120,20,20,...)`) on a near-black `#050505` background
- The opacity values are extremely low: **0.08** and **0.04** (4-8% opacity)
- For comparison, the hero VSL glow uses **bright lime** colors at **0.15** and **0.08** opacity -- nearly double the strength with a much more visible color

### The Fix

Replace the invisible red glow with the same lime glow used behind the hero VSL (line 1053-1055).

**File:** `src/pages/TheProducerBlueprint005Workflow.tsx`

**Lines 1220-1226 -- from:**
```tsx
{/* Deep Red Ambient Glow Behind Tutorial Hell */}
<div 
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] pointer-events-none z-0"
  style={{
    background: 'radial-gradient(ellipse at center, rgba(180,30,30,0.08) 0%, rgba(120,20,20,0.04) 40%, transparent 70%)',
  }}
/>
```

**To:**
```tsx
{/* Ambient Glow Behind Problem Section */}
<div 
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] pointer-events-none z-0"
  style={{
    background: 'radial-gradient(ellipse at center, rgba(180,230,0,0.15) 0%, rgba(211,255,2,0.08) 40%, transparent 70%)',
  }}
/>
```

This uses the exact same gradient values as the hero VSL glow, so the two sections will feel visually connected. No other changes needed.
