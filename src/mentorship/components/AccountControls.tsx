import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { LogOut, MonitorSmartphone, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePortalStore } from "../PortalStore";
import { describeAuthError } from "../auth";
import { SecondaryButton } from "./PortalUI";

/** Ends every session for the account: phones, laptops and this browser. */
export function SignOutEverywhere() {
  const { logout } = usePortalStore();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const signOutEverywhere = async () => {
    setBusy(true);
    setError("");
    try {
      await logout("global");
      navigate("/mentorship-portal", { replace: true, state: { signedOut: true } });
    } catch (reason) {
      setError(describeAuthError(reason, "sign-out").message);
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-[#eeeae1]"><MonitorSmartphone size={16} aria-hidden="true" />Signed in somewhere else?</p>
      <p className="mt-1 text-xs leading-5 text-[#aaa99f]">Sign out of the portal on every phone, tablet and computer, including this one.</p>
      {confirming ? (
        <div role="alertdialog" aria-label="Sign out of all devices" className="mt-3">
          <p className="text-xs leading-5 text-[#d4d0c5]">You'll need your password to sign back in on each device.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => void signOutEverywhere()} disabled={busy} className="mp-focus-ring min-h-11 rounded-xl bg-[#f2efe6] px-4 text-sm font-bold text-black disabled:opacity-50">{busy ? "Signing out..." : "Yes, sign out everywhere"}</button>
            <SecondaryButton onClick={() => setConfirming(false)} disabled={busy} className="min-h-11">Cancel</SecondaryButton>
          </div>
        </div>
      ) : (
        <SecondaryButton onClick={() => setConfirming(true)} className="mt-3 min-h-11"><LogOut size={16} aria-hidden="true" />Sign out of all devices</SecondaryButton>
      )}
      {error && <p role="alert" className="mt-3 text-xs text-red-200">{error}</p>}
    </div>
  );
}

/** Staff have no student profile, so their account settings live here. */
export function StaffAccountDialog({ open, onOpenChange, onSignOut }: { open: boolean; onOpenChange: (open: boolean) => void; onSignOut: () => void }) {
  const { user, staffUser } = usePortalStore();
  const account = staffUser ?? user;
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="mentorship-portal mp-profile-dialog fixed left-1/2 top-1/2 z-[90] max-h-[92dvh] w-[calc(100%-24px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/20 bg-[#151512] p-5 shadow-2xl outline-none sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-2xl font-bold text-[#f2efe6]">Account</Dialog.Title>
              <Dialog.Description className="mt-2 text-sm leading-6 text-[#b7b7ad]">{account?.name} · {account?.role === "admin" ? "Admin" : "Coach"}<br />{account?.email}</Dialog.Description>
            </div>
            <Dialog.Close className="mp-focus-ring rounded-lg p-2 text-[#b7b7ad] hover:text-white" aria-label="Close account"><X size={19} /></Dialog.Close>
          </div>
          <div className="mt-6 space-y-3">
            <SecondaryButton onClick={onSignOut} className="min-h-11 w-full justify-start"><LogOut size={16} aria-hidden="true" />Sign out on this device</SecondaryButton>
            <SignOutEverywhere />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
