function getLocalParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

export function scheduleIsoToLocalInput(value: string | null, timezone: string) {
  if (!value) return "";
  const parts = getLocalParts(new Date(value), timezone);
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function scheduleLocalInputToIso(value: string, timezone: string): string | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error("Enter a valid local date and time.");
  const [, year, month, day, hour, minute] = match;
  const desired = { year, month, day, hour, minute };
  const localAsUtc = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
  const normalized = new Date(localAsUtc);
  if (normalized.getUTCFullYear() !== Number(year) || normalized.getUTCMonth() !== Number(month) - 1
    || normalized.getUTCDate() !== Number(day) || normalized.getUTCHours() !== Number(hour) || normalized.getUTCMinutes() !== Number(minute)) {
    throw new Error("Enter a valid calendar date and time.");
  }
  const offsets = new Set<number>();
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  for (let deltaHours = -48; deltaHours <= 48; deltaHours += 6) {
    const sample = new Date(localAsUtc + deltaHours * 60 * 60 * 1000);
    const parts = Object.fromEntries(formatter.formatToParts(sample).map(({ type, value: part }) => [type, part]));
    const shownAsUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute));
    offsets.add(shownAsUtc - sample.getTime());
  }
  const matches: number[] = [];
  for (const offset of offsets) {
    const candidate = localAsUtc - offset;
    const parts = getLocalParts(new Date(candidate), timezone);
    if (parts.year === desired.year && parts.month === desired.month && parts.day === desired.day && parts.hour === desired.hour && parts.minute === desired.minute) matches.push(candidate);
  }
  if (matches.length === 0) throw new Error("That local time does not exist because the clocks change. Choose another time.");
  if (matches.length > 1) throw new Error("That local time occurs twice when the clocks change. Choose a time outside the repeated hour.");
  return new Date(matches[0]).toISOString();
}

export function scheduleLocalPreview(value: string, timezone: string) {
  if (!value) return "";
  const iso = scheduleLocalInputToIso(value, timezone);
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: timezone, timeZoneName: "short" }).format(new Date(iso));
}
