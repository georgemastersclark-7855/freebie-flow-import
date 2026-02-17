

## Fix: Eliminate the Black Screen Delay

### What's Causing It

Even after the asset migration, each page's JavaScript chunk is still very large because:

1. **`framer-motion` (approximately 150KB) is imported but literally never used.** It's in the `import` block of all 5 pages, but there are zero `<motion.div>` elements anywhere in the JSX. The browser downloads and parses this entire library for nothing.

2. **Each page is a single 2,000-line component.** React.lazy splits at the route level, but the chunk for one page still contains everything -- hero, testimonials, curriculum, pricing, FAQ, footer. The browser must download and execute all 2,000 lines before it can paint the hero.

3. **Facebook Pixel script competes for bandwidth.** `initMetaPixel()` fires on mount and injects `fbevents.js`, which fights for network resources during the critical first render.

### The Fix

#### 1. Remove the unused `framer-motion` import (instant win)

Delete `import { motion } from "framer-motion"` from all 5 pages. It's not used anywhere. This alone removes approximately 150KB from each page chunk.

#### 2. Split each page into above-fold and below-fold chunks

Break each 2,000-line page into two parts:

- **Above-fold component** (loads immediately): Hero section with headline, avatars, CTA, and Vidalytics embed -- roughly lines 680-900 of each file. This is small and renders instantly.
- **Below-fold component** (lazy-loaded): Everything else -- testimonials, curriculum, instructor bio, pricing, FAQ, footer. This loads in the background via `React.lazy()` with a seamless invisible fallback (empty div, no spinner).

The user sees the hero content immediately. By the time they scroll, the rest has already loaded silently.

#### 3. Defer Facebook Pixel to after first paint

Move the `initMetaPixel()` call from `useEffect` (fires immediately on mount) to a `requestIdleCallback` or short `setTimeout` (e.g., 1 second). The pixel still fires well before any user action, but it no longer blocks the initial render.

### What stays exactly the same

- All copy, layout, section order, visual styling
- Checkout flow and Shopify integration
- UTM tracking and Klaviyo behavior
- Vidalytics embed
- All animations and interactions

### Technical Details

**Files modified:**
- `src/pages/TheProducerBlueprint001.tsx` through `005Workflow.tsx` -- remove `framer-motion` import; split into `HeroSection` (inline) + `BelowFoldContent` (lazy-loaded)
- `src/hooks/useProducerBlueprintMeta.ts` -- defer `initMetaPixel()` with `requestIdleCallback` fallback
- New files: `src/components/blueprint/BelowFoldContent001.tsx` through `005.tsx` (or a single shared component if the below-fold sections are identical across variants)

**How the split works:**

Each page file becomes roughly:

```text
// Page file (small, loads fast)
import HeroSection from "./HeroSection"  // inline, ~200 lines
const BelowFold = lazy(() => import("./BelowFoldContent"))  // ~1800 lines, loads in background

export default function Page() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<div />}>
        <BelowFold />
      </Suspense>
    </>
  )
}
```

The fallback is an empty `<div />` -- completely invisible. No spinner, no black screen. The hero renders instantly, and by the time the user even thinks about scrolling, the rest has loaded.

**Expected impact:**
- Initial JS chunk per page drops from approximately 300KB+ to approximately 30-40KB
- First contentful paint (hero + CTA) happens near-instantly
- Below-fold content streams in silently within 1-2 seconds

