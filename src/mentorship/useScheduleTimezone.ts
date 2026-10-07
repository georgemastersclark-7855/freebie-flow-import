import { useSyncExternalStore } from "react";
import { localScheduleTime } from "./schedule";

const key = "rla-portal-display-timezone";
export const deviceTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
export function validTimezone(zone: string) {
  try { new Intl.DateTimeFormat("en", { timeZone: zone }).format(); return true; } catch { return false; }
}
function getPreference() {
  try { const saved = localStorage.getItem(key); return saved && validTimezone(saved) ? saved : "auto"; } catch { return "auto"; }
}
function subscribe(callback: () => void) {
  window.addEventListener("rla-timezone-change", callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener("rla-timezone-change", callback); window.removeEventListener("storage", callback); };
}
export function useScheduleTimezone() {
  const preference = useSyncExternalStore(subscribe, getPreference, () => "auto");
  const timezone = preference === "auto" ? deviceTimezone() : preference;
  const setTimezone = (zone: string) => {
    if (zone !== "auto" && !validTimezone(zone)) return;
    try { if (zone === "auto") localStorage.removeItem(key); else localStorage.setItem(key, zone); } catch { return; }
    window.dispatchEvent(new Event("rla-timezone-change"));
  };
  return { preference, timezone, setTimezone, formatTime: (value?: string) => localScheduleTime(value, timezone) };
}
export const referenceZones = ["Europe/London", "America/New_York", "America/Los_Angeles", "Europe/Berlin", "Asia/Dubai", "Asia/Kolkata", "Australia/Sydney"];
export function timezoneOptions() {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] };
  return [...new Set([deviceTimezone(), ...referenceZones, "UTC", ...intl.supportedValuesOf?.("timeZone") ?? []])].sort();
}
