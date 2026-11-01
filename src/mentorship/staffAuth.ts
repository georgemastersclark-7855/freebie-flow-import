/**
 * Staff sign-in runs as a series of steps so a second factor can slot in later
 * without reworking the page.
 *
 * Today: "password" -> "complete".
 *
 * Adding MFA later:
 * 1. Add { kind: "mfa"; factorId: string } to StaffSignInStep.
 * 2. In nextStaffStep, call supabase.auth.mfa.getAuthenticatorAssuranceLevel().
 *    When nextLevel is "aal2" and currentLevel is "aal1", list factors and return
 *    the "mfa" step; the page renders a code form that calls mfa.challengeAndVerify.
 * 3. Hold the portal load until "complete" (PortalStore loads on SIGNED_IN), and
 *    require aal2 in the staff RLS policies so the server enforces it too.
 */
export type StaffSignInStep = { kind: "password" } | { kind: "complete" };

export async function nextStaffStep(current: StaffSignInStep): Promise<StaffSignInStep> {
  if (current.kind === "password") return { kind: "complete" };
  return current;
}
