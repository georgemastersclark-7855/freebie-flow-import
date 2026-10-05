import { ArrowUpRight, Instagram, Music2 } from "lucide-react";
import type { StudentProfile } from "../types";

export function StudentProfileDetails({ profile }: { profile?: StudentProfile }) {
  if (!profile) return null;
  let musicUrl: string | undefined;
  try {
    const url = new URL(profile.musicUrl ?? "");
    if (url.protocol === "https:" && !url.username && !url.password) musicUrl = url.href;
  } catch { /* No music link. */ }
  const instagram = profile.instagram && /^[a-zA-Z0-9._]{1,30}$/.test(profile.instagram) ? profile.instagram : undefined;
  return <>
    {profile.artistName && <p className="mt-2 break-words text-base font-semibold text-[#d4d0c5]">{profile.artistName}</p>}
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#b7b7ad]">
      {profile.daw && <span className="break-words">DAW: {profile.daw}</span>}
      {instagram && <a href={`https://www.instagram.com/${instagram}/`} target="_blank" rel="noopener noreferrer" className="mp-focus-ring inline-flex items-center gap-1.5 rounded py-1 font-semibold hover:text-white"><Instagram size={14} aria-hidden="true" />@{instagram}<ArrowUpRight size={12} aria-hidden="true" /></a>}
      {musicUrl && <a href={musicUrl} target="_blank" rel="noopener noreferrer" className="mp-focus-ring inline-flex items-center gap-1.5 rounded py-1 font-semibold hover:text-white"><Music2 size={14} aria-hidden="true" />Listen to music<ArrowUpRight size={12} aria-hidden="true" /></a>}
    </div>
  </>;
}
