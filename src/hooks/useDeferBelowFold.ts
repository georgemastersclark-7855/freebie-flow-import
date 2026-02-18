import { useCallback, useEffect, useState } from "react";

interface UseDeferBelowFoldOptions {
  fallbackDelayMs?: number;
  scrollThresholdRatio?: number;
}

export function useDeferBelowFold(options: UseDeferBelowFoldOptions = {}) {
  const { fallbackDelayMs = 8000, scrollThresholdRatio = 0.3 } = options;
  const [shouldRenderBelowFold, setShouldRenderBelowFold] = useState(false);

  const revealBelowFold = useCallback(() => {
    setShouldRenderBelowFold(true);
  }, []);

  useEffect(() => {
    if (shouldRenderBelowFold) return;

    const reveal = () => setShouldRenderBelowFold(true);
    const onScroll = () => {
      if (window.scrollY >= Math.max(200, window.innerHeight * scrollThresholdRatio)) {
        reveal();
      }
    };

    const timer = window.setTimeout(reveal, fallbackDelayMs);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", reveal, { passive: true, once: true });
    window.addEventListener("wheel", reveal, { passive: true, once: true });
    window.addEventListener("keydown", reveal, { once: true });

    onScroll();

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", reveal);
      window.removeEventListener("wheel", reveal);
      window.removeEventListener("keydown", reveal);
    };
  }, [fallbackDelayMs, scrollThresholdRatio, shouldRenderBelowFold]);

  return { shouldRenderBelowFold, revealBelowFold };
}
