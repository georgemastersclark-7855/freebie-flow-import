

## Fix: Revert the Eager Imports (The Last Change Caused the Regression)

### What broke it

The most recent code change converted the 5 landing page imports in `App.tsx` from `lazy()` to direct eager imports. This means **every visitor to any route** (including `/` which is just a redirect) must now download and parse all 5 landing pages plus all their dependencies before React can even mount.

Before that change, lazy loading meant each route only loaded what it needed. The redirect on `/` was near-instant because it only needed the tiny main bundle.

### The fix

**Revert `src/App.tsx`** back to lazy imports for the 5 landing pages. The preload map already in `main.tsx` handles pre-fetching the correct page chunk in parallel with the main bundle, so there's no black screen — the chunk is already downloaded by the time React needs it.

**One file changed: `src/App.tsx`**

Replace the eager imports:
```
import TheProducerBlueprint001 from "./pages/TheProducerBlueprint001";
import TheProducerBlueprint002Spotify from "./pages/TheProducerBlueprint002Spotify";
import TheProducerBlueprint003Career from "./pages/TheProducerBlueprint003Career";
import TheProducerBlueprint004Gear from "./pages/TheProducerBlueprint004Gear";
import TheProducerBlueprint005Workflow from "./pages/TheProducerBlueprint005Workflow";
```

Back to lazy imports:
```
const TheProducerBlueprint001 = lazy(() => import("./pages/TheProducerBlueprint001"));
const TheProducerBlueprint002Spotify = lazy(() => import("./pages/TheProducerBlueprint002Spotify"));
const TheProducerBlueprint003Career = lazy(() => import("./pages/TheProducerBlueprint003Career"));
const TheProducerBlueprint004Gear = lazy(() => import("./pages/TheProducerBlueprint004Gear"));
const TheProducerBlueprint005Workflow = lazy(() => import("./pages/TheProducerBlueprint005Workflow"));
```

### Why this won't cause a black screen

The preload map in `main.tsx` (already in place) fires `import('./pages/TheProducerBlueprintXXX')` immediately on page load, **before React even mounts**. By the time React resolves the lazy component, the chunk is already cached. The Suspense fallback (black div) only shows if the chunk hasn't finished downloading yet — with the preload, it essentially never shows.

### What stays the same
- All page components, BelowFold architecture, checkout flow
- All tracking (Meta Pixel, Vidalytics, Klaviyo, Zapier)
- The preload map in `main.tsx`
- All routes, copy, layout, design
- Secondary pages remain lazy-loaded

### After publishing
Test both:
1. `audio.roblate.com` (the `/` redirect) — should be near-instant
2. `audio.roblate.com/make-money-with-music` — landing page should load without the 8-second delay
