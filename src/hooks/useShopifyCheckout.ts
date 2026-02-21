import { useRef, useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { sendZapierEvent } from "@/lib/zapier";
import { loadShopifySDK } from "@/utils/loadShopifySDK";

const SHOPIFY_DOMAIN = "the-producer-blueprint-7594.myshopify.com";
const STOREFRONT_TOKEN = "92053f10fedc25746cd619c30edadbde";
const MAIN_PRODUCT_ID = "gid://shopify/Product/6953404334164";
const BUMP_PRODUCT_ID = "gid://shopify/Product/15640127930755";

type CheckoutTrackingPayload = {
  value: number;
  order_bump_selected: boolean;
};

export function useShopifyCheckout() {
  const clientRef = useRef<any>(null);
  const checkoutInFlightRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleCheckout = useCallback(async (
    orderBumpAdded: boolean,
    onInitiateCheckout?: (payload: CheckoutTrackingPayload) => void,
  ) => {
    if (checkoutInFlightRef.current) return;

    const name = nameRef.current?.value?.trim() || "";
    const email = emailRef.current?.value?.trim() || "";

    if (!name) {
      toast({ title: "Name required", description: "Please enter your full name.", variant: "destructive" });
      nameRef.current?.focus();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Valid email required", description: "Please enter a valid email address.", variant: "destructive" });
      emailRef.current?.focus();
      return;
    }

    checkoutInFlightRef.current = true;
    setIsLoading(true);

    onInitiateCheckout?.({
      value: orderBumpAdded ? 334 : 297,
      order_bump_selected: orderBumpAdded,
    });

    // Non-blocking lead capture
    sendZapierEvent({
      event_type: "initiate_checkout",
      name,
      email,
      order_bump: orderBumpAdded,
      value: orderBumpAdded ? 334 : 297,
      source: "producer_blueprint",
    }).catch(() => {});

    try {
      // Load SDK on demand if not already loaded
      if (!clientRef.current) {
        const ShopifyBuy = await loadShopifySDK();
        clientRef.current = ShopifyBuy.buildClient({
          domain: SHOPIFY_DOMAIN,
          storefrontAccessToken: STOREFRONT_TOKEN,
        });
      }

      const client = clientRef.current;

      // Fetch products in parallel
      const [mainProduct, bumpProduct] = await Promise.all([
        client.product.fetch(MAIN_PRODUCT_ID),
        orderBumpAdded ? client.product.fetch(BUMP_PRODUCT_ID) : Promise.resolve(null),
      ]);

      // Create checkout
      const checkout = await client.checkout.create();

      // Build line items
      const lineItems: { variantId: string; quantity: number }[] = [
        { variantId: mainProduct.variants[0].id, quantity: 1 },
      ];
      if (orderBumpAdded && bumpProduct) {
        lineItems.push({ variantId: bumpProduct.variants[0].id, quantity: 1 });
      }

      // Add items to checkout
      const updatedCheckout = await client.checkout.addLineItems(checkout.id, lineItems);

      // Pre-fill email
      await client.checkout.updateEmail(updatedCheckout.id, email);

      // Build redirect URL with name params
      const [firstName, ...lastParts] = name.split(" ");
      const lastName = lastParts.join(" ") || "";
      const checkoutUrl = new URL(updatedCheckout.webUrl);
      checkoutUrl.searchParams.set("checkout[shipping_address][first_name]", firstName);
      if (lastName) {
        checkoutUrl.searchParams.set("checkout[shipping_address][last_name]", lastName);
      }

      // Redirect
      window.location.href = checkoutUrl.toString();
    } catch (error) {
      console.error("Shopify checkout error:", error);
      toast({
        title: "Checkout Error",
        description: "Checkout is temporarily unavailable — please refresh and try again.",
        variant: "destructive",
      });
      checkoutInFlightRef.current = false;
      setIsLoading(false);
    }
  }, []);

  return { nameRef, emailRef, isLoading, handleCheckout };
}
