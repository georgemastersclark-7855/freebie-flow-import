
## Update Problem & Solution Headlines to Match Hero Styling

The Problem and Solution section headlines currently use lighter styling (`font-semibold`, `tracking-tight`, `text-4xl`) compared to the hero. We'll update them to match the hero's bolder weight and tighter tracking.

### Changes in `src/pages/TheProducerBlueprint005Workflow.tsx`

**1. Problem Section Headline (line 1235)**
- From: `text-4xl md:text-6xl font-semibold tracking-tight`
- To: `text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] md:tracking-[-0.04em] md:font-bold`

**2. Solution Section Headline (line 1385)**
- From: `text-4xl md:text-6xl font-semibold tracking-tight`
- To: `text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] md:tracking-[-0.04em] md:font-bold`

Both headlines keep their existing content, italic serif spans, line breaks, and other attributes (like `drop-shadow-2xl` on the solution headline) -- only the size/weight/tracking classes change.

No other files or sections are touched.
