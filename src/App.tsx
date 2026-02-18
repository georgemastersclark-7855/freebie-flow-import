
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { loadKlaviyo } from "@/utils/loadKlaviyo";
import Redirect from "./components/Redirect";
import { UTMDebugger } from "@/components/UTMDebugger";

// Eager imports for landing pages (no lazy loading = no black screen)
import TheProducerBlueprint001 from "./pages/TheProducerBlueprint001";
import TheProducerBlueprint002Spotify from "./pages/TheProducerBlueprint002Spotify";
import TheProducerBlueprint003Career from "./pages/TheProducerBlueprint003Career";
import TheProducerBlueprint004Gear from "./pages/TheProducerBlueprint004Gear";
import TheProducerBlueprint005Workflow from "./pages/TheProducerBlueprint005Workflow";

// Lazy-loaded secondary pages
const NotFound = lazy(() => import("./pages/NotFound"));
const ClaudeTest = lazy(() => import("./pages/ClaudeTest"));
const ProducerAccelerator = lazy(() => import("./pages/ProducerAccelerator"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const RefundPolicy = lazy(() => import("./pages/legal/RefundPolicy"));
const EarningsDisclaimer = lazy(() => import("./pages/legal/EarningsDisclaimer"));

const queryClient = new QueryClient();

const BlackFallback = <div className="bg-[#050505] min-h-screen" />;

const App = () => {
  useEffect(() => {
    const timer = setTimeout(loadKlaviyo, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {new URLSearchParams(window.location.search).get('debug') === 'true' && <UTMDebugger />}
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
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
