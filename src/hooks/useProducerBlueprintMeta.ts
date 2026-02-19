import { useEffect, useRef, useCallback } from "react";
import {
  initMetaPixel,
  captureAttribution,
  trackStandard,
  trackCustom,
  generateEventId,
} from "@/lib/tpbMeta";

export function useProducerBlueprintMeta(variant: string) {
  const pageViewFired = useRef(false);
  const viewContentFired = useRef(false);

  const getSessionValue = (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const setSessionValue = (key: string, value: string) => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Ignore storage failures and continue tracking.
    }
  };

  // ── On mount: init pixel (deferred), capture attribution, fire PageView ──
  useEffect(() => {
    // Capture attribution immediately (lightweight, no network)
    captureAttribution();

    // Defer pixel init to avoid blocking first paint
    const deferPixel = () => {
      initMetaPixel();

      // Guard duplicate PageView per page load using sessionStorage
      const pvKey = `tpb_pv_${window.location.pathname}`;
      if (!getSessionValue(pvKey) && !pageViewFired.current) {
        pageViewFired.current = true;
        setSessionValue(pvKey, "1");
        trackStandard("PageView", { variant });
      }
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(deferPixel, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    } else {
      const timer = setTimeout(deferPixel, 1000);
      return () => clearTimeout(timer);
    }
  }, [variant]);

  // ── ViewContent on first scroll >= 25% ──
  useEffect(() => {
    const handleScroll = () => {
      if (viewContentFired.current) return;
      const scrollPercent =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= 0.25) {
        viewContentFired.current = true;
        trackStandard("ViewContent", {
          variant,
          content_name: "The Producer Blueprint",
          content_type: "product",
          value: 297,
          currency: "USD",
        });
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  // ── Exposed helpers ──

  const trackScrollToPricing = useCallback(
    ({ cta_location }: { cta_location: string }) => {
      trackCustom("TPB_ScrollToPricing", { variant, cta_location });
    },
    [variant]
  );

  const trackOrderBumpChecked = useCallback(
    ({ value }: { value: number }) => {
      const eid = generateEventId();
      trackStandard("AddToCart", {
        value,
        currency: "USD",
        content_name: "Producer Blueprint Order Bump",
        content_type: "product",
        variant,
      }, eid);
      trackCustom("TPB_OrderBump_Checked", { variant, value });
    },
    [variant]
  );

  const trackFinalCheckoutClick = useCallback(
    ({ value, order_bump_selected }: { value: number; order_bump_selected: boolean }) => {
      const eid = generateEventId();
      trackStandard("InitiateCheckout", {
        value,
        currency: "USD",
        content_name: "The Producer Blueprint",
        content_type: "product",
        variant,
      }, eid);
      trackCustom("TPB_Checkout_Click", {
        variant,
        cta_location: "pricing_card",
        order_bump_selected,
        value,
      });
    },
    [variant]
  );

  return { trackScrollToPricing, trackOrderBumpChecked, trackFinalCheckoutClick };
}
