import { Download, Package } from "lucide-react";
import { usePortalStore } from "../PortalStore";

export function MasterBundleCard() {
  const { setupVideos } = usePortalStore();
  const downloadUrl = setupVideos.find((video) => (video.key ?? video.id) === "sound-library")?.downloadUrl;
  return <section id="master-bundle" aria-label="Your included Master Bundle" className="scroll-mt-24 rounded-2xl border border-white/20 bg-white/[0.04] p-5 sm:p-6">
    <div className="flex flex-wrap items-start gap-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/[0.06]"><Package size={24} /></span>
      <div className="min-w-0 flex-1 basis-56">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#c5c2b9]">Included with your mentorship</p>
        <h2 className="mt-1 text-xl font-bold">The Master Bundle</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#b6b3a8]">You get my Master Bundle at no extra cost. Add it to your sound library, pick out your favourites and use them in your song starters.</p>
      </div>
      <div className="flex flex-col gap-2 sm:self-center">
        {downloadUrl ? <a href={downloadUrl} target="_blank" rel="noreferrer" className="mp-focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-[#D3FF02] px-4 py-3 text-sm font-bold text-black"><Download size={16} />Download Master Bundle</a>
          : <><button type="button" disabled className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-[#aaa99f]"><Download size={16} />Download Master Bundle</button><span className="text-xs text-[#aaa99f]">Download file not added yet.</span></>}
      </div>
    </div>
  </section>;
}
