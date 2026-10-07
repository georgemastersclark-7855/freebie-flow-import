export type TimezoneLocation = { zone: string; name: string; places: string; group: string };

// Keep country-specific zones separate, even where today's offsets match.
export const commonTimezoneLocations: TimezoneLocation[] = [
  { zone: "Europe/London", name: "UK time", places: "United Kingdom · London", group: "UK & Europe" },
  { zone: "Europe/Dublin", name: "Ireland time", places: "Ireland · Dublin", group: "UK & Europe" },
  { zone: "Europe/Paris", name: "Central European Time", places: "France · Paris", group: "UK & Europe" },
  { zone: "Europe/Berlin", name: "Central European Time", places: "Germany · Berlin", group: "UK & Europe" },
  { zone: "Europe/Amsterdam", name: "Central European Time", places: "Netherlands · Amsterdam", group: "UK & Europe" },
  { zone: "Europe/Madrid", name: "Central European Time", places: "Spain · Madrid", group: "UK & Europe" },
  { zone: "Europe/Rome", name: "Central European Time", places: "Italy · Rome", group: "UK & Europe" },
  { zone: "Europe/Stockholm", name: "Central European Time", places: "Sweden · Stockholm", group: "UK & Europe" },
  { zone: "Europe/Lisbon", name: "Portugal time", places: "Portugal · Lisbon", group: "UK & Europe" },
  { zone: "Europe/Helsinki", name: "Eastern European Time", places: "Finland · Helsinki", group: "UK & Europe" },
  { zone: "Europe/Athens", name: "Eastern European Time", places: "Greece · Athens", group: "UK & Europe" },
  { zone: "America/New_York", name: "Eastern Time", places: "USA · New York, Miami", group: "USA" },
  { zone: "America/Chicago", name: "Central Time", places: "USA · Chicago, Dallas", group: "USA" },
  { zone: "America/Denver", name: "Mountain Time", places: "USA · Denver", group: "USA" },
  { zone: "America/Phoenix", name: "Arizona time", places: "USA · Phoenix", group: "USA" },
  { zone: "America/Los_Angeles", name: "Pacific Time", places: "USA · Los Angeles, Seattle", group: "USA" },
  { zone: "America/Anchorage", name: "Alaska time", places: "USA · Anchorage", group: "USA" },
  { zone: "Pacific/Honolulu", name: "Hawaii time", places: "USA · Honolulu", group: "USA" },
  { zone: "America/Toronto", name: "Eastern Time", places: "Canada · Toronto, Montreal", group: "Canada" },
  { zone: "America/Winnipeg", name: "Central Time", places: "Canada · Winnipeg", group: "Canada" },
  { zone: "America/Edmonton", name: "Mountain Time", places: "Canada · Edmonton, Calgary", group: "Canada" },
  { zone: "America/Vancouver", name: "Pacific Time", places: "Canada · Vancouver", group: "Canada" },
  { zone: "America/Halifax", name: "Atlantic Time", places: "Canada · Halifax", group: "Canada" },
  { zone: "America/St_Johns", name: "Newfoundland time", places: "Canada · St. John's", group: "Canada" },
  { zone: "America/Regina", name: "Saskatchewan time", places: "Canada · Regina", group: "Canada" },
  { zone: "Australia/Sydney", name: "Australian Eastern Time", places: "Australia · Sydney", group: "Australia & New Zealand" },
  { zone: "Australia/Melbourne", name: "Australian Eastern Time", places: "Australia · Melbourne", group: "Australia & New Zealand" },
  { zone: "Australia/Brisbane", name: "Queensland time", places: "Australia · Brisbane", group: "Australia & New Zealand" },
  { zone: "Australia/Adelaide", name: "Australian Central Time", places: "Australia · Adelaide", group: "Australia & New Zealand" },
  { zone: "Australia/Darwin", name: "Northern Territory time", places: "Australia · Darwin", group: "Australia & New Zealand" },
  { zone: "Australia/Perth", name: "Australian Western Time", places: "Australia · Perth", group: "Australia & New Zealand" },
  { zone: "Pacific/Auckland", name: "New Zealand time", places: "New Zealand · Auckland", group: "Australia & New Zealand" },
  { zone: "Asia/Dubai", name: "Gulf Standard Time", places: "United Arab Emirates · Dubai, Abu Dhabi", group: "Dubai / UAE" },
];

export function timezoneLocation(zone: string): TimezoneLocation {
  const known = commonTimezoneLocations.find((item) => item.zone === zone);
  if (known) return known;
  if (["UTC", "Etc/UTC", "Etc/GMT", "GMT"].includes(zone)) return { zone, name: "World reference time", places: "Fixed reference time. Choose a city for your local time.", group: "Other locations" };
  const parts = zone.replace(/_/g, " ").split("/");
  const city = parts.pop() || zone;
  const region = parts.join(" · ").replace(/^America$/, "Americas");
  const name = new Intl.DateTimeFormat("en-GB", { timeZone: zone, timeZoneName: "longGeneric" }).formatToParts(new Date()).find((part) => part.type === "timeZoneName")?.value;
  return { zone, name: name && !/GMT|UTC|Coordinated Universal/i.test(name) ? name : `${city} time`, places: `${region} · ${city}`, group: "Other locations" };
}

export const timezoneLabel = (zone: string) => {
  const location = timezoneLocation(zone);
  return location.name === "World reference time" ? location.name : `${location.name} · ${location.places}`;
};
export const timezoneClock = (zone: string, date: Date) => new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "numeric", minute: "2-digit", hour12: true }).format(date);

export function allTimezoneLocations(extraZones: string[] = []) {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] };
  const common = new Set(commonTimezoneLocations.map((item) => item.zone));
  const other = [...new Set([...extraZones, ...(intl.supportedValuesOf?.("timeZone") ?? [])])]
    .filter((zone) => !common.has(zone)).map(timezoneLocation).sort((a, b) => a.places.localeCompare(b.places));
  return [...commonTimezoneLocations, ...other];
}
