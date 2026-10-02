import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { setupLessonPath, setupLessonThumbnails } from "../setupLessons";
import type { SetupVideo } from "../types";

export function SetupVideoCard({ video, index }: { video: SetupVideo; index: number }) {
  const thumbnail = setupLessonThumbnails[video.key ?? video.id];
  return (
    <Link to={setupLessonPath(video.key ?? video.id)} aria-label={`Open lesson: ${video.title}`} className="mp-focus-ring block overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20 transition hover:border-white/20">
        <div className="relative flex aspect-video flex-col items-center justify-center gap-3 overflow-hidden bg-[#1b1b17] px-5 text-center">
          {thumbnail && <img src={thumbnail} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          <span className="relative grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-black/45 text-white shadow-lg backdrop-blur-sm"><Play size={20} className="ml-0.5" fill="currentColor" /></span>
          <p className="relative text-xs font-semibold leading-5 text-white">Watch lesson</p>
        </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.12em] text-[#939187]"><span>Setup {index + 1}</span>{video.url && video.duration && <span>{video.duration}</span>}</div>
        <h4 className="mt-2 text-sm font-bold text-[#eeeae1]">{video.title}</h4>
        <p className="mt-2 text-xs leading-5 text-[#aaa99f]">{video.description}</p>
      </div>
    </Link>
  );
}
