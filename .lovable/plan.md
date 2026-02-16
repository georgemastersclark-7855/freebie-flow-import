

## Move GIF into Close Section and Remove Old Crossroads

### What's happening now

- **Gear (004)** and **Workflow (005)** both have the new Close Section (two-column contrast + bridge copy) AND the old "two choices" crossroads section with the gif still sitting below the checkout. The crossroads should have been removed already.
- **Career (003)** has the Close Section but no gif anywhere on the page.

### Changes

**1. Gear variant (004)** -- `src/pages/TheProducerBlueprint004Gear.tsx`
- Add the gif (with glow + hover effect) into the Close Section, placed between the two-column contrast block and the bridge copy (centered, matching the existing gif styling)
- Delete the entire "FINAL SELL: THE CROSSROADS" section (lines ~1926-1980)

**2. Workflow variant (005)** -- `src/pages/TheProducerBlueprint005Workflow.tsx`
- Same as above: add gif into the Close Section between the contrast block and bridge copy
- Delete the entire "FINAL SELL: THE CROSSROADS" section (lines ~1915-1969)

**3. Career variant (003)** -- `src/pages/TheProducerBlueprint003Career.tsx`
- Add the same gif block into the Close Section between the contrast block and bridge copy, matching the other two variants exactly

### GIF placement (all three pages, identical markup)

Positioned inside the Close Section's `max-w-5xl` container, after the two-column grid closes and before the bridge copy div. Centered with glow effect:

```text
</div>  (end of two-column grid)

<!-- GIF visual anchor -->
<div class="flex justify-center py-12 md:py-16">
  <div class="relative group max-w-md w-full">
    <div class="absolute top-1/2 left-1/2 ... glow"></div>
    <img src={robChainsmokersGif} ... />
  </div>
</div>

<!-- BRIDGE COPY -->
<div class="text-center py-16 ...">
```

### Files modified
- `src/pages/TheProducerBlueprint003Career.tsx`
- `src/pages/TheProducerBlueprint004Gear.tsx`
- `src/pages/TheProducerBlueprint005Workflow.tsx`

