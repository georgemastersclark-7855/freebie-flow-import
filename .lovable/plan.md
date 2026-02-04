

## Plan: Two-Column Layout with Credits Row

### Overview
1. Convert the hero section to a two-column layout on desktop (content left, image right)
2. Add a credits row (album art covers) beneath the image, similar to how the reference page shows brand logos

---

### Layout Structure

```text
+--------------------------------------------------+
|  [The Producer Blueprint™]         [Apply Now]   |
+--------------------------------------------------+
|                                                  |
|  LEFT (lg:w-1/2)          |  RIGHT (lg:w-1/2)    |
|                           |                      |
|  HAVE ROB LATE            |  [Rob Image]         |
|  MENTOR YOU               |  (large hero photo)  |
|                           |                      |
|  8-week mentorship...     |  Credits from:       |
|                           |  [album] [album] ... |
|  Body copy text...        |  (row of covers)     |
|                           |                      |
|  What you get:            |                      |
|  ✓ Direct feedback        |                      |
|  ✓ Weekly calls           |                      |
|  ✓ WhatsApp group         |                      |
|  ✓ Limited to 15          |                      |
|                           |                      |
|  [Apply Now]              |                      |
|                           |                      |
+--------------------------------------------------+
|            WHO IS THIS FOR?                      |
|   (two-column cards - unchanged)                 |
+--------------------------------------------------+
|                Footer                            |
+--------------------------------------------------+
```

---

### Technical Implementation

**File:** `src/pages/ProducerAccelerator.tsx`

**Changes:**

1. **Add album art imports:**
```tsx
import chainsomokersFriday from "@/assets/album-art/chainsmokers-friday.jpeg";
import chainsmokersNoShade from "@/assets/album-art/chainsmokers-no-shade.jpeg";
import chainsmokersSeeYouAgain from "@/assets/album-art/chainsmokers-see-you-again.jpeg";
import flawesDontBlameMe from "@/assets/album-art/flawes-dont-blame-me.jpg";
import tiandaNothingButLove from "@/assets/album-art/tianda-nothing-but-love.jpeg";
```

2. **Two-column hero wrapper:**
```tsx
<div className="flex flex-col lg:flex-row lg:items-start lg:gap-16 max-w-7xl mx-auto">
```

3. **Left column (content):**
```tsx
<div className="lg:w-1/2 text-center lg:text-left">
  {/* Headline, subhead, body, benefits, CTA */}
</div>
```

4. **Right column (image + credits):**
```tsx
<div className="lg:w-1/2 mt-10 lg:mt-0">
  {/* Hero image */}
  <img className="w-full rounded-2xl shadow-2xl" />
  
  {/* Credits row beneath image */}
  <div className="mt-8">
    <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] mb-4 text-center">
      Credits from artists like:
    </p>
    <div className="flex justify-center gap-3 flex-wrap">
      {/* Album art thumbnails - smaller, in a row */}
      <img src={...} className="w-14 h-14 rounded-lg" />
      ...
    </div>
  </div>
</div>
```

5. **Benefits alignment update:**
```tsx
<div className="flex items-center gap-3 justify-center lg:justify-start">
```

---

### Credits Data

Will display 5 album covers in a compact row:
- The Chainsmokers - Friday
- The Chainsmokers - No Shade
- The Chainsmokers - See You Again  
- Flawes - Don't Blame Me
- Tianda - Nothing But Love

These will be `w-14 h-14` thumbnails with `rounded-lg`, displayed horizontally beneath the hero image with a subtle label above.

---

### Mobile Behavior
On mobile, the layout remains single-column with centered text. The image and credits appear after the subheadline, before the body copy.

---

### Files to Modify

1. **Edit** `src/pages/ProducerAccelerator.tsx` - Two-column layout with credits row beneath image

