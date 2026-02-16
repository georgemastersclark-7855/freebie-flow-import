import { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { sendZapierEvent } from "@/lib/zapier";

declare global {
  interface Window {
    ShopifyBuy: any;
  }
}

const SHOPIFY_DOMAIN = "the-producer-blueprint-7594.myshopify.com";
const STOREFRONT_TOKEN = "92053f10fedc25746cd619c30edadbde";
const MAIN_PRODUCT_ID = "gid://shopify/Product/6953404334164";
const BUMP_PRODUCT_ID = "gid://shopify/Product/15640127930755";

export function useShopifyCheckout() {
  const clientRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initClient = () => {
      if (window.ShopifyBuy && !clientRef.current) {
        clientRef.current = window.ShopifyBuy.buildClient({
          domain: SHOPIFY_DOMAIN,
          storefrontAccessToken: STOREFRONT_TOKEN,
        });
      }
    };
    if (window.ShopifyBuy) {
      initClient();
    } else {
      const interval = setInterval(() => {
        if (window.ShopifyBuy) {
          initClient();
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  const handleCheckout = useCallback(async (orderBumpAdded: boolean) => {
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

    setIsLoading(true);

    // Non-blocking lead capture
    sendZapierEvent({
      event_type: "initiate_checkout",
      name,
      email,
      order_bump: orderBumpAdded,
      value: orderBumpAdded ? 334 : 297,
      source: "producer_blueprint",
    }).catch(() => {});

    // Meta Pixel InitiateCheckout — fired via useProducerBlueprintMeta.trackFinalCheckoutClick() in each variant

    try {
      const client = clientRef.current;
      if (!client) {
        throw new Error("Shopify client not initialized");
      }

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
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, []);

  return { nameRef, emailRef, isLoading, handleCheckout };
}
