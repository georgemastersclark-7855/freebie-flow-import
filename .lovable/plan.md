

## Fix: Remove Supabase from the Main Bundle + Make Redirect Instant

### Root cause (confirmed)

The delay on `/` proves the issue isn't the landing pages — it's the **main bundle itself** being too heavy. Here's why:

1. `App.tsx` eagerly imports `UTMDebugger.tsx`
2. `UTMDebugger.tsx` imports `sendZapierEvent` and `flushZapierQueue` from `zapier.ts`
3. `zapier.ts` has a static import of `supabase` from `@/integrations/supabase/client`
4. This pulls the entire Supabase JS SDK (~100KB+) into the main bundle

Even though UTMDebugger only renders when `?debug=true`, the **module-level import chain** still executes for every visitor. Combined with React Router, Radix UI components (Toaster, Tooltip, Sonner, Toast), and TanStack Query — all eagerly imported — the main bundle is massive.

The redirect on `/` uses `useEffect` inside a React component, so it can't fire until React has parsed everything, mounted, and run effects. That's where the 8-second gap comes from on mobile.

### Two changes needed

**1. Make the Supabase import dynamic in `zapier.ts` (line 3)**

Replace the static import:
```
import { supabase } from "@/integrations/supabase/client";
```

With a dynamic import inside `tryEdge()` only:
```
async function tryEdge(url: string, payload: any) {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    // ... rest unchanged
  }
}
```

And do the same in `flushZapierQueue()` which also calls `tryEdge` with `supabase`.

This removes ~100KB+ from the main bundle. Supabase only loads when someone actually triggers a Zapier event (checkout, debug test).

**2. Add an instant meta-refresh redirect in `index.html` for `/`**

Since `/` is just a redirect to `https://roblate.com`, we can handle it before React even loads by adding a small inline script to `index.html`:

```html
<script>
  if (window.location.pathname === '/') {
    window.location.replace('https://roblate.com');
  }
</script>
```

Place this before the `<script type="module" src="/src/main.tsx">` tag. This makes the redirect instant — no waiting for React, no waiting for any JS bundle to parse.

### Files changed

| File | Change |
|------|--------|
| `src/lib/zapier.ts` | Remove static Supabase import (line 3). Add dynamic `await import()` inside `tryEdge` and `flushZapierQueue`. |
| `index.html` | Add inline redirect script for `/` before the main module script. |

### What stays the same

- All landing pages, BelowFold architecture, checkout flow
- All tracking (Meta Pixel, Vidalytics, Klaviyo)
- Zapier functionality (works identically, just loads Supabase on-demand)
- UTMDebugger (still works when `?debug=true`)
- All routes, copy, layout, design

### Expected impact

- The `/` redirect becomes instant (no JS bundle needed)
- Landing pages load faster because ~100KB of Supabase SDK is no longer in the main bundle
- Supabase SDK only loads when checkout is initiated or debug mode sends a test event

### After publishing

Test on mobile:
1. `audio.roblate.com` — should redirect to `roblate.com` instantly (no delay)
2. `audio.roblate.com/make-money-with-music` — should load significantly faster
3. Test checkout flow to confirm Supabase/Zapier still works when needed

