
## Replace Social Proof Bar with Single Screenshot

**Why this is faster:** Currently the browser makes 4 separate requests for avatar images plus renders SVG star icons. A single composite image means 1 request total -- noticeably faster on slow connections.

### Steps

1. **Copy the screenshot** to `src/assets/social-proof-bar.png`
2. **Replace the entire social proof block** (lines 980-1006) with a single `<img>` tag that imports and displays the screenshot
3. **Clean up unused avatar imports** if they are no longer used elsewhere in the file (avatarBen, avatarLorenzo, avatarProducer1, avatarProducer2)
4. The Star icon import from lucide-react may also be removable if not used elsewhere in the file

### Technical Detail

The current block:
```
<div className="flex items-center justify-center gap-3 ...">
  <div className="flex -space-x-3 relative">
    <!-- 4 Avatar components -->
  </div>
  <div> <!-- stars + text --> </div>
</div>
```

Will become:
```
<div className="flex items-center justify-center mb-6 md:mb-10">
  <img
    src={socialProofBar}
    alt="1,200+ producers enrolled - 5 star rating"
    className="h-8 md:h-10 w-auto"
  />
</div>
```

The sizing (`h-8 md:h-10`) matches the current avatar heights so the layout stays identical. Only the 005Workflow variant is touched.
