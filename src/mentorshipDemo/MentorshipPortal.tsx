import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { PortalStoreProvider, usePortalStore } from "./PortalStore";
import { PortalShell } from "./components/PortalShell";
import { PortalLogin } from "./pages/PortalLogin";
import { StudentDashboard } from "./pages/StudentDashboard";
import { WelcomeHub } from "./pages/WelcomeHub";
import { SetupLesson } from "./pages/SetupLesson";
import { WeekWorkspace } from "./pages/WeekWorkspace";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminReview } from "./pages/AdminReview";
import { PortalSetPassword } from "./pages/PortalSetPassword";
import { AdminVideos } from "./pages/AdminVideos";
import "./portal.css";
import { portalHome } from "./utils";

function ProtectedPortal() {
  const { user, ready } = usePortalStore();
  if (!ready) return <PortalLoading />;
  return user ? <PortalShell /> : <Navigate to="/mentorship-demo" replace />;
}

function RoleHome() {
  const { user, ready, onboardingTasks } = usePortalStore();
  if (!ready) return <PortalLoading />;
  if (!user) return <PortalLogin />;
  return <Navigate to={portalHome(user, onboardingTasks)} replace />;
}

function PortalLoading() {
  return <div className="mentorship-portal grid min-h-screen place-items-center"><div className="text-xs font-bold uppercase tracking-[0.18em] text-[#77766f]">Loading your mentorship…</div></div>;
}

function StudentOnly() {
  const { user } = usePortalStore();
  return user?.role === "student" ? <Outlet /> : <Navigate to="/mentorship-demo/admin" replace />;
}

function StaffOnly() {
  const { user } = usePortalStore();
  return user && user.role !== "student" ? <Outlet /> : <Navigate to="/mentorship-demo/submissions" replace />;
}

function AdminOnly() {
  const { user } = usePortalStore();
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/mentorship-demo/admin" replace />;
}

export default function MentorshipPortal() {
  return (
    <PortalStoreProvider>
      <Routes>
        <Route index element={<RoleHome />} />
        <Route path="set-password" element={<PortalSetPassword />} />
        <Route element={<ProtectedPortal />}>
          <Route element={<StudentOnly />}>
            <Route path="submissions" element={<StudentDashboard />} />
            <Route path="dashboard" element={<Navigate to="/mentorship-demo/submissions" replace />} />
            <Route path="welcome" element={<WelcomeHub />} />
            <Route path="setup/:lessonKey" element={<SetupLesson />} />
            <Route path="week/:weekNumber" element={<WeekWorkspace />} />
          </Route>
          <Route element={<StaffOnly />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route element={<AdminOnly />}>
              <Route path="admin/videos" element={<AdminVideos />} />
            </Route>
            <Route path="admin/review/:reviewId" element={<AdminReview />} />
          </Route>
        </Route>
        <Route path="*" element={<RoleHome />} />
      </Routes>
    </PortalStoreProvider>
  );
}
