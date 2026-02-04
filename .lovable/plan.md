

## Plan: Redesign Producer Accelerator Page

### Overview
Completely rewrite `src/pages/ProducerAccelerator.tsx` to match the established squeeze page aesthetic from `TheProducerBlueprint001.tsx`. Add a centered hero image, and include a "Who is this for" section positioned **after** the main CTA button.

---

### Layout Structure

```text
+--------------------------------------------------+
|  [The Producer Blueprint™]         [Apply Now]   |   <- Nav
+--------------------------------------------------+
|                                                  |
|              [Aurora Glow Effect]                |
|                                                  |
|          HAVE ROB LATE MENTOR YOU                |
|   8-week small group mentorship for producers    |
|                                                  |
|              [Rob Image - Centered]              |
|                                                  |
|   "I'm opening up places for the first ever      |
|    Producer Accelerator..."                      |
|                                                  |
|   What you get:                                  |
|   ✓ Direct feedback on your music from me        |
|   ✓ Weekly live calls (90 mins)                  |
|   ✓ Private WhatsApp group to ask questions      |
|   ✓ Limited to 15 people                         |
|                                                  |
|   "Spaces are super limited..."                  |
|                                                  |
|          [    Apply Now    ]                     |   <- Main CTA
|                                                  |
+--------------------------------------------------+
|                                                  |
|            WHO IS THIS FOR?                      |   <- After CTA
|                                                  |
|   This is for you if:                            |
|   ✓ You're serious about making music...         |
|   ✓ You're already making tracks...              |
|   ✓ You're willing to share your work...         |
|   ✓ You can commit to 8 weeks...                 |
|                                                  |
|   This isn't for you if:                         |
|   ✗ You're just starting out...                  |
|   ✗ You're not ready to have your music...       |
|   ✗ You can't commit to the weekly calls         |
|                                                  |
+--------------------------------------------------+
|                Full Footer                       |
+--------------------------------------------------+
```

---

### Design Specifications (matching TheProducerBlueprint001)

| Element | Style |
|---------|-------|
| Background | `bg-[#050505]` with aurora radial gradient |
| Nav | Logo with `drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]`, white pill CTA |
| Headline | `text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em]` |
| Accent text | `font-serif italic font-normal tracking-normal text-zinc-200` |
| Body text | `text-zinc-400 text-base md:text-xl leading-relaxed` |
| Check icons | `text-[#D3FF02]` for positive, `text-red-500` for negative |
| CTA Button | `bg-[#D3FF02] text-black rounded-2xl shadow-[0_0_40px_rgba(211,255,2,0.4)]` |
| Section cards | `border border-zinc-800 bg-[#0A0A0A] rounded-2xl` |

---

### Technical Implementation

**File to Modify:** `src/pages/ProducerAccelerator.tsx`

**Key Components:**

1. **Imports:**
   - `ArrowRight`, `Check`, `X` from lucide-react
   - `robHomeStudio` image from assets

2. **Aurora glow effect** - Radial gradient positioned at bottom center

3. **Navigation** - Logo with trademark glow + white pill "Apply Now" button

4. **Hero Section:**
   - Large headline with serif italic accent on "Mentor You"
   - Subheadline: "8-week small group mentorship for producers"
   - Centered hero image with subtle glow behind it

5. **Body Copy** - Centered text about the Producer Accelerator offer

6. **Benefits List** - Lime green check icons with benefit text

7. **Main CTA** - "Apply Now" button with lime background and glow shadow

8. **Who Is This For Section** (positioned after CTA):
   - Section heading
   - Two-column grid on desktop
   - Left: "This is for you if:" with green checks
   - Right: "This isn't for you if:" with red X icons
   - Card styling with dark background and border

9. **Footer** - Matching main site footer style

---

### Copy

**This is for you if:**
- You're serious about making music your career.
- You're already making tracks - doesn't matter if you've released or not
- You're willing to share your work and take action on feedback
- You can commit to 8 weeks of showing up

**This isn't for you if:**
- You're just starting out and still learning your DAW
- You're not ready to have your music critiqued directly
- You can't commit to the weekly calls

---

### Files to Modify

1. **Rewrite** `src/pages/ProducerAccelerator.tsx` - Complete redesign with correct styling and section order

