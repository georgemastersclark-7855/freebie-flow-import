import { Download, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { usePortalStore } from "../PortalStore";
import masterBundleImage from "../assets/master-bundle.webp";

function BundleDownload() {
  const { setupVideos } = usePortalStore();
  const downloadUrl = setupVideos.find((video) => (video.key ?? video.id) === "sound-library")?.downloadUrl;
  return <div className="flex flex-col gap-2">
    {downloadUrl ? <a href={downloadUrl} target="_blank" rel="noreferrer" className="mp-focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-[#D3FF02] px-4 py-3 text-sm font-bold text-black"><Download size={16} />Download Master Bundle</a>
      : <><button type="button" disabled className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-[#aaa99f]"><Download size={16} />Download Master Bundle</button><span className="text-xs text-[#aaa99f]">Download file not added yet.</span></>}
  </div>;
}

export function MasterBundleCard() {
  return <section id="master-bundle" aria-label="Your included Master Bundle" className="scroll-mt-24 rounded-2xl border border-white/20 bg-white/[0.04] p-5 sm:p-6">
    <div className="flex flex-wrap items-center gap-5">
      <img src={masterBundleImage} alt="Rob Late's Master Bundle sound collection" width={120} height={120} className="h-28 w-28 shrink-0 rounded-xl border border-white/10 object-contain" loading="lazy" />
      <div className="min-w-0 flex-1 basis-56">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#c5c2b9]">Included with your mentorship</p>
        <h2 className="mt-1 text-xl font-bold">The Master Bundle</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#b6b3a8]">I've included my Master Bundle so you've got a reliable set of drums, samples and presets to build your sound library from. I want everyone starting with sounds that are up to the standard we'll be working at.</p>
      </div>
      <BundleDownload />
    </div>
  </section>;
}

export function MasterBundleDialog({ open, onOpenChange, onReturnFocus }: { open: boolean; onOpenChange: (open: boolean) => void; onReturnFocus: () => void }) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
    <Dialog.Content onCloseAutoFocus={(event) => { event.preventDefault(); onReturnFocus(); }} className="mentorship-portal mp-bundle-dialog fixed left-1/2 top-1/2 z-[81] max-h-[90dvh] w-[calc(100%-32px)] max-w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/20 p-6 shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none sm:p-8">
      <Dialog.Close aria-label="Close Master Bundle" className="mp-focus-ring absolute right-4 top-4 rounded-lg p-2 text-[#c5c2b9] hover:bg-white/10"><X size={20} /></Dialog.Close>
      <p className="pr-8 text-[10px] font-bold uppercase tracking-[0.14em] text-[#b6b3a8]">Included with your mentorship</p>
      <Dialog.Title className="mt-2 text-2xl font-bold">The Master Bundle</Dialog.Title>
      <div className="mt-6 grid items-start gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <img src={masterBundleImage} alt="The Master Bundle: Rob Late's collection of drums, samples and presets" width={1200} height={1200} className="mx-auto aspect-square w-full max-w-[300px] rounded-xl border border-white/10 object-contain" />
        <div><Dialog.Description className="text-sm leading-7 text-[#c5c2b9]">I've included my Master Bundle so you've got a reliable set of drums, samples and presets to build your sound library from. I want everyone starting with sounds that are up to the standard we'll be working at.</Dialog.Description>
          <p className="mt-3 text-sm leading-7 text-[#c5c2b9]">Pick the sounds that suit your music and add them to your library as you work through Studio Setup.</p>
          <div className="mt-6"><BundleDownload /></div>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}
