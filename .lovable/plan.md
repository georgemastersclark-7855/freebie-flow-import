

## Make Landing Pages Load Fast

### The Problem

Two things are making these pages painfully slow:

1. **All 5 landing pages load at once.** Right now, visiting `/produce-without-expensive-gear` also downloads all the code and assets for the other 4 pages you're NOT viewing. That's 5x the work for no reason.

2. **Every single image and video loads before anything appears.** Each page has ~55 asset imports at the top of the file. The browser must resolve ALL of them before it can even start rendering the page -- including testimonials, curriculum screenshots, and instructor photos that are way below the fold.

### The Fix (no loading spinners)

#### 1. Only load the page the visitor actually lands on

Convert all page imports in `App.tsx` to load on-demand. When someone clicks your ad and hits `/produce-without-expensive-gear`, only that page's code loads. The other 4 pages are never touched.

The fallback while the page chunk loads is just a plain black screen matching the page background (`bg-[#050505]`) -- visually seamless, no spinner, no branding, nothing. On a decent connection this black flash won't even be perceptible.

#### 2. Move below-fold assets out of the import block

Right now, every image is imported at the top of the file like this:
```
import testimonial1 from "@/assets/testimonials/testimonial-1.jpeg";
```
This means the browser treats ALL 55 assets as dependencies that must load before the page renders.

The fix: Move below-fold images (testimonials, curriculum screenshots, instructor photos, etc.) into the `/public` folder and reference them as plain URL strings. This way:
- Above-the-fold content (hero text, avatars, CTA) renders immediately
- Below-fold images load lazily in the background as the user scrolls
- The browser no longer blocks rendering on assets the user can't even see yet

Only ~6 small assets need to stay as eager imports (the 4 avatar thumbnails and a couple of hero elements).

#### 3. Convert remaining unoptimized assets

- `using-ableton.gif` still loads as a GIF -- convert to `.mp4` video element
- Several below-fold images are still `.png`/`.jpg` that could be `.webp`

### What stays exactly the same

- All copy, layout, section order
- Checkout flow and Shopify integration
- UTM tracking and Klaviyo
- Vidalytics embed behavior
- All visual styling and animations

### Technical Details

**Files modified:**
- `src/App.tsx` -- lazy route imports with `React.lazy()` + black `Suspense` fallback
- `src/pages/TheProducerBlueprint001.tsx` through `005Workflow.tsx` -- replace ~45 top-level asset imports per file with `/public` URL strings; keep only above-fold assets as imports
- Move ~40 asset files from `src/assets/` to `public/assets/` so they can be referenced by URL

**Above-fold assets that stay as eager imports (per page):**
- `avatar-ben.webp`, `avatar-producer-1.webp`, `avatar-producer-2.webp`, `avatar-producer-3.webp` (hero social proof)
- Lucide icons and UI components (already tree-shaken)

**Below-fold assets that move to `/public` and load lazily:**
- All 15+ testimonial images/videos
- All curriculum module screenshots (8 images)
- Instructor section photos (rob-marshmello, rob-chainsmokers, rob-studio, etc.)
- Pricing section mockups
- All other below-fold media

**Expected impact:**
- Initial page load goes from ~150 requests to ~10-15
- First paint happens almost immediately (text + avatars + Vidalytics embed)
- Everything else streams in as the user scrolls

