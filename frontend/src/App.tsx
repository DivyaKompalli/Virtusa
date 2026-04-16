import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Layout from "./components/Layout.tsx";
import NotFound from "./pages/NotFound.tsx";
import PriorAuthorizationDashboard from "./pages/PriorAuthorizationDashboard.tsx";
import ClinicalDataExtraction from "./pages/ClinicalDataExtraction.tsx";
import PayerPolicyValidation from "./pages/PayerPolicyValidation.tsx";
import AuthorizationStatusDecisionDetail from "./pages/AuthorizationStatusDecisionDetail.tsx";
import AppealCenterLetterManagement from "./pages/AppealCenterLetterManagement.tsx";
import PolicyLibraryIngestion from "./pages/PolicyLibraryIngestion.tsx";
import { PipelineProvider } from "./context/PipelineContext.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PipelineProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PriorAuthorizationDashboard />} />
            <Route path="dashboard" element={<PriorAuthorizationDashboard />} />
            <Route path="clinical" element={<ClinicalDataExtraction />} />
            <Route path="policy" element={<PayerPolicyValidation />} />
            <Route path="decision" element={<AuthorizationStatusDecisionDetail />} />
            <Route path="appeal" element={<AppealCenterLetterManagement />} />
            <Route path="library" element={<PolicyLibraryIngestion />} />
          </Route>
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PipelineProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
