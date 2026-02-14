

# Reconnect Shopify Buy Button Checkout

## What This Does
Wires up the "Get Instant Access" checkout button on both `/theproducerblueprint001` and `/theproducerblueprint002spotify` so that clicking it:

1. Validates the Full Name and Email fields
2. Fires a non-blocking Klaviyo/Zapier lead capture
3. Creates a Shopify checkout using the Buy Button SDK
4. If the order bump is selected, adds **both** products to a single checkout
5. Pre-fills the customer's name and email in Shopify checkout
6. Shows a loading state to prevent double-clicks

## Shopify Configuration (extracted from your embed codes)

| Detail | Value |
|---|---|
| Domain | `the-producer-blueprint-7594.myshopify.com` |
| Storefront Access Token | `92053f10fedc25746cd619c30edadbde` |
| Main Product ID | `6953404334164` |
| Order Bump Product ID | `15640127930755` |

## Technical Steps

### 1. Load the Shopify Buy Button SDK
Add a `<script>` tag for `https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js` to `index.html` (or load it dynamically on mount inside the component). A persistent Shopify client ref will be created once.

### 2. Add state and refs to both page components
- `useRef` for `fullName` and `email` input elements
- `useState` for `isLoading` (disables button during checkout creation)
- `useRef` for the Shopify client instance

### 3. Implement `handleCheckout` function
The core logic:

```text
handleCheckout flow:
  1. Validate name + email (show toast on failure)
  2. Set isLoading = true
  3. Fire Klaviyo/Zapier lead capture (non-blocking via sendZapierEvent)
  4. Use Shopify SDK to fetch product(s) by ID
  5. Create a checkout with the main product
  6. If orderBumpAdded, also add order bump product to the same checkout
  7. Pre-fill email via checkout.updateEmail()
  8. Append customer name as URL params on the checkout URL
  9. Redirect to Shopify checkout URL
  10. Set isLoading = false on error
```

### 4. Wire up the button
- Add `onClick={handleCheckout}` to the "Get Instant Access" button
- Add `disabled={isLoading}` and show a spinner/loading text when active
- Add `ref` attributes to the name and email `<input>` elements

### 5. Apply to both pages
- `TheProducerBlueprint001.tsx` -- already has `orderBumpAdded` state
- `TheProducerBlueprint002Spotify.tsx` -- needs `orderBumpAdded` state added (currently the order bump checkbox is uncontrolled) and the same checkout handler

### 6. No new dependencies needed
The Shopify Buy Button SDK is loaded via CDN script tag, not an npm package.

