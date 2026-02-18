

## Speed Up Mobile Load: Remove Unnecessary Head Resources and Strip Unused Bundle Weight

### What's causing the black screen on mobile

When a mobile visitor hits `/produce-without-expensive-gear`, the browser must:

1. Open TLS connections for 6 preconnected domains (4 are unnecessary at page load)
2. Download and parse the main JS bundle, which includes ~100KB of libraries that no landing page actually needs at render time
3. Only then can React mount and show pixels on screen

On a fast desktop connection this takes under 1 second. On a typical mobile connection (50-100ms latency per handshake, slower download), it adds up to several seconds of black screen.

### The two changes

**1. Clean up `index.html` -- remove 4 unnecessary preconnects**

Currently in the `<head>`:
- `fonts.googleapis.com` -- KEEP (needed for fonts)
- `fonts.gstatic.com` -- KEEP (needed for fonts)  
- `fast.vidalytics.com` -- REMOVE (video loads after page renders)
- `static.klaviyo.com` -- REMOVE (already deferred 3 seconds in JS)
- `sdks.shopifycdn.com` -- REMOVE (only loaded during checkout)
- `budvnuggykvqydjmkyfx.supabase.co` -- REMOVE (only used on form submit)

Each preconnect opens a TLS handshake immediately, competing with the actual app bundle download. Removing 4 frees up mobile bandwidth for the JS that matters.

**2. Strip unused providers from `src/App.tsx`**

These are statically imported and wrap the entire app, but no landing page uses them:

| Import | Why it's safe to remove |
|--------|------------------------|
| `@tanstack/react-query` (QueryClientProvider + QueryClient) | Zero `useQuery` or `useMutation` calls exist anywhere in the codebase |
| `@radix-ui/react-tooltip` (TooltipProvider) | No landing page uses tooltips -- only sidebar.tsx and chart.tsx use them internally, and neither is part of any route |

The Toaster, Sonner, and UTMDebugger will stay as static imports (the previous attempt to lazy-load these caused the build break). They are small enough that the risk is not worth it.

### What the files will look like after changes

**`index.html`** -- only two preconnects remain:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**`src/App.tsx`** -- remove two imports and their wrappers:
```tsx
// REMOVED: import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// REMOVED: import { TooltipProvider } from "@/components/ui/tooltip";
// REMOVED: const queryClient = new QueryClient();

// The return becomes:
return (
  <>
    <Toaster />
    <Sonner />
    {/* UTMDebugger stays unchanged */}
    <BrowserRouter>
      <Suspense fallback={BlackFallback}>
        <Routes>
          {/* all routes unchanged */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  </>
);
```

### What stays exactly the same

- All 5 landing page designs and layouts
- All routes and page components
- The BelowFold lazy-loading architecture
- The preload map in `main.tsx`
- Shopify checkout flow (loadShopifySDK is already on-demand)
- Klaviyo (already deferred 3 seconds)
- Meta Pixel tracking (already deferred via requestIdleCallback)
- Zapier webhook (Supabase client is already dynamically imported)
- Toast notifications (still work for checkout validation)
- The inline redirect script in `index.html`

### Estimated savings

- 4 fewer TLS handshakes at page load (frees mobile bandwidth)
- ~65KB less JavaScript to parse before first paint (React Query ~50KB, Tooltip ~15KB)
- No functionality lost -- these libraries were imported but never actually used by any page

