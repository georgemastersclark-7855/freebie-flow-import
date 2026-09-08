import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import MentorshipPortal from "./mentorship/MentorshipPortal";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/mentorship-portal/*" element={<MentorshipPortal />} />
        <Route path="*" element={<Navigate to="/mentorship-portal" replace />} />
      </Routes>
      <Toaster theme="dark" richColors />
    </BrowserRouter>
  </React.StrictMode>,
);
