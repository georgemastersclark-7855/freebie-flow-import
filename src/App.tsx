
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { loadKlaviyo } from "@/utils/loadKlaviyo";
import Redirect from "./components/Redirect";

// Lazy-loaded UI chrome (only needed for checkout error toasts — deferred until after page render)
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));
const UTMDebugger = lazy(() => import("@/components/UTMDebugger").then(m => ({ default: m.UTMDebugger })));

// Lazy-loaded landing pages (preload map in main.tsx prevents black screen)
const TheProducerBlueprint001 = lazy(() => import("./pages/TheProducerBlueprint001"));
const TheProducerBlueprint002Spotify = lazy(() => import("./pages/TheProducerBlueprint002Spotify"));
const TheProducerBlueprint003Career = lazy(() => import("./pages/TheProducerBlueprint003Career"));
const TheProducerBlueprint004Gear = lazy(() => import("./pages/TheProducerBlueprint004Gear"));
const TheProducerBlueprint005Workflow = lazy(() => import("./pages/TheProducerBlueprint005Workflow"));

// Lazy-loaded secondary pages
const NotFound = lazy(() => import("./pages/NotFound"));
const ClaudeTest = lazy(() => import("./pages/ClaudeTest"));
const ProducerAccelerator = lazy(() => import("./pages/ProducerAccelerator"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const RefundPolicy = lazy(() => import("./pages/legal/RefundPolicy"));
const EarningsDisclaimer = lazy(() => import("./pages/legal/EarningsDisclaimer"));

const BlackFallback = <div className="bg-[#050505] min-h-screen" />;

const isDebug = new URLSearchParams(window.location.search).get('debug') === 'true';

const App = () => {
  const [chromeReady, setChromeReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(loadKlaviyo, 3000);
    // Defer toast/sonner chunks until after page has painted — avoids bandwidth competition on mobile
    const chromeTimer = setTimeout(() => setChromeReady(true), 2000);
    return () => { clearTimeout(timer); clearTimeout(chromeTimer); };
  }, []);

  return (
    <>
      {chromeReady && (
        <Suspense fallback={null}>
          <Toaster />
          <Sonner />
        </Suspense>
      )}
      {isDebug && (
        <Suspense fallback={null}>
          <UTMDebugger />
        </Suspense>
      )}
      <BrowserRouter>
        <Suspense fallback={BlackFallback}>
          <Routes>
            <Route path="/" element={<Redirect to="https://roblate.com" />} />
            
            {/* Canonical Blueprint routes */}
            <Route path="/producer-blueprint" element={<TheProducerBlueprint001 />} />
            <Route path="/build-your-music-catalog" element={<TheProducerBlueprint002Spotify />} />
            <Route path="/make-money-with-music" element={<TheProducerBlueprint003Career />} />
            <Route path="/produce-without-expensive-gear" element={<TheProducerBlueprint004Gear />} />
            <Route path="/finish-more-tracks" element={<TheProducerBlueprint005Workflow />} />
            <Route path="/claudetest" element={<ClaudeTest />} />
            <Route path="/produceraccellerator" element={<ProducerAccelerator />} />
            {/* Legal Pages */}
            <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal/terms-of-service" element={<TermsOfService />} />
            <Route path="/legal/refund-policy" element={<RefundPolicy />} />
            <Route path="/legal/earnings-disclaimer" element={<EarningsDisclaimer />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;
