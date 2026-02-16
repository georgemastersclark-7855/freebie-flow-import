

## Redesign Problem Section Cards — Clean Monotone Style

### What changes

Remove all hand-drawn sketch SVG elements (underlines, circles, arrows) from the Problem section cards on all three variants. Replace with a clean, monotone aesthetic — no lime/neon green accents anywhere.

### Card redesign details

**Remove from each card:**
- SVG scribble underlines on titles
- SVG circle annotations on titles
- SVG arrow elements pointing to center video
- The `inline-block` / `relative` wrappers that only existed for SVG positioning
- The `group` class on cards (no longer needed)

**New card style (monotone):**
- Add a subtle top border accent: `border-t border-t-white/10` (just a faint white line for visual separation)
- Card titles use a small white dot bullet: `<span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0"></span>` as a clean marker
- Everything stays in the white/zinc palette — no color accents

**Tighten mobile spacing:**
- Card column gap reduced from `space-y-10 md:space-y-16` to `space-y-6 md:space-y-12`

### What stays the same
- 3-column grid layout (left cards / center video / right cards)
- Card gradient backgrounds (`from-zinc-900 via-[#0A0A0A] to-black`)
- All copy unchanged
- Video, section headline, connector line all unchanged

### Files modified
- `src/pages/TheProducerBlueprint003Career.tsx`
- `src/pages/TheProducerBlueprint004Gear.tsx`
- `src/pages/TheProducerBlueprint005Workflow.tsx`

### Per-card change

Before:
```text
<div className="rounded-xl border border-zinc-800 bg-gradient-to-b ... relative group">
  <h4 className="... relative inline-block">
    Title
    <svg ...scribble underline.../>
  </h4>
  <p>...</p>
  <div className="hidden md:block absolute ...">
    <svg ...arrow.../>
  </div>
</div>
```

After:
```text
<div className="rounded-xl border border-zinc-800 border-t border-t-white/10 bg-gradient-to-b ... relative">
  <h4 className="text-white font-medium text-base md:text-lg flex items-center justify-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0"></span>
    Title
  </h4>
  <p>...</p>
</div>
```

