

## Fix: Split Pages So the Hero Loads Instantly

### Why it's still a black screen

Your page files are each ~2,000 lines long. Even though only one variant loads, the browser must download and parse ALL 2,000 lines before it can show a single pixel. That includes ~600 lines of TestimonialCard and CurriculumSection components the user can't even see yet.

Think of it like ordering a burger but the kitchen won't serve it until they've also cooked every side dish, dessert, and drink. You just want the burger first.

### The fix

Split each page into two pieces:

1. **Hero chunk (loads instantly)** -- the nav bar, headline, avatars, CTA button, and Vidalytics embed. This is roughly 250 lines of simple text and a few small avatar images. It renders in milliseconds.

2. **Below-fold chunk (loads silently in background)** -- testimonials, curriculum, instructor bio, pricing, FAQ, footer. This is ~1,750 lines that loads via `React.lazy()` while the user is watching the hero. By the time they scroll, it's already there.

There's no spinner, no loading indicator. The hero appears immediately, and the rest streams in invisibly behind it.

### What this looks like in practice

Each page file shrinks from ~2,000 lines to ~50 lines:

```text
Page file (tiny, loads fast):
  - Hero section inline (~250 lines)
  - lazy(() => import("./BelowFold")) for everything else

BelowFold file (loads in background):
  - TestimonialCard component
  - CurriculumSection component  
  - All remaining sections (social proof, pain, curriculum, pricing, FAQ, footer)
```

### What stays exactly the same

- All copy, layout, section order, visual styling
- Checkout flow and Shopify integration
- UTM tracking, Klaviyo, and Meta Pixel behavior
- Vidalytics embed
- All interactions (video playback, accordion, checkout form)

### Technical details

**New files created (5):**
- `src/components/blueprint/BelowFold001.tsx`
- `src/components/blueprint/BelowFold002Spotify.tsx`
- `src/components/blueprint/BelowFold003Career.tsx`
- `src/components/blueprint/BelowFold004Gear.tsx`
- `src/components/blueprint/BelowFold005Workflow.tsx`

Each contains: TestimonialCard, CurriculumSection, and all JSX from line ~924 to end of file, plus the state/refs they need (orderBumpAdded, kieraPlaying, activeVideoId, modules, bonusModules, etc.).

**Modified files (5):**
- `src/pages/TheProducerBlueprint001.tsx` through `005Workflow.tsx`

Each shrinks to: imports, hooks (useShopifyCheckout, useProducerBlueprintMeta, usePageMeta, Vidalytics useEffect), hero JSX (nav + main), and a `Suspense`-wrapped lazy import of its BelowFold component. Props like `trackScrollToPricing`, `nameRef`, `emailRef`, `handleCheckout` are passed down to BelowFold.

**How state is handled:**
- State that only the below-fold uses (kieraPlaying, activeVideoId, orderBumpAdded, showAllWallOfProof) moves into the BelowFold component
- Hooks that both need (useShopifyCheckout, useProducerBlueprintMeta) stay in the page and pass results as props
- The Vidalytics script stays in the page component since it targets a hero-level DOM element

**Expected impact:**
- Initial JS per page drops from ~2,000 lines (~200KB+) to ~250 lines (~20-30KB)
- First contentful paint (headline + CTA + video embed) happens near-instantly
- Below-fold content loads silently within 1-2 seconds
