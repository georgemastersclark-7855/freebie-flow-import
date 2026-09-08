import { useEffect, useState } from "react";
import { Play } from "lucide-react";

interface PortalVideoProps {
  src?: string;
  poster?: string;
  title: string;
  description?: string;
}

export function PortalVideo({ src, poster, title, description = "Watch the lesson, then work through the steps and downloads below." }: PortalVideoProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0b]">
      {src && !failed ? (
        <video aria-label={title} src={src} poster={poster} controls playsInline preload="metadata" onError={() => setFailed(true)} className="block aspect-video w-full bg-black object-contain">Your browser cannot play this video.</video>
      ) : (
        <div className="relative grid aspect-video w-full place-items-center overflow-hidden bg-[#1b1b17]">
          {poster && <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/15" />
          <button type="button" disabled aria-label={`Play ${title}`} className="relative grid h-16 w-16 place-items-center rounded-full border border-white/20 bg-white text-black shadow-xl sm:h-20 sm:w-20"><Play className="ml-1" size={27} fill="currentColor" /></button>
          {failed && <p className="absolute inset-x-4 bottom-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-white/85">Video unavailable</p>}
        </div>
      )}
      <div className="border-t border-white/[0.08] px-4 py-3"><p className="text-xs font-bold text-[#e9e5dc]">{title}</p><p role={failed ? "status" : undefined} className="mt-1 text-xs leading-5 text-[#aaa99f]">{failed ? "This video couldn't load. Refresh the page to try again. Your lesson notes and downloads are still available." : description}</p></div>
    </div>
  );
}
