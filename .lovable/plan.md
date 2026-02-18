

## Fix: Strip the Main Bundle Down to Bare Minimum

### The real problem

The domain reconnect didn't help because the issue is **bundle size and parse time on mobile**. The black screen you're seeing for 7-10 seconds is the time it takes a mobile browser to download, parse, and execute the main JavaScript bundle before React can mount and show anything.

Right now, your main bundle eagerly includes all of this before a single pixel renders:

| Library | Approx. Size | Actually Used? |
|---------|-------------|----------------|
| TanStack React Query | ~50KB | **No** - zero useQuery/useMutation calls in entire codebase |
| Radix Toast + hook system | ~15KB | Only during checkout errors (rare) |
| Sonner + next-themes | ~20KB | Only during checkout errors (rare) |
| Radix Tooltip | ~15KB | Not used by any landing page |
| UTMDebugger module | ~5KB+ | Only renders when ?debug=true |

That's roughly **100KB+ of JavaScript** that every mobile visitor must parse before seeing anything, and none of it is needed for initial page render.

### The fix (4 changes to 1 file)

All changes are in **`src/App.tsx`**:

**1. Remove TanStack React Query entirely**

It's imported and wrapped around the entire app, but literally no component in the codebase uses `useQuery` or `useMutation`. Remove the import, the `QueryClient` instance, and the `QueryClientProvider` wrapper.

**2. Remove TooltipProvider wrapper**

No landing page uses tooltips. It's only used internally by sidebar.tsx and chart.tsx (which aren't part of any route). Remove the import and wrapper.

**3. Lazy-load the Toasters**

The `Toaster` and `Sonner` components only fire during checkout validation errors, which happens long after the page loads. Lazy-load them so they don't block initial render.

**4. Lazy-load UTMDebugger**

Even though it only renders when `?debug=true`, the static import means its entire module (including zapier.ts and marketing config) is parsed for every visitor. Making it lazy means the module is only loaded when debug mode is active.

### What the new App.tsx will look like

```tsx
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { loadKlaviyo } from "@/utils/loadKlaviyo";
import Redirect from "./components/Redirect";

// Lazy-loaded UI chrome (only needed for checkout error toasts)
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));
const UTMDebugger = lazy(() => import("@/components/UTMDebugger").then(m => ({ default: m.UTMDebugger })));

// Lazy-loaded landing pages
const TheProducerBlueprint001 = lazy(() => import("./pages/TheProducerBlueprint001"));
// ... (same as current for all 5 variants + secondary pages)

const BlackFallback = <div className="bg-[#050505] min-h-screen" />;

const App = () => {
  useEffect(() => {
    const timer = setTimeout(loadKlaviyo, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <Toaster />
        <Sonner />
      </Suspense>
      {new URLSearchParams(window.location.search).get('debug') === 'true' && (
        <Suspense fallback={null}>
          <UTMDebugger />
        </Suspense>
      )}
      <BrowserRouter>
        <Suspense fallback={BlackFallback}>
          <Routes>
            {/* ... all routes unchanged ... */}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};
```

### What's removed from the main bundle

| Removed | Savings |
|---------|---------|
| @tanstack/react-query | ~50KB |
| @radix-ui/react-tooltip | ~15KB |
| sonner + next-themes (deferred) | ~20KB |
| @radix-ui/react-toast (deferred) | ~15KB |
| UTMDebugger + zapier chain (deferred) | ~5KB |
| **Total** | **~105KB** |

### What stays the same

- All landing pages, BelowFold architecture, checkout flow
- All tracking (Meta Pixel, Vidalytics, Klaviyo, Zapier)
- Toast notifications still work during checkout (they just load on demand)
- UTMDebugger still works with ?debug=true
- All routes, copy, layout, design
- The preload map in main.tsx
- The inline redirect in index.html

### Technical detail

- `QueryClientProvider` is removed because no component uses React Query hooks. If React Query is needed later, it can be re-added.
- `TooltipProvider` is removed because no landing page route uses Radix Tooltip. The sidebar component has its own internal `TooltipProvider`.
- The Toasters are wrapped in their own `Suspense` with `fallback={null}` so they don't block the page from rendering.

### After publishing

Test on mobile:
1. `audio.roblate.com/produce-without-expensive-gear` should load dramatically faster (105KB less JS to parse)
2. `audio.roblate.com` redirect should remain instant
3. Test checkout to confirm toast error messages still appear if you submit without a name/email
