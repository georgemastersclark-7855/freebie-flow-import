

## Apply Aesthetic Changes to All Landing Page Variants

Syncing 4 changes from `/theproducerblueprint005workflow` to the other 4 variants: `001`, `002Spotify`, `003Career`, `004Gear`.

---

### Change 1: Testimonials Section Gap (Credits Ticker to Social Proof)

Reduce `md:pt-32` to `md:pt-8` on the Mini Social Proof section.

| File | Line |
|------|------|
| TheProducerBlueprint001.tsx | 1191 |
| TheProducerBlueprint002Spotify.tsx | 1165 |
| TheProducerBlueprint003Career.tsx | 1188 |
| TheProducerBlueprint004Gear.tsx | 1188 |

---

### Change 2: Problem Section Cards -- Add Gradient Background

All 4 problem "pain point" cards in each variant currently use `className="space-y-1.5 relative"` (no card styling). Add the curriculum-matching gradient container:

**Before:** `<div className="space-y-1.5 relative ...`
**After:** `<div className="rounded-xl border border-zinc-800 bg-gradient-to-b from-zinc-900 via-[#0A0A0A] to-black backdrop-blur-sm p-4 md:p-5 space-y-1.5 relative ...`

Applied to all 4 pain point cards per variant:

| File | Lines (approx) |
|------|------|
| 001 | 1261, 1275, 1320, 1334 |
| 002Spotify | 1234, 1248, 1293, 1307 |
| 003Career | 1258, 1272, 1317, 1331 |
| 004Gear | 1255, 1269, 1314, 1328 |

---

### Change 3: Solution Section Cards -- Gradient + Ambient Glow

Two sub-changes:

**a) Card styling:** Replace `bg-[#0A0A0A] border border-white/15` with `bg-gradient-to-b from-zinc-900 via-[#0A0A0A] to-black border border-zinc-800` and update hover to `hover:border-zinc-600 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]`.

| File | Line |
|------|------|
| 001 | 1419 |
| 002Spotify | 1392 |
| 003Career | 1416 |
| 004Gear | 1413 |

**b) Ambient glow behind card grid:** Wrap the grid in a `relative` container and add the desaturated radial glow div, matching 005's implementation:

```tsx
<div className="relative">
  <div 
    className="absolute inset-0 pointer-events-none z-0"
    style={{
      background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.10) 0%, rgba(200,200,200,0.05) 45%, transparent 75%)'
    }}
  />
  <div className="grid ... relative z-10">
```

| File | Grid line |
|------|------|
| 001 | 1412 |
| 002Spotify | 1385 |
| 003Career | 1409 |
| 004Gear | 1406 |

---

### Change 4: Story Section Cards -- Ambient Glow

Add the same desaturated ambient glow behind the story card grid (the Polaroid photos). Wrap the existing `grid` div in a `relative` container with the glow.

| File | Grid line |
|------|------|
| 001 | 1510 |
| 002Spotify | 1483 |
| 003Career | 1507 |
| 004Gear | 1504 |

---

### Summary

- **Files modified:** 4 (001, 002Spotify, 003Career, 004Gear)
- **Total edits:** ~28 individual changes across the 4 files
- **No copy changes** -- only styling/spacing modifications, maintaining structural parity

