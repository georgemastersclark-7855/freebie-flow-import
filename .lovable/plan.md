

## Defer Vidalytics Loading on 4 Landing Pages

App.tsx is already correct -- lazy imports are in place and no unnecessary providers exist. The only remaining change is deferring the Vidalytics script injection on 4 pages that still load it immediately on mount.

Page 004 (Gear) already uses the deferred `requestIdleCallback` pattern. Pages 001, 002, 003, and 005 still inject the script synchronously in `useEffect`, which competes with the hero render on mobile.

### Changes

**4 files to edit** (same pattern applied to each):

**1. `src/pages/TheProducerBlueprint001.tsx`** (lines 21-42)
Wrap the existing Vidalytics inline script injection in `requestIdleCallback` with a 3-second timeout fallback, matching the pattern already used in 004.

**2. `src/pages/TheProducerBlueprint002Spotify.tsx`** (lines 20-31)
Wrap the existing Vidalytics `src`-based script injection in `requestIdleCallback` with a 3-second timeout fallback.

**3. `src/pages/TheProducerBlueprint003Career.tsx`** (lines 21-42)
Same deferred pattern as 001 (inline script variant).

**4. `src/pages/TheProducerBlueprint005Workflow.tsx`** (lines 21-42)
Same deferred pattern as 001 (inline script variant).

### What each deferred useEffect looks like

```tsx
useEffect(() => {
  let script: HTMLScriptElement | null = null;

  const loadVidalytics = () => {
    script = document.createElement("script");
    // ... existing script setup (unchanged) ...
    document.body.appendChild(script);
  };

  if ("requestIdleCallback" in window) {
    const id = requestIdleCallback(loadVidalytics, { timeout: 3000 });
    return () => {
      cancelIdleCallback(id);
      if (script && document.body.contains(script)) document.body.removeChild(script);
    };
  } else {
    const timer = setTimeout(loadVidalytics, 2000);
    return () => {
      clearTimeout(timer);
      if (script && document.body.contains(script)) document.body.removeChild(script);
    };
  }
}, []);
```

### What stays the same

- App.tsx (already correct -- lazy imports, no unnecessary providers)
- main.tsx preload map
- All page designs, routes, and layouts
- BelowFold lazy loading
- Shopify, Klaviyo, Zapier integrations
- Page 004 Gear (already deferred)

### Expected impact

On mobile, the hero section will paint before Vidalytics starts downloading its loader and player scripts, eliminating the competition for bandwidth during the critical first paint.
