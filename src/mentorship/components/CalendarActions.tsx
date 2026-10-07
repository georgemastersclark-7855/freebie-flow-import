import * as Popover from "@radix-ui/react-popover";
import { CalendarPlus, Download, ExternalLink } from "lucide-react";
import { calendarFile, googleCalendarUrl, type CalendarEvent } from "../schedule";

export function CalendarActions({ event, prominent = false }: { event: CalendarEvent; prominent?: boolean }) {
  const download = () => {
    const url = URL.createObjectURL(new Blob([calendarFile(event)], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `${event.id.replace(/[^a-zA-Z0-9-]/g, "-")}.ics`;
    document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
  };
  return <Popover.Root>
    <Popover.Trigger asChild><button type="button" className={`mp-focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold ${prominent ? "bg-[#D3FF02] text-black" : "border border-white/20 text-[#f2efe6] hover:bg-white/10"}`}><CalendarPlus size={15} />Add to calendar</button></Popover.Trigger>
    <Popover.Portal><Popover.Content aria-label="Add event to your calendar" sideOffset={8} align="start" className="mentorship-portal mp-calendar-menu z-[80] w-72 rounded-xl border border-white/20 p-2 shadow-2xl">
      <a href={googleCalendarUrl(event)} target="_blank" rel="noreferrer" className="mp-focus-ring flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold hover:bg-white/10">Google Calendar<ExternalLink size={15} /></a>
      <Popover.Close asChild><button type="button" onClick={download} className="mp-focus-ring flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-semibold hover:bg-white/10">Apple / Outlook (.ics)<Download size={15} /></button></Popover.Close>
      <p className="border-t border-white/10 px-3 pb-2 pt-3 text-[11px] leading-5 text-[#aaa99f]">Saves this event to your calendar. Check the portal for any schedule changes.</p>
    </Popover.Content></Popover.Portal>
  </Popover.Root>;
}
