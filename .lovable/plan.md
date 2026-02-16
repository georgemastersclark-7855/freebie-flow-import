

## Match Career Hero Styling to Gear Variant

### What's Different
The only styling difference between the two hero sections is the `hero-headline-career` CSS class on the Career variant's `<h1>` tag (line 830 of `TheProducerBlueprint003Career.tsx`). This class forces a smaller mobile font size (`2.5rem` instead of the default `3rem`). The Gear variant does not use this class.

### Change
Remove `hero-headline-career` from the Career variant's `<h1>` className so both variants use the same base `hero-headline` class and identical mobile font sizing.

**File:** `src/pages/TheProducerBlueprint003Career.tsx` (line 830)

```
// Before
className="hero-headline hero-headline-career text-2xl md:text-5xl ..."

// After
className="hero-headline text-2xl md:text-5xl ..."
```

**Note:** The Career headline is longer than the Gear headline, so at `3rem` on mobile it will wrap more. If it looks too large, we can revisit.

One-line change. No other files or elements affected.
