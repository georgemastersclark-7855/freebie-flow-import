import { useState } from "react";
import { Globe2 } from "lucide-react";
import { usePortalClock } from "../usePortalClock";
import { deviceTimezone, referenceZones, timezoneOptions, useScheduleTimezone } from "../useScheduleTimezone";

export function ScheduleTimezonePicker() {
  const { preference, setTimezone } = useScheduleTimezone();
  return <label className="mp-timezone-picker"><Globe2 size={13} /><span className="sr-only">Display time zone</span><select aria-label="Display time zone" value={preference} onChange={(e) => setTimezone(e.target.value)}><option value="auto">Your time: {deviceTimezone().replace(/_/g, " ")} (automatic)</option>{timezoneOptions().map((zone) => <option value={zone} key={zone}>{zone.replace(/_/g, " ")}</option>)}</select></label>;
}

export function TimezoneReference({ timezone, value }: { timezone: string; value?: string | null }) {
  const now = usePortalClock();
  const [extra, setExtra] = useState(timezone);
  const date = value ? new Date(value) : new Date(now);
  const zones = [...new Set([timezone, ...referenceZones.slice(0, 3), "Europe/Berlin", "Australia/Sydney", extra])];
  return <section className="sc-timezone-reference" aria-label="Time zone reference"><div><Globe2 size={15} /><h3>{value ? "This call in other time zones" : "Time around the world"}</h3></div><p>{value ? "Converted for this call's date, including clock changes." : "Current local times. Edit a call to compare its scheduled time."}</p><dl>{zones.map((zone) => <div key={zone}><dt>{zone.split("/").at(-1)?.replace(/_/g, " ")}{zone === timezone && <small>Schedule time</small>}</dt><dd>{new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(date)}<small>{new Intl.DateTimeFormat("en-GB", { timeZone: zone, weekday: "short", day: "numeric", month: "short" }).format(date)}</small></dd></div>)}</dl><label className="sc-field"><span>Compare another time zone</span><select value={extra} onChange={(e) => setExtra(e.target.value)}>{timezoneOptions().map((zone) => <option key={zone} value={zone}>{zone.replace(/_/g, " ")}</option>)}</select></label></section>;
}
