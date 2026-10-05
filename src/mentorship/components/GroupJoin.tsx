import { QRCodeSVG } from "qrcode.react";
import { ArrowUpRight, QrCode } from "lucide-react";
import { groupInviteUrl } from "../onboarding";

export function GroupJoin({ url }: { url?: string }) {
  const inviteUrl = groupInviteUrl(url);
  const whatsapp = !inviteUrl || /^(chat\.)?whatsapp\.com$/i.test(new URL(inviteUrl).hostname);
  const action = whatsapp ? "Open WhatsApp" : "Open the group";

  return <div className="mt-4 flex flex-wrap items-center gap-4">
    <div className="h-40 w-40 shrink-0 overflow-hidden rounded-xl bg-white">
      {inviteUrl ? <QRCodeSVG value={inviteUrl} size={160} marginSize={4} level="M" fgColor="#111111" bgColor="#ffffff" role="img" title={whatsapp ? "Scan to join the WhatsApp group" : "Scan to join the private group"} />
        : <div className="flex h-full flex-col items-center justify-center gap-1 text-[#343434]" role="img" aria-label="QR code preview. Group invite not added yet."><QrCode size={112} strokeWidth={1.5} aria-hidden="true" /><span className="text-[10px] font-bold uppercase tracking-widest text-[#767676]">QR preview</span></div>}
    </div>
    <div className="min-w-[150px] flex-1">
      <p className="text-sm font-bold text-[#f2efe6]">Scan to join on your phone</p>
      <p className="mt-2 text-xs leading-5 text-[#b7b7ad]">Open your phone's camera and point it at the code. Already on your phone? Use the button below.</p>
      {inviteUrl ? <a href={inviteUrl} target="_blank" rel="noreferrer" className="mp-focus-ring mt-3 inline-flex items-center gap-2 rounded-lg bg-[#D3FF02] px-4 py-3 text-sm font-bold text-black">{action}<ArrowUpRight size={16} aria-hidden="true" /></a>
        : <button type="button" disabled className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-3 text-sm font-bold text-[#aaa99f] disabled:cursor-not-allowed" aria-label="Open WhatsApp, awaiting group invite">{action}<ArrowUpRight size={16} aria-hidden="true" /></button>}
    </div>
  </div>;
}
