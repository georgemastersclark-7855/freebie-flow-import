

## Apply Recent Style Updates to All Landing Page Variants

Three style updates from the 005Workflow variant need to be applied to **001**, **002Spotify**, **003Career**, and **004Gear**.

---

### Update 1: Centre Problem Section Card Text on Desktop

Remove `md:text-right` from the left column and `md:text-left` from the right column in the Problem section, so text stays centred on all screen sizes.

| File | Lines to fix |
|------|-------------|
| TheProducerBlueprint001.tsx | Line 1258: remove `md:text-right` / Line 1317: remove `md:text-left` |
| TheProducerBlueprint002Spotify.tsx | Line 1231: remove `md:text-right` / Line 1290: remove `md:text-left` |
| TheProducerBlueprint003Career.tsx | Line 1255: remove `md:text-right` / Line 1314: remove `md:text-left` |
| TheProducerBlueprint004Gear.tsx | Line 1252: remove `md:text-right` / Line 1311: remove `md:text-left` |

---

### Update 2: Remove "..." From Solution Section Card Titles

Capitalise the first word and drop the leading ellipsis on all 4 solution card titles.

| File | Lines |
|------|-------|
| TheProducerBlueprint001.tsx | ~1418-1421 |
| TheProducerBlueprint003Career.tsx | ~1415-1418 |
| TheProducerBlueprint004Gear.tsx | ~1412-1415 |

(002Spotify already has no "..." in its solution titles.)

Title changes (same for all 3 files):
- `"...how to go from..."` to `"How to go from..."`
- `"...the \"Bedroom\"..."` to `"The \"Bedroom\"..."`
- `"...session-proven..."` to `"Session-proven..."`
- `"...how to design..."` to `"How to design..."`

---

### Update 3: Tighten Headline Tracking

Apply consistent `tracking-tighter` to the same 6 headline positions across all 4 variants.

**a) Problem headline and Solution headline** -- remove `md:tracking-[-0.04em]`, keep base `tracking-[-0.05em]`:

| File | Problem line | Solution line |
|------|-------------|---------------|
| 001 | 1256 (h2) | 1393 (h2) |
| 002Spotify | 1219 (h2) | 1370 (h2) |
| 003Career | 1242 (h2) | 1393 (h2) |
| 004Gear | 1239 (h2) | 1390 (h2) |

Also the **hero h1** on each variant has `md:tracking-[-0.04em]` that should be removed:

| File | Hero h1 line |
|------|-------------|
| 001 | ~1009 |
| 002Spotify | ~983 |
| 003Career | ~1009 |
| 004Gear | ~1009 |

**b) "Real Results. Real Producers."** -- change `tracking-tight` to `tracking-tighter`:

| File | Line |
|------|------|
| 001 | 1670 |
| 002Spotify | 1646 |
| 003Career | 1670 |
| 004Gear | 1667 |

**c) "Get Instant Access"** -- change `tracking-[-0.04em]` to `tracking-tighter`:

| File | Line |
|------|------|
| 001 | 1809 |
| 002Spotify | 1783 |
| 003Career | 1809 |
| 004Gear | 1806 |

**d) "Frequently Asked Questions"** -- add `tracking-tighter`:

| File | Line |
|------|------|
| 001 | 1983 |
| 002Spotify | 1938 |
| 003Career | 1980 |
| 004Gear | 1977 |

**e) "You have two choices..."** -- change `tracking-tight` to `tracking-tighter`:

| File | Line |
|------|------|
| 001 | 2096 |
| 002Spotify | 2051 |
| 003Career | 2093 |
| 004Gear | 2090 |

---

### Summary

- **4 files** modified
- **~19 edits per file** (8 problem-card alignment + 4 solution titles + 7 tracking fixes)
- No content or structural changes -- purely visual consistency

