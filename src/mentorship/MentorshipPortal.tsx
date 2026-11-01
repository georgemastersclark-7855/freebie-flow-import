import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { PortalStoreProvider, usePortalStore } from "./PortalStore";
import { PortalShell } from "./components/PortalShell";
import { PortalLogin } from "./pages/PortalLogin";
import { WelcomeHub } from "./pages/WelcomeHub";
import { StudioSetup } from "./pages/StudioSetup";
import { SongStarterLibrary } from "./pages/SongStarterLibrary";
import { SetupLesson } from "./pages/SetupLesson";
import { WeekWorkspace } from "./pages/WeekWorkspace";
import { AdminSchedule } from "./pages/AdminSchedule";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminReviewQueue } from "./pages/AdminReviewQueue";
import { AdminReview } from "./pages/AdminReview";
import { PortalSetPassword } from "./pages/PortalSetPassword";
import { PortalAuthConfirm } from "./pages/PortalAuthConfirm";
import { PortalStaffLogin } from "./pages/PortalStaffLogin";
import { PortalNoAccess } from "./pages/PortalNoAccess";
import { PortalLoading } from "./components/AuthLayout";
import { SignedInHome } from "./components/SignedInHome";
import { hasAuthPayload, rememberReturnTo } from "./auth";
import { AdminCohorts, AdminCohortStudents } from "./pages/AdminCohorts";
import { AdminStudentRecord } from "./pages/AdminStudentRecord";
import { AdminCohortRecords } from "./pages/AdminCohortRecords";
import { AdminApplicationForms } from "./pages/AdminApplicationForms";
import { AdminVideos } from "./pages/AdminVideos";
import { AdminSops } from "./pages/AdminSops";
import { AdminCrm } from "./pages/AdminCrm";
import { usePageMeta } from "@/hooks/usePageMeta";
import "./portal.css";

function QueryScope({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 10000 } } }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

function PortalQueryBoundary({ children }: { children: ReactNode }) {
  const { user } = usePortalStore();
  // A different account or view gets a fresh cache, including after sign-out.
  return <QueryScope key={`${user?.id ?? "guest"}:${user?.role ?? "none"}`}>{children}</QueryScope>;
}

function SignInFirst() {
  const { pathname, search, hash } = useLocation();
  // Remember the deep link (for example a feedback email) to reopen after sign-in.
  useEffect(() => { rememberReturnTo(`${pathname}${search}${hash}`); }, [pathname, search, hash]);
  return <Navigate to="/mentorship-portal" replace />;
}

function ProtectedPortal() {
  const { user, ready } = usePortalStore();
  if (!ready) return <PortalLoading />;
  return user ? <PortalShell /> : <SignInFirst />;
}

function RoleHome() {
  const { user, ready, accessIssue } = usePortalStore();
  const { search, hash } = useLocation();
  // Email links that fall back to the Site URL still finish on the confirm page.
  if (hasAuthPayload(search, hash)) return <Navigate to={`/mentorship-portal/auth/confirm${search}${hash}`} replace />;
  if (!ready) return <PortalLoading />;
  if (accessIssue) return <PortalNoAccess />;
  if (!user) return <PortalLogin />;
  return <SignedInHome />;
}

function LegacyWelcome() {
  const { hash } = useLocation();
  return <Navigate to={hash === "#setup-videos" ? "/mentorship-portal/setup" : `/mentorship-portal/dashboard${hash}`} replace />;
}

function LegacySubmissions() {
  const { weeks } = usePortalStore();
  const { search, hash } = useLocation();
  const openWeeks = weeks.filter((week) => week.phase !== "upcoming");
  const week = openWeeks.find((item) => item.phase === "current")
    ?? [...openWeeks].sort((a, b) => b.number - a.number)[0];
  return <Navigate to={week ? `/mentorship-portal/week/${week.number}${search}${hash}` : "/mentorship-portal/dashboard"} replace />;
}

function StudentOnly() {
  const { user } = usePortalStore();
  return user?.role === "student" ? <Outlet /> : <Navigate to="/mentorship-portal/admin" replace />;
}

function StaffOnly() {
  const { user } = usePortalStore();
  return user && user.role !== "student" ? <Outlet /> : <Navigate to="/mentorship-portal/dashboard" replace />;
}

function AdminOnly() {
  const { user } = usePortalStore();
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/mentorship-portal/admin" replace />;
}

function AdminHome() {
  const { hash } = useLocation();
  return hash === "#review-queue"
    ? <Navigate to="/mentorship-portal/admin/reviews" replace />
    : <AdminDashboard />;
}

export default function MentorshipPortal() {
  usePageMeta({
    title: "Mentorship Portal — Rob Late Audio",
    description:
      "Private portal for Rob Late Audio mentorship students: weekly submissions, feedback and live call resources.",
    canonical: "https://audio.roblate.com/mentorship-portal",
    ogType: "website",
    siteName: "Rob Late Audio",
    image: "https://audio.roblate.com/og-mentorship-portal.jpg",
    imageAlt: "Rob Late Audio Mentorship Portal",
  });

  return (
    <PortalStoreProvider>
      <PortalQueryBoundary>
      <Routes>
        <Route index element={<RoleHome />} />
        <Route path="set-password" element={<PortalSetPassword />} />
        <Route path="auth/confirm" element={<PortalAuthConfirm />} />
        <Route path="staff" element={<PortalStaffLogin />} />
        <Route element={<ProtectedPortal />}>
          <Route element={<StudentOnly />}>
            <Route path="submissions" element={<LegacySubmissions />} />
            <Route path="dashboard" element={<WelcomeHub />} />
            <Route path="welcome" element={<LegacyWelcome />} />
            <Route path="setup" element={<StudioSetup />} />
            <Route path="library" element={<SongStarterLibrary />} />
            <Route path="setup/:lessonKey" element={<SetupLesson />} />
            <Route path="week/:weekNumber" element={<WeekWorkspace />} />
          </Route>
          <Route element={<StaffOnly />}>
            <Route path="admin/crm" element={<Navigate to="/mentorship-portal/admin/crm/overview" replace />} />
            <Route path="admin/crm/overview" element={<AdminCrm />} />
            <Route path="admin/crm/leads" element={<AdminCrm />} />
            <Route path="admin/crm/onboarding" element={<AdminCrm />} />
            <Route path="admin" element={<AdminHome />} />
            <Route path="admin/cohorts" element={<AdminCohorts />} />
            <Route path="admin/cohorts/records/:recordCohortId" element={<AdminCohortRecords />} />
            <Route path="admin/cohorts/records/:recordCohortId/students/:recordStudentId" element={<AdminCohortRecords />} />
            <Route path="admin/cohorts/:cohortId" element={<AdminCohortStudents />} />
            <Route path="admin/cohorts/:cohortId/students/:enrollmentId" element={<AdminStudentRecord />} />
            <Route path="admin/schedule" element={<AdminSchedule />} />
            <Route path="admin/sops" element={<AdminSops />} />
            <Route path="admin/sops/:sopId" element={<AdminSops />} />
            <Route path="admin/reviews" element={<AdminReviewQueue />} />
            <Route element={<AdminOnly />}>
              <Route path="admin/videos" element={<AdminVideos />} />
              <Route path="admin/application-forms" element={<AdminApplicationForms />} />
              <Route path="admin/application-forms/:formId" element={<AdminApplicationForms />} />
            </Route>
            <Route path="admin/review/:reviewId" element={<AdminReview />} />
          </Route>
        </Route>
        <Route path="*" element={<RoleHome />} />
      </Routes>
      </PortalQueryBoundary>
    </PortalStoreProvider>
  );
}
