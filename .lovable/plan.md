
## Clean Up Legacy TPB Routes

A simple removal of 6 lines in one file.

### What changes

**src/App.tsx** -- Remove lines 42-47 (the legacy redirect routes block):

```
{/* Legacy redirects */}
<Route path="/theproducerblueprint001" element={<Redirect to="/producer-blueprint" />} />
<Route path="/theproducerblueprint002spotify" element={<Redirect to="/build-your-music-catalog" />} />
<Route path="/theproducerblueprint003career" element={<Redirect to="/make-money-with-music" />} />
<Route path="/theproducerblueprint004gear" element={<Redirect to="/produce-without-expensive-gear" />} />
<Route path="/theproducerblueprint005workflow" element={<Redirect to="/finish-more-tracks" />} />
```

These old URLs will now hit the catch-all `*` route and show the 404 page instead of redirecting.

### What stays the same

- All 5 canonical routes remain unchanged
- Legal page links (already pointing to `/producer-blueprint`)
- All page copy, design, pricing, checkout logic, and tracking
- `/claudetest` and `/produceraccellerator` routes
