

## Update Problem and Solution Headlines Across All Variants

Apply the same bolder headline styling (already done on 005Workflow) to the Problem and Solution section headlines on all four remaining variants.

### The Change

**From:** `text-4xl md:text-6xl font-semibold tracking-tight`
**To:** `text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] md:tracking-[-0.04em] md:font-bold`

### Files and Lines

**1. TheProducerBlueprint001.tsx**
- Problem headline (line 1245)
- Solution headline (line 1396)

**2. TheProducerBlueprint002Spotify.tsx**
- Problem headline (line 1219)
- Solution headline (line 1370)

**3. TheProducerBlueprint003Career.tsx**
- Problem headline (line 1242)
- Solution headline (line 1393)

**4. TheProducerBlueprint004Gear.tsx**
- Problem headline (line 1239) -- keeps the existing `problem-headline-gear` class for mobile override
- Solution headline (line 1390)

### What stays the same
- All headline content, line breaks, italic serif spans, and drop-shadow attributes
- The `problem-headline-gear` mobile override class on variant 004
- Every other section on every page

