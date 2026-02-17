

## Fix Spacing and Background Banding on Studio POV Video Section

### Issue 1: Background Banding
The video section has no explicit background color. The curriculum section above uses `bg-[#050505]` and the instructor section below uses `bg-black` (`#000`). The video section inherits the page default, creating a visible color band. The `bg-indigo-600/30 blur-[80px]` backlight glow also adds a faint purple tint that makes the difference more noticeable.

**Fix**: Add `bg-black` to the video section so it seamlessly blends with the instructor section below. Also change the backlight glow from `bg-indigo-600/30` to a more neutral `bg-white/5` to avoid any purple tinting of the surrounding area.

### Issue 2: Unbalanced Spacing
The section currently uses `py-8` which may look tight above and below. We'll increase to `py-16` for balanced breathing room above and below the video.

### Changes (identical across all 5 pages)

The video section changes from:
```
<section className="relative z-10 px-6 py-8 pointer-events-none">
```
To:
```
<section className="relative z-10 px-6 py-16 pointer-events-none bg-black">
```

And the backlight glow changes from:
```
<div className="absolute inset-0 bg-indigo-600/30 blur-[80px] ...">
```
To:
```
<div className="absolute inset-0 bg-white/5 blur-[80px] ...">
```

### Files to edit
- `src/pages/TheProducerBlueprint001.tsx`
- `src/pages/TheProducerBlueprint002Spotify.tsx`
- `src/pages/TheProducerBlueprint003Career.tsx`
- `src/pages/TheProducerBlueprint004Gear.tsx`
- `src/pages/TheProducerBlueprint005Workflow.tsx`

No copy, layout order, tracking, or checkout changes.
