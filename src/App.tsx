import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Redirect from "./components/Redirect";

// Lazy-loaded pages
const TheProducerBlueprint001 = lazy(() => import("./pages/TheProducerBlueprint001"));
const TheProducerBlueprint002Spotify = lazy(() => import("./pages/TheProducerBlueprint002Spotify"));
const TheProducerBlueprint003Career = lazy(() => import("./pages/TheProducerBlueprint003Career"));
const TheProducerBlueprint004Gear = lazy(() => import("./pages/TheProducerBlueprint004Gear"));
const TheProducerBlueprint005Workflow = lazy(() => import("./pages/TheProducerBlueprint005Workflow"));
const ClaudeTest = lazy(() => import("./pages/ClaudeTest"));
const ProducerAccelerator = lazy(() => import("./pages/ProducerAccelerator"));

// Legal Pages
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const RefundPolicy = lazy(() => import("./pages/legal/RefundPolicy"));
const EarningsDisclaimer = lazy(() => import("./pages/legal/EarningsDisclaimer"));

// Lazy-load UTM debugger so it never loads in production
const UTMDebugger = lazy(() => import("@/components/UTMDebugger").then(m => ({ default: m.UTMDebugger })));

const queryClient = new QueryClient();

// Branded loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
    <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tighter animate-pulse">
      The Producer Blueprint
    </h1>
    <p className="text-zinc-500 text-sm mt-3 tracking-wide">Loading...</p>
  </div>
);

// Only mount UTMDebugger when ?debug=true
const ConditionalDebugger = () => {
  const [searchParams] = useSearchParams();
  if (searchParams.get("debug") !== "true") return null;
  return (
    <Suspense fallback={null}>
      <UTMDebugger />
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ConditionalDebugger />
        <Suspense fallback={<LoadingFallback />}>
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

export default App;
