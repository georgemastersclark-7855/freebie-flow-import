import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Camera, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { usePortalStore } from "../PortalStore";
import { cropProfilePhoto, photoCrop, readProfilePhoto, type ProfilePhoto } from "../profilePhoto";
import { StudentAvatar } from "./StudentAvatar";
import { PrimaryButton, SecondaryButton } from "./PortalUI";

const inputClass = "mp-focus-ring mt-2 h-11 w-full rounded-xl border border-white/20 bg-black/20 px-3 text-sm text-[#f2efe6] placeholder:text-[#828278] disabled:opacity-50";
const clamp = (value: number) => Math.min(100, Math.max(0, value));

export function ProfileDialog({ required, onClose }: { required: boolean; onClose: () => void }) {
  const { user, staffUser, saveProfile, logout } = usePortalStore();
  const navigate = useNavigate();
  const profile = user?.profile;
  const [displayName, setDisplayName] = useState(profile?.displayName ?? user?.name ?? "");
  const [artistName, setArtistName] = useState(profile?.artistName ?? "");
  const [instagram, setInstagram] = useState(profile?.instagram ?? "");
  const [musicUrl, setMusicUrl] = useState(profile?.musicUrl ?? "");
  const [daw, setDaw] = useState(profile?.daw ?? "");
  const [photo, setPhoto] = useState<ProfilePhoto>();
  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const selection = useRef(0);
  const drag = useRef<{ x: number; y: number; left: number; top: number }>();
  useEffect(() => () => { selection.current += 1; }, []);
  useEffect(() => () => { if (photo) { URL.revokeObjectURL(photo.previewUrl); photo.bitmap.close(); } }, [photo]);

  const choosePhoto = async (file?: File) => {
    if (!file) return;
    const version = ++selection.current;
    setLoadingPhoto(true);
    setError("");
    try {
      const next = await readProfilePhoto(file);
      if (version !== selection.current) { next.bitmap.close(); URL.revokeObjectURL(next.previewUrl); return; }
      setPhoto(next); setZoom(1); setX(50); setY(50);
    } catch (reason) { if (version === selection.current) setError(reason instanceof Error ? reason.message : "Unable to open photo."); }
    finally { if (version === selection.current) setLoadingPhoto(false); }
  };
  const crop = photo ? photoCrop(photo, zoom, x, y) : undefined;
  const movePhoto = (event: PointerEvent<HTMLDivElement>) => {
    if (saving || !drag.current || !photo || !crop) return;
    const ratio = crop.side / event.currentTarget.getBoundingClientRect().width;
    const rangeX = photo.bitmap.width - crop.side;
    const rangeY = photo.bitmap.height - crop.side;
    setX(rangeX > 0 ? clamp(drag.current.left - (event.clientX - drag.current.x) * ratio / rangeX * 100) : 50);
    setY(rangeY > 0 ? clamp(drag.current.top - (event.clientY - drag.current.y) * ratio / rangeY * 100) : 50);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!displayName.trim()) { setError("Enter your display name."); return; }
    if (!photo && !profile?.photoPath) { setError("Add a profile photo to continue."); fileInput.current?.focus(); return; }
    setError(""); setSaving(true);
    try {
      const image = photo ? await cropProfilePhoto(photo, zoom, x, y) : undefined;
      await saveProfile({ displayName, artistName, instagram, musicUrl, daw }, image);
      toast.success(required ? "Account setup complete." : "Profile updated.");
      onClose();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Your profile couldn't be saved. Please try again."); }
    finally { setSaving(false); }
  };

  const leave = async () => {
    if (staffUser) { navigate("/mentorship-portal"); return; }
    try { await logout(); navigate("/mentorship-portal"); }
    catch { setError("Unable to sign out. Please try again."); }
  };

  return <Dialog.Root open onOpenChange={(open) => { if (!open && !required && !saving) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm" />
      <Dialog.Content className="mentorship-portal mp-profile-dialog fixed left-1/2 top-1/2 z-[90] max-h-[92dvh] w-[calc(100%-24px)] max-w-[620px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-white/20 bg-[#151512] p-5 shadow-2xl outline-none sm:p-7" onEscapeKeyDown={(event) => { if (required || saving) event.preventDefault(); }} onInteractOutside={(event) => { if (required || saving) event.preventDefault(); }}>
        <div className="flex items-start justify-between gap-4">
          <div><Dialog.Title className="text-2xl font-bold text-[#f2efe6]">{required ? "Set up your account" : "Edit profile"}</Dialog.Title><Dialog.Description className="mt-2 text-sm leading-6 text-[#b7b7ad]">{required ? "Add your photo and profile details to continue." : "Update your photo and profile details."}</Dialog.Description></div>
          {!required && <Dialog.Close disabled={saving} className="mp-focus-ring rounded-lg p-2 text-[#b7b7ad] hover:text-white" aria-label="Close edit profile"><X size={19} /></Dialog.Close>}
        </div>
        <form onSubmit={(event) => void submit(event)} className="mt-6">
          <fieldset disabled={saving} className="min-w-0 space-y-5">
            <legend className="sr-only">Profile details</legend>
            <div>
              <p className="text-sm font-semibold text-[#eeeae1]">Profile photo <span className="ml-1 text-xs font-normal text-[#aaa99f]">Required</span></p>
              <div className="mt-3 flex flex-wrap items-center gap-5">
                {photo && crop ? <div role="group" tabIndex={0} aria-label="Photo crop. Drag to reposition, or use the arrow keys." className="mp-focus-ring relative h-28 w-28 shrink-0 touch-none overflow-hidden rounded-full border border-white/30 bg-black sm:h-32 sm:w-32" onPointerDown={(event) => { if (saving) return; event.currentTarget.setPointerCapture(event.pointerId); drag.current = { x: event.clientX, y: event.clientY, left: x, top: y }; }} onPointerMove={movePhoto} onPointerUp={() => { drag.current = undefined; }} onPointerCancel={() => { drag.current = undefined; }} onKeyDown={(event) => { if (saving) return; if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) event.preventDefault(); if (event.key === "ArrowLeft") setX(clamp(x - 5)); if (event.key === "ArrowRight") setX(clamp(x + 5)); if (event.key === "ArrowUp") setY(clamp(y - 5)); if (event.key === "ArrowDown") setY(clamp(y + 5)); }}>
                  <img src={photo.previewUrl} alt="Profile photo preview" draggable={false} className="pointer-events-none absolute left-0 top-0 max-w-none select-none" style={{ width: `${photo.bitmap.width / crop.side * 100}%`, height: `${photo.bitmap.height / crop.side * 100}%`, transform: `translate(${-crop.left / photo.bitmap.width * 100}%, ${-crop.top / photo.bitmap.height * 100}%)` }} />
                </div> : <StudentAvatar name={displayName || "You"} src={profile?.photoUrl} size={112} member={Boolean(profile?.completedAt)} />}
                <div className="min-w-[160px] flex-1">
                  <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" tabIndex={-1} aria-label="Choose profile photo" onChange={(event) => { void choosePhoto(event.target.files?.[0]); event.target.value = ""; }} />
                  <SecondaryButton onClick={() => fileInput.current?.click()} disabled={loadingPhoto || saving}>{loadingPhoto ? <LoaderCircle size={16} className="animate-spin" /> : <Camera size={16} />}{photo || profile?.photoPath ? "Change photo" : "Upload photo"}</SecondaryButton>
                  <p className="mt-2 text-xs leading-5 text-[#aaa99f]">JPG, PNG or WebP. Maximum 10 MB.</p>
                  {photo && <><p className="mt-2 text-xs text-[#d4d0c5]">Drag your photo to reposition it.</p><label className="mt-3 flex items-center gap-3 text-xs text-[#b7b7ad]">Zoom<input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="mp-focus-ring min-w-0 flex-1 accent-white" /><span className="w-8 tabular-nums">{zoom.toFixed(1)}×</span></label></>}
                </div>
              </div>
            </div>
            <label className="block text-sm font-semibold text-[#eeeae1]">Display name <span className="ml-1 text-xs font-normal text-[#aaa99f]">Required</span><input required autoComplete="nickname" maxLength={80} value={displayName} onChange={(event) => setDisplayName(event.target.value)} className={inputClass} /><span className="mt-1.5 block text-xs font-normal text-[#aaa99f]">The name shown with your submissions.</span></label>
            <div className="border-t border-white/10 pt-5">
              <p className="mb-4 text-xs font-semibold text-[#aaa99f]">Optional details</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-[#eeeae1]">Artist / producer name<input maxLength={80} autoComplete="off" value={artistName} onChange={(event) => setArtistName(event.target.value)} className={inputClass} /></label>
                <label className="block text-sm font-semibold text-[#eeeae1]">DAW<input maxLength={80} placeholder="e.g. Ableton Live" value={daw} onChange={(event) => setDaw(event.target.value)} className={inputClass} /></label>
                <label className="block text-sm font-semibold text-[#eeeae1]">Instagram<input maxLength={31} placeholder="@username" autoCapitalize="none" spellCheck={false} value={instagram} onChange={(event) => setInstagram(event.target.value)} className={inputClass} /></label>
                <label className="block text-sm font-semibold text-[#eeeae1]">Music link<input type="url" maxLength={2048} placeholder="https://" autoCapitalize="none" spellCheck={false} value={musicUrl} onChange={(event) => setMusicUrl(event.target.value)} className={inputClass} /></label>
              </div>
            </div>
          </fieldset>
          {error && <p role="alert" className="mt-5 rounded-xl border border-red-300/20 bg-red-400/5 p-3 text-sm leading-5 text-red-200">{error}</p>}
          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-xs leading-5 text-[#aaa99f]">Your profile is visible to you and mentorship staff. You can edit it later.</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              {required ? <button type="button" onClick={() => void leave()} disabled={saving} className="mp-focus-ring rounded-lg px-1 py-2 text-sm font-semibold text-[#b7b7ad]">{staffUser ? "Back to view selection" : "Sign out"}</button> : <SecondaryButton onClick={onClose} disabled={saving}>Cancel</SecondaryButton>}
              <PrimaryButton type="submit" disabled={saving || loadingPhoto}>{saving && <LoaderCircle size={16} className="animate-spin" />}{saving ? "Saving..." : required ? "Save and continue" : "Save changes"}</PrimaryButton>
            </div>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
