
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JulyGiveaway from "./pages/JulyGiveaway";
import AlphaDrums3VipList from "./pages/AlphaDrums3VipList";
import TestKlaviyo from "./pages/TestKlaviyo";
import SqueezePage from "./pages/SqueezePage";
import FreePackDownload from "./pages/FreePackDownload";
import UploadEmailAssets from "./pages/UploadEmailAssets";
import TheProducerBlueprint001 from "./pages/TheProducerBlueprint001";
import TheProducerBlueprint002Spotify from "./pages/TheProducerBlueprint002Spotify";
import ClaudeTest from "./pages/ClaudeTest";
import ProducerAccelerator from "./pages/ProducerAccelerator";
import TheProducerBlueprint003Career from "./pages/TheProducerBlueprint003Career";
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
          <Route path="/drumsthatslapfreedownload" element={<Index />} />
          <Route path="/julygiveaway" element={<JulyGiveaway />} />
          <Route path="/alphadrums3viplist" element={<AlphaDrums3VipList />} />
          <Route path="/test-klaviyo" element={<TestKlaviyo />} />
          <Route path="/squeeze" element={<SqueezePage />} />
          <Route path="/freepack" element={<FreePackDownload />} />
          <Route path="/upload-email-assets" element={<UploadEmailAssets />} />
          <Route path="/theproducerblueprint001" element={<TheProducerBlueprint001 />} />
          <Route path="/theproducerblueprint002spotify" element={<TheProducerBlueprint002Spotify />} />
          <Route path="/claudetest" element={<ClaudeTest />} />
          <Route path="/produceraccellerator" element={<ProducerAccelerator />} />
          <Route path="/theproducerblueprint003career" element={<TheProducerBlueprint003Career />} />
          <Route path="/HowToResampleLikeaPro" element={<Index />} />
          <Route path="/30daysofproducersauce" element={<Index />} />
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
