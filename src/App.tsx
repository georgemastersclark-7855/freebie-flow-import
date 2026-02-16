
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import TheProducerBlueprint001 from "./pages/TheProducerBlueprint001";
import TheProducerBlueprint002Spotify from "./pages/TheProducerBlueprint002Spotify";
import ClaudeTest from "./pages/ClaudeTest";
import ProducerAccelerator from "./pages/ProducerAccelerator";
import TheProducerBlueprint004Gear from "./pages/TheProducerBlueprint004Gear";
import TheProducerBlueprint003Career from "./pages/TheProducerBlueprint003Career";
import TheProducerBlueprint005Workflow from "./pages/TheProducerBlueprint005Workflow";
import Redirect from "./components/Redirect";
import { UTMDebugger } from "@/components/UTMDebugger";

// Legal Pages
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import RefundPolicy from "./pages/legal/RefundPolicy";
import EarningsDisclaimer from "./pages/legal/EarningsDisclaimer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UTMDebugger />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Redirect to="https://roblate.com" />} />
          
          {/* Canonical Blueprint routes */}
          <Route path="/producer-blueprint" element={<TheProducerBlueprint001 />} />
          <Route path="/build-your-music-catalog" element={<TheProducerBlueprint002Spotify />} />
          <Route path="/make-money-with-music" element={<TheProducerBlueprint003Career />} />
          <Route path="/produce-without-expensive-gear" element={<TheProducerBlueprint004Gear />} />
          <Route path="/finish-more-tracks" element={<TheProducerBlueprint005Workflow />} />
          {/* Legacy redirects */}
          <Route path="/theproducerblueprint001" element={<Redirect to="/producer-blueprint" />} />
          <Route path="/theproducerblueprint002spotify" element={<Redirect to="/build-your-music-catalog" />} />
          <Route path="/theproducerblueprint003career" element={<Redirect to="/make-money-with-music" />} />
          <Route path="/theproducerblueprint004gear" element={<Redirect to="/produce-without-expensive-gear" />} />
          <Route path="/theproducerblueprint005workflow" element={<Redirect to="/finish-more-tracks" />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
