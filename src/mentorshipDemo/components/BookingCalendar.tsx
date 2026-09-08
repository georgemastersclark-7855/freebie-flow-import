import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ExternalLink, Loader2 } from "lucide-react";

type CalendlyEmbed = {
  initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
};

const calendly = () => (window as Window & { Calendly?: CalendlyEmbed }).Calendly;
let widgetPromise: Promise<CalendlyEmbed> | undefined;

function loadCalendly() {
  if (calendly()) return Promise.resolve(calendly()!);
  if (widgetPromise) return widgetPromise;
  widgetPromise = new Promise<CalendlyEmbed>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    const fail = () => {
      window.clearTimeout(timeout);
      script.remove();
      widgetPromise = undefined;
      reject(new Error("The booking calendar couldn't load."));
    };
    const timeout = window.setTimeout(fail, 15_000);
    script.onerror = fail;
    script.onload = () => {
      window.clearTimeout(timeout);
      const embed = calendly();
      if (embed) resolve(embed);
      else fail();
    };
    document.head.appendChild(script);
  });
  return widgetPromise;
}

function InlineCalendar({ url }: { url: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const parent = container.current;
    if (!parent) return;
    let active = true;
    let frame: HTMLIFrameElement | null = null;
    let frameTimeout: number | undefined;
    const onLoad = () => {
      if (active) { setLoading(false); setFailed(false); }
      window.clearTimeout(frameTimeout);
    };
    setLoading(true);
    setFailed(false);

    void loadCalendly().then((widget) => {
      if (!active) return;
      const embedUrl = new URL(url);
      embedUrl.searchParams.set("hide_event_type_details", "1");
      embedUrl.searchParams.set("background_color", "141411");
      embedUrl.searchParams.set("text_color", "f2efe6");
      embedUrl.searchParams.set("primary_color", "d3ff02");
      widget.initInlineWidget({ url: embedUrl.toString(), parentElement: parent });
      frame = parent.querySelector("iframe");
      if (!frame) throw new Error("The calendar didn't open.");
      frame.title = "Book your mentorship onboarding with Rob";
      frame.addEventListener("load", onLoad, { once: true });
      frameTimeout = window.setTimeout(() => {
        if (active) { setLoading(false); setFailed(true); }
      }, 20_000);
    }).catch(() => {
      if (active) { setLoading(false); setFailed(true); }
    });

    return () => {
      active = false;
      window.clearTimeout(frameTimeout);
      frame?.removeEventListener("load", onLoad);
      parent.replaceChildren();
    };
  }, [url]);

  return (
    <div className="mt-4">
      <div className="relative -mx-4 overflow-hidden rounded-2xl border border-white/10 bg-[#141411] sm:mx-0">
        {loading && <div role="status" className="absolute inset-x-0 top-5 z-10 flex items-center justify-center gap-2 text-sm text-[#aaa99f]"><Loader2 size={16} className="animate-spin" />Loading Rob's calendar...</div>}
        {failed && <p role="status" className="p-5 text-sm leading-6 text-[#aaa99f]">The calendar is taking a little longer to load. You can use the direct booking link above.</p>}
        <div ref={container} className="h-[720px] w-full" />
      </div>
      <p className="mt-3 text-xs leading-5 text-[#aaa99f]">Choose a date and time, then confirm your booking in the calendar. Tick this step off once you've booked.</p>
    </div>
  );
}

export function BookingCalendar({ url, open, onToggle }: { url: string; open: boolean; onToggle: () => void }) {
  const [hasOpened, setHasOpened] = useState(open);
  useEffect(() => { if (open) setHasOpened(true); }, [open]);
  const isCalendly = (() => {
    try { const parsed = new URL(url); return parsed.protocol === "https:" && parsed.hostname === "calendly.com"; }
    catch { return false; }
  })();

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {isCalendly && <button type="button" aria-expanded={open} aria-controls="onboarding-booking-calendar" onClick={onToggle} className="mp-focus-ring inline-flex items-center gap-2.5 rounded-xl bg-[#D3FF02] px-4 py-3 text-sm font-bold text-black"><CalendarDays size={17} />{open ? "Hide calendar" : "Choose a time with Rob"}<ChevronDown size={15} className={open ? "rotate-180" : ""} /></button>}
        <a href={url} target="_blank" rel="noreferrer" className="mp-focus-ring inline-flex items-center gap-1.5 rounded py-2 text-xs font-semibold text-[#c8c4b9]">{isCalendly ? "Open in a new tab" : "Book my onboarding"}<ExternalLink size={13} /></a>
      </div>
      {isCalendly && <div id="onboarding-booking-calendar" hidden={!open}>{(open || hasOpened) && <InlineCalendar url={url} />}</div>}
    </div>
  );
}
