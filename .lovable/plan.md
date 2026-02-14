

# Meta Pixel Tracking for Producer Blueprint Page

## Overview
Add comprehensive Meta Pixel tracking to `/theproducerblueprint001` using a clean utility layer and page-specific hook. No visual changes, no checkout logic changes, no other pages touched.

## Files Created / Modified

| File | Action |
|---|---|
| `src/lib/tpbMeta.ts` | Create -- tracking utility |
| `src/hooks/useProducerBlueprintMeta.ts` | Create -- page hook |
| `src/pages/TheProducerBlueprint001.tsx` | Modify -- wire tracking |

## 1. Tracking Utility (`src/lib/tpbMeta.ts`)

Provides all Meta Pixel primitives:

- **initMetaPixel()** -- loads fbevents.js if not present, calls `fbq('init', '519820396414380')`, guards against double init
- **generateEventId()** -- returns a crypto.randomUUID() (UUID v4) string; attached to every track call
- **Attribution capture** -- on call, reads `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `fbclid` from URL; persists to `localStorage` key `rla_tpb_attribution` with `first_landing_path` and `first_seen_at`; merges with existing stored values (URL params take priority)
- **Cookie helpers** -- reads `_fbp` and `_fbc` from `document.cookie`; if `_fbc` missing but `fbclid` exists, constructs fallback `fb.1.<timestamp>.<fbclid>`
- **Session ID** -- generates and persists to `localStorage` key `rla_tpb_session_id`
- **getTrackingContext()** -- returns object with all utm fields, fbclid, fbp, fbc, session_id, first_landing_path, current_path
- **trackStandard(eventName, params?, eventId?)** -- calls `fbq('track', ...)` with generated eventID
- **trackCustom(eventName, params?, eventId?)** -- calls `fbq('trackCustom', ...)` with generated eventID
- **Debug mode** -- console logs only when `?meta_debug=1` is in the URL

## 2. Page Hook (`src/hooks/useProducerBlueprintMeta.ts`)

Accepts a `variant` string parameter (e.g. `"tpb_001"`).

**On mount:**
- Calls `initMetaPixel()` and captures attribution
- Fires exactly ONE `PageView` per page load (guarded by `sessionStorage` key per pathname)

**ViewContent:**
- Fires once on first scroll >= 25% of page height (using a scroll listener with a ref guard)
- Does not attempt to hook into Vidalytics iframe events

**Exposed helpers (returned from hook):**
- `trackScrollToPricing({ cta_location })` -- fires custom `TPB_ScrollToPricing` with variant + cta_location
- `trackOrderBumpChecked({ value })` -- fires standard `AddToCart` (value 37, USD, content_name "Producer Blueprint Order Bump") + custom `TPB_OrderBump_Checked`
- `trackFinalCheckoutClick({ value, order_bump_selected })` -- fires standard `InitiateCheckout` + custom `TPB_Checkout_Click`

## 3. Wiring into TheProducerBlueprint001.tsx

**Import and initialize:**
```text
const { trackScrollToPricing, trackOrderBumpChecked, trackFinalCheckoutClick } = useProducerBlueprintMeta("tpb_001");
```

**A) Scroll CTAs -- all `href="#pricing"` links get an `onClick` handler:**

Each CTA gets a unique `cta_location` value:

| Line(s) | Location | cta_location value |
|---|---|---|
| ~964 | Nav bar "Get Instant Access" | `nav_bar` |
| ~1023 | Hero section "Start The Blueprint Today" | `hero` |
| ~647 | Bridge CTA below bonus section | `below_bonuses` |
| ~809 | Offer stack "Get Instant Access" | `value_stack` |
| ~1777 | Bridge CTA below social proof grid | `below_social_proof` |
| ~2095 | Crossroads "Join The Producer Blueprint" | `crossroads` |

Implementation: Add `onClick` to each `<a href="#pricing">` that calls `trackScrollToPricing({ cta_location: "..." })`. The `<a>` tag still navigates normally.

**B) Order bump checkbox:**

When toggled ON (`e.target.checked === true`), call `trackOrderBumpChecked({ value: 37 })` which fires:
- Standard `AddToCart` (value: 37, currency: USD, content_name: "Producer Blueprint Order Bump", content_type: "product")
- Custom `TPB_OrderBump_Checked` (variant, value: 37)

**C) Final checkout button ("Get Instant Access" at ~line 1916):**

Before the existing `handleCheckout(orderBumpAdded)` call, fire `trackFinalCheckoutClick({ value: orderBumpAdded ? 334 : 297, order_bump_selected: orderBumpAdded })` which sends:
- Standard `InitiateCheckout` (value, currency: USD, content_name: "The Producer Blueprint", content_type: "product")
- Custom `TPB_Checkout_Click` (variant, cta_location: "pricing_card", order_bump_selected, value)

This replaces the existing inline `fbq` call in `useShopifyCheckout.ts` -- but per the hard rule, we will NOT modify that file. Instead, the new tracking fires first from the page, and the existing one in the hook is a harmless duplicate (same event, different eventID). If desired in a future pass, the old one can be removed.

## Event Summary

| Trigger | Standard Event | Custom Event |
|---|---|---|
| Page load | PageView | -- |
| First scroll >= 25% | ViewContent | -- |
| Any `#pricing` CTA click | -- | TPB_ScrollToPricing |
| Order bump checked ON | AddToCart | TPB_OrderBump_Checked |
| Final checkout click | InitiateCheckout | TPB_Checkout_Click |

All events include a UUID v4 `eventID`. No `Purchase` event is fired. No other files are touched.
