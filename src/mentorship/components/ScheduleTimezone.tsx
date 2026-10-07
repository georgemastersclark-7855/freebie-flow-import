import { useMemo, useState } from "react";
import { Check, ChevronDown, Globe2 } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePortalClock } from "../usePortalClock";
import { deviceTimezone, useScheduleTimezone } from "../useScheduleTimezone";
import { allTimezoneLocations, timezoneClock, timezoneLabel, timezoneLocation } from "../timezoneLabels";
import "../timezonePicker.css";

function TimezoneSelect({ value, onChange, label, automatic = false, date, light = false }: { value: string; onChange: (zone: string) => void; label: string; automatic?: boolean; date: Date; light?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const device = deviceTimezone();
  const selected = value === "auto" ? device : value;
  const locations = useMemo(() => allTimezoneLocations([device, selected]), [device, selected]);
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const filtered = locations.filter((item) => (showAll || words.length || item.group !== "Other locations" || item.zone === selected) && words.every((word) => `${item.name} ${item.places} ${item.zone}`.toLowerCase().includes(word)));
  const groups = [...new Set(filtered.map((item) => item.group))];
  const choose = (zone: string) => { onChange(zone); setOpen(false); setQuery(""); setShowAll(false); };
  return <Popover open={open} onOpenChange={(next) => { setOpen(next); if (!next) { setQuery(""); setShowAll(false); } }}>
    <PopoverTrigger asChild><button type="button" className={`tz-trigger${light ? " tz-light" : ""}`} aria-label={`${label}: ${value === "auto" ? "Automatic, " : ""}${timezoneLabel(selected)}`}><Globe2 size={14} /><span>{value === "auto" ? `Your local time · ${timezoneLocation(selected).places.split(" · ").slice(-1)[0]}` : timezoneLabel(selected)}</span><ChevronDown size={13} /></button></PopoverTrigger>
    <PopoverContent align="end" className={`tz-popover${light ? " tz-light" : ""}`}>
      <Command shouldFilter={false}>
        <CommandInput aria-label="Search time zones" placeholder="Search city, country or time zone…" value={query} onValueChange={setQuery} />
        <div className="tz-list-hint">{automatic ? "Times on your portal update automatically." : "Compare local times for this date."}<span>{automatic ? "Local time now" : "Local time"}</span></div>
        <CommandList aria-label="Time zones">
          {automatic && !query && <CommandGroup><CommandItem value="auto" onSelect={() => choose("auto")}><span className="tz-option-text"><strong>Use my device's time zone</strong><small>{timezoneLabel(device)}</small></span><span className="tz-option-time">{timezoneClock(device, date)}</span>{value === "auto" && <Check size={14} aria-label="Selected" />}</CommandItem></CommandGroup>}
          {groups.map((group) => <CommandGroup key={group} heading={group}>{filtered.filter((item) => item.group === group).map((item) => <CommandItem key={item.zone} value={item.zone} onSelect={() => choose(item.zone)}><span className="tz-option-text"><strong>{item.name}</strong><small>{item.places}</small></span><span className="tz-option-time">{timezoneClock(item.zone, date)}</span>{value === item.zone && <Check size={14} aria-label="Selected" />}</CommandItem>)}</CommandGroup>)}
          {!filtered.length && <CommandEmpty>No matching location. Try a nearby major city.</CommandEmpty>}
        </CommandList>
        {!showAll && !query && <button type="button" className="tz-show-all" onClick={() => setShowAll(true)}>Show all other locations</button>}
      </Command>
    </PopoverContent>
  </Popover>;
}

export function ScheduleTimezonePicker() {
  const { preference, setTimezone } = useScheduleTimezone();
  const now = usePortalClock();
  return <div className="mp-timezone-picker"><TimezoneSelect label="Display time zone" value={preference} onChange={setTimezone} automatic date={new Date(now)} /></div>;
}

export function TimezoneReference({ timezone, value }: { timezone: string; value?: string | null }) {
  const now = usePortalClock();
  const [extra, setExtra] = useState(timezone);
  const date = value ? new Date(value) : new Date(now);
  const zones = [...new Set([timezone, "Europe/London", "America/New_York", "America/Toronto", "America/Los_Angeles", "America/Vancouver", "Europe/Berlin", "Asia/Dubai", "Australia/Sydney", extra])];
  return <section className="sc-timezone-reference" aria-label="Time zone reference"><div><Globe2 size={15} /><h3>{value ? "This call in other time zones" : "Time around the world"}</h3></div><p>{value ? "Converted for this call's date, including clock changes." : "Current local times. Edit a call to compare its scheduled time."}</p><dl>{zones.map((zone) => { const location = timezoneLocation(zone); return <div key={zone}><dt>{location.places}<small>{location.name}{zone === timezone && " · Schedule time"}</small></dt><dd>{timezoneClock(zone, date)}<small>{new Intl.DateTimeFormat("en-GB", { timeZone: zone, weekday: "short", day: "numeric", month: "short" }).format(date)}</small></dd></div>; })}</dl><div className="sc-field"><span>Compare another time zone</span><TimezoneSelect label="Compare another time zone" value={extra} onChange={setExtra} date={date} light /></div></section>;
}
