

## Fix: Eager-Import the 5 Landing Pages

### What's happening now

The preload map in `main.tsx` is present but clearly not solving the black screen. The `lazy()` wrapper in `App.tsx` still forces React to show the Suspense fallback (black div) while it resolves. Your other Lovable project ("Low Ticket Playbook") works instantly because it eagerly imports all pages -- no lazy loading for primary routes.

### The fix

One file change: `src/App.tsx`

Convert the 5 landing page imports from `lazy()` to direct eager imports. Everything else stays exactly as-is.

**Before (lines 14-18):**
```
const TheProducerBlueprint001 = lazy(() => import("./pages/TheProducerBlueprint001"));
const TheProducerBlueprint002Spotify = lazy(() => import("./pages/TheProducerBlueprint002Spotify"));
const TheProducerBlueprint003Career = lazy(() => import("./pages/TheProducerBlueprint003Career"));
const TheProducerBlueprint004Gear = lazy(() => import("./pages/TheProducerBlueprint004Gear"));
const TheProducerBlueprint005Workflow = lazy(() => import("./pages/TheProducerBlueprint005Workflow"));
```

**After:**
```
import TheProducerBlueprint001 from "./pages/TheProducerBlueprint001";
import TheProducerBlueprint002Spotify from "./pages/TheProducerBlueprint002Spotify";
import TheProducerBlueprint003Career from "./pages/TheProducerBlueprint003Career";
import TheProducerBlueprint004Gear from "./pages/TheProducerBlueprint004Gear";
import TheProducerBlueprint005Workflow from "./pages/TheProducerBlueprint005Workflow";
```

**Stays lazy (secondary pages):**
- NotFound, ClaudeTest, ProducerAccelerator, PrivacyPolicy, TermsOfService, RefundPolicy, EarningsDisclaimer

**Stays as-is:**
- `Suspense` wrapper (still needed for the remaining lazy pages)
- `BlackFallback` (still used by that Suspense)
- `main.tsx` preload map (harmless, can stay or be removed later)
- All routes, copy, layout, tracking, checkout, avatars

### What does NOT need changing

- Avatar images: already moved to `public/avatars/` and referenced as static paths
- `main.tsx`: preload map is already there (harmless to keep)
- No page component files change at all

### Why this works

The 5 page components get bundled into the main JS file. When the browser downloads and parses that one file, React can render the page immediately -- no second network request, no Suspense fallback, no black screen. This matches exactly how your "Low Ticket Playbook" project works.

### Files changed

- `src/App.tsx` -- 5 lines changed (lazy to eager imports)
