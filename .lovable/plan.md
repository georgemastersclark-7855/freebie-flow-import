

## Fix: Preload Only the ONE Page the Visitor Is Loading

### The Problem

Right now, lazy loading creates a waterfall: the browser downloads React, starts the router, THEN requests the page chunk as a second download. That second download is the black screen.

Eager-importing all 5 pages would fix the waterfall but bundles all 5 pages into one file -- wasteful when the visitor only needs one.

### The Proper Fix

Add a **preload trigger** in `src/main.tsx` that fires the `import()` for the matching page **immediately**, before React even starts. This means the page chunk downloads **in parallel** with React initialization instead of after it.

The visitor hitting `/produce-without-expensive-gear` only downloads that one page's code. The other 4 pages are never touched.

```text
Current waterfall (sequential):
  Download main.js → Parse React → Start Router → Download page chunk → Render
  |________________ BLACK SCREEN ___________________________________|

Fixed (parallel):
  Download main.js ──→ Parse React → Start Router → Render (chunk already ready)
  Download page chunk ─────────────────────────↗
  |________________ BLACK SCREEN ______|
```

### What Changes

**`src/main.tsx`** -- Add a route-to-import map before `createRoot`. Check `window.location.pathname` and call the matching `import()` immediately. The browser caches the result, so when React's lazy() requests the same module later, it's already downloaded.

```ts
// Preload the matching page chunk immediately (before React mounts)
const preloadMap: Record<string, () => Promise<unknown>> = {
  '/producer-blueprint': () => import('./pages/TheProducerBlueprint001'),
  '/build-your-music-catalog': () => import('./pages/TheProducerBlueprint002Spotify'),
  '/make-money-with-music': () => import('./pages/TheProducerBlueprint003Career'),
  '/produce-without-expensive-gear': () => import('./pages/TheProducerBlueprint004Gear'),
  '/finish-more-tracks': () => import('./pages/TheProducerBlueprint005Workflow'),
};
preloadMap[window.location.pathname]?.();

createRoot(document.getElementById("root")!).render(<App />);
```

**`src/App.tsx`** -- No changes. The lazy() imports stay as-is. They'll resolve instantly because the chunk is already cached from the preload.

**Avatar images** -- Move the 4 hero avatars from `src/assets/avatars/` to `public/avatars/` and update the `src` references in all 5 page files from Vite imports to static paths (e.g., `src="/avatars/avatar-ben.webp"`). This lets the browser load them in parallel with JS instead of waiting for the JS to parse first.

### Files Changed

- `src/main.tsx` -- Add preload map (6 lines added)
- `src/pages/TheProducerBlueprint001.tsx` -- Remove 4 avatar imports, update 4 src references
- `src/pages/TheProducerBlueprint002Spotify.tsx` -- Same
- `src/pages/TheProducerBlueprint003Career.tsx` -- Same
- `src/pages/TheProducerBlueprint004Gear.tsx` -- Same
- `src/pages/TheProducerBlueprint005Workflow.tsx` -- Same
- Copy 4 files to `public/avatars/`

### What Stays the Same

- All copy, layout, visual design, section order
- Checkout flow, Shopify, tracking, Vidalytics
- Route paths
- Below-fold lazy loading
- All other files untouched
