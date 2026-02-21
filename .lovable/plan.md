

## Replace VSL Embed on /make-money-with-music

**File:** `src/pages/TheProducerBlueprint003Career.tsx`

Two changes in this single file:

**1. Update the Vidalytics script injection (inside the deferred useEffect)**
Replace all 3 occurrences of `V5HrhyRBNAeDtppA` with `fBWMAWYKAYnSc985` in the inline script string, and update the embed URL path from `.../V5HrhyRBNAeDtppA/` to `.../fBWMAWYKAYnSc985/`.

**2. Update the container div ID**
Change `id="vidalytics_embed_V5HrhyRBNAeDtppA"` to `id="vidalytics_embed_fBWMAWYKAYnSc985"` on the embed container div in the JSX.

Nothing else changes -- same deferred loading pattern, same layout, same styling.
