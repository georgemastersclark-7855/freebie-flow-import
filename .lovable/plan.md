

## Fix: Video Testimonial Horizontal Scroll Glitch on Mobile

### Root Cause
The parent `<section>` wrapping the entire Wall of Wins area (line 1353) has `overflow-hidden`. This clips the horizontally scrollable testimonial gallery inside it, causing the browser to fight between the container's hidden overflow and the gallery's `overflow-x-auto`, resulting in the scroll snapping back to the start.

### Solution
Change the section's `overflow-hidden` to `overflow-x-clip` (or remove it and scope the overflow control more tightly). `overflow-x-clip` still hides the decorative background glow from bleeding out horizontally, but does not interfere with the scroll mechanics of child elements the way `overflow-hidden` does.

### File to Edit
**`src/pages/TheProducerBlueprint003Career.tsx`** -- line 1353

```
// Before
<section id="testimonials" className="relative py-12 md:py-24 overflow-hidden scroll-mt-20">

// After
<section id="testimonials" className="relative py-12 md:py-24 overflow-x-clip scroll-mt-20">
```

This same fix should be applied to all 5 variant pages if they share the same structure:

- `src/pages/TheProducerBlueprint001.tsx`
- `src/pages/TheProducerBlueprint002Spotify.tsx`
- `src/pages/TheProducerBlueprint003Career.tsx`
- `src/pages/TheProducerBlueprint004Gear.tsx`
- `src/pages/TheProducerBlueprint005Workflow.tsx`

One-line change per file. The decorative glow remains clipped; horizontal card scrolling works freely on mobile.
