

## Replace Order Bump Content

### What changes
Update the order bump in `src/pages/TheProducerBlueprint001.tsx` (lines 1857-1883) to replace the "Alpha Drums 3 Sample Pack" offer with "Rob's Effects Chains."

### Content update

| Field | Old | New |
|-------|-----|-----|
| Product name | Alpha Drums 3 Sample Pack | Rob's Effects Chains |
| Crossed-out price | $97 | $105 |
| Add-on price | +$37 | +$37 |
| Description | Rob's premium drum library with over 700 curated sounds... | 8 signature Ableton racks from Rob's sessions. His vocal chain, creative vocal FX, sub bass processor, drum bus glue, snare enhancer, kick fattener, vibe/saturation tool, and tension builder. 100% stock plugins - drag, drop, done. |
| Extra note | (none) | Requires Ableton 11 Standard or above. |

### Technical details

**File:** `src/pages/TheProducerBlueprint001.tsx`

- Line 1871: Change product name to "Rob's Effects Chains"
- Line 1873: Change strikethrough price from `$97` to `$105`
- Lines 1877-1879: Replace description paragraph with the new copy
- Add a second small paragraph for the Ableton requirement note
- Line 1880 (click box text): Remains unchanged

No structural or styling changes needed -- just swapping the text content within the existing order bump component.

