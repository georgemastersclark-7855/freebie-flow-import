

## Remove Vignette and Style as a Square Video

The looping studio video currently uses a radial gradient mask (vignette) and an `aspect-video` container. The plan is to remove the vignette, make it a square with rounded corners and a subtle border/glow treatment across all 5 landing page variants.

### Changes (applied identically to all 5 pages)

**Section: "VISUAL EVIDENCE: STUDIO POV"** (the `robWorking3Loop` video between the curriculum and instructor sections)

1. Remove the radial gradient `maskImage` / `WebkitMaskImage` style from the `<video>` element
2. Change the container from `aspect-video` to `aspect-square` for a square crop
3. Reduce max width slightly (`max-w-md`) so the square is well-proportioned
4. Add `rounded-2xl overflow-hidden` to the container for rounded corners
5. Add a subtle ring/border (`ring-1 ring-white/10`) for definition against the dark background
6. Keep the existing backlight glow behind it for ambiance

### Files to edit
- `src/pages/TheProducerBlueprint001.tsx`
- `src/pages/TheProducerBlueprint002Spotify.tsx`
- `src/pages/TheProducerBlueprint003Career.tsx`
- `src/pages/TheProducerBlueprint004Gear.tsx`
- `src/pages/TheProducerBlueprint005Workflow.tsx`

### Technical detail

The video container changes from:
```text
<div class="relative w-full aspect-video z-10">
  <video ... style="mask-image: radial-gradient(...)">
```
To:
```text
<div class="relative w-full aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10 z-10">
  <video ... (no mask styles)>
```

No copy, routing, tracking, or checkout changes. Visual layout and section order unchanged.
