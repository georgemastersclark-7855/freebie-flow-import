import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { usePortalStore } from "../PortalStore";
import { clearReturnTo, peekReturnTo } from "../auth";
import { portalHome } from "../utils";

/**
 * Where a signed-in visitor goes from a sign-in page: the password screen if a
 * code or link just signed them in, else the deep link they were sent to, else
 * home (staff land on the staff dashboard whichever entrance they used).
 */
export function SignedInHome() {
  const { user, onboardingTasks, passwordStep } = usePortalStore();
  const [target] = useState(() => passwordStep
    ? "/mentorship-portal/set-password"
    : peekReturnTo() ?? (user ? portalHome(user, onboardingTasks) : "/mentorship-portal"));
  useEffect(() => { if (!passwordStep) clearReturnTo(); }, [passwordStep]);
  return <Navigate to={target} replace />;
}
