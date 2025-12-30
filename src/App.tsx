
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
import Redirect from "./components/Redirect";
import { UTMDebugger } from "@/components/UTMDebugger";

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
          <Route path="/HowToResampleLikeaPro" element={<Index />} />
          <Route path="/30daysofproducersauce" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
