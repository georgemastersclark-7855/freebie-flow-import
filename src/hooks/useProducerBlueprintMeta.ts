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

  // ── On mount: init pixel, capture attribution, fire PageView ──
  useEffect(() => {
    initMetaPixel();
    captureAttribution();

    // Guard duplicate PageView per page load using sessionStorage
    const pvKey = `tpb_pv_${window.location.pathname}`;
    if (!sessionStorage.getItem(pvKey) && !pageViewFired.current) {
      pageViewFired.current = true;
      sessionStorage.setItem(pvKey, "1");
      trackStandard("PageView", { variant });
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
