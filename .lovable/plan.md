

## Remove Credits Ticker from All Landing Page Variants

Remove the "Infinite Accreditations Ticker" section and its unused album art imports from all 4 remaining variants.

### Files to modify

**1. TheProducerBlueprint001.tsx**
- Delete the ticker block (lines 1083-1187, from the comment to the closing `</div>`)
- Remove album art imports (lines 23, 28-30 and lines 31-32 for januaryAllMyFriends, tiandaNothingButLove, chainsmokersTennisCourt)

**2. TheProducerBlueprint002Spotify.tsx**
- Delete the ticker block (lines 1057-1161)
- Remove the same album art imports (lines 20, 25-29, 30)

**3. TheProducerBlueprint003Career.tsx**
- Delete the ticker block (lines 1080-1184)
- Remove the same album art imports

**4. TheProducerBlueprint004Gear.tsx**
- Delete the ticker block (lines 1080-1184)
- Remove the same album art imports

### What stays the same
- All other sections remain untouched
- The `</main>` tag stays in place (ticker sits just above it)
- No structural changes beyond removing the ticker and cleaning up unused imports

