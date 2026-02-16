

## Make Polaroids Smaller on Mobile (About Rob Section)

### Change
Reduce the mobile width of each polaroid card from `w-[85%] max-w-[280px]` to `w-[65%] max-w-[200px]`, keeping the desktop sizing unchanged (`md:w-full`).

### Files to Edit
This applies to all 5 polaroid items in each of the 5 variant pages. Each polaroid's inner div follows the same pattern:

```
// Before
w-[85%] ... md:w-full md:translate-x-0 max-w-[280px]

// After  
w-[65%] ... md:w-full md:translate-x-0 max-w-[200px] md:max-w-[280px]
```

5 polaroid cards per file, across all 5 files:

- `src/pages/TheProducerBlueprint001.tsx`
- `src/pages/TheProducerBlueprint002Spotify.tsx`
- `src/pages/TheProducerBlueprint003Career.tsx`
- `src/pages/TheProducerBlueprint004Gear.tsx`
- `src/pages/TheProducerBlueprint005Workflow.tsx`

25 one-line edits total. No other elements affected. Desktop layout stays identical.
