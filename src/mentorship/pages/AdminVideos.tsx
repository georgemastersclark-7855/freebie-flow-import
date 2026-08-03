import { Check, Eye, EyeOff, Film, UploadCloud } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  loadLiveAdminVideoResources,
  setLiveAdminVideoPublished,
  uploadLiveAdminVideo,
  type AdminVideoResource,
} from "../liveAdminApi";
import { demoSetupVideos } from "../demoData";
import { usePortalStore } from "../PortalStore";

const demoResources: AdminVideoResource[] = [
  {
    id: "welcome",
    cohortId: "demo-cohort",
    key: "welcome",
    kind: "welcome_video",
    title: "Welcome to the mentorship",
    description: "Rob explains how the six weeks work and what to do first.",
    duration: "",
    position: 0,
    published: false,
  },
  ...demoSetupVideos.map((video, index) => ({
    id: video.id,
    cohortId: "demo-cohort",
    key: video.id,
    kind: "setup_video" as const,
    title: video.title,
    description: video.description,
    duration: video.duration,
    position: index + 1,
    published: false,
  })),
];

export function AdminVideos() {
  const { backend } = usePortalStore();
  const [resources, setResources] = useState<AdminVideoResource[]>(backend === "demo" ? demoResources : []);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string>();
  const [progress, setProgress] = useState(0);

  const refresh = useCallback(async () => {
    if (backend === "demo") return;
    setResources(await loadLiveAdminVideoResources());
  }, [backend]);

  useEffect(() => {
    refresh().catch((error) => toast.error(error instanceof Error ? error.message : "Unable to load videos."))
      .finally(() => setLoading(false));
  }, [refresh]);

  const upload = async (resource: AdminVideoResource, file?: File) => {
    if (!file) return;
    setUploadingId(resource.id);
    setProgress(0);
    try {
      if (backend === "demo") {
        setResources((current) => current.map((item) => item.id === resource.id ? { ...item, storagePath: file.name, published: true } : item));
        toast.success(`${resource.title} is ready in the preview.`);
        return;
      }
      await uploadLiveAdminVideo(resource, file, setProgress);
      await refresh();
      toast.success(`${resource.title} is live.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The video could not be uploaded.");
    } finally {
      setUploadingId(undefined);
      setProgress(0);
    }
  };

  const togglePublished = async (resource: AdminVideoResource) => {
    try {
      if (backend === "demo") {
        setResources((current) => current.map((item) => item.id === resource.id ? { ...item, published: !item.published } : item));
        return;
      }
      await setLiveAdminVideoPublished(resource.id, !resource.published);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The video could not be updated.");
    }
  };

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-7 lg:px-10 lg:py-12">
      <div className="max-w-2xl">
        <div className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#77766f]">Start Here content</div>
        <h1 className="mp-display mt-2 text-[46px] leading-none text-[#f1eee6] sm:text-[58px]">SETUP VIDEOS</h1>
        <p className="mt-4 text-sm leading-6 text-[#8f8e85]">Upload the videos students watch before the first call. Use high-quality 4K MP4 files.</p>
      </div>

      <div className="mt-8 space-y-3">
        {loading && <div className="mp-card rounded-2xl p-6 text-sm text-[#77766f]">Loading videos…</div>}
        {!loading && resources.map((resource) => {
          const uploaded = Boolean(resource.storagePath || resource.videoUrl);
          const busy = uploadingId === resource.id;
          return (
            <div key={resource.id} className="mp-card grid gap-5 rounded-2xl p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div className="flex min-w-0 items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.035] text-[#aaa99f]"><Film size={19} /></span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-black text-[#ece9e0]">{resource.title}</h2>
                    {uploaded && <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] px-2 py-1 text-[10px] font-bold text-[#aaa99f]"><Check size={11} />Uploaded</span>}
                    {resource.published && <span className="rounded-full border border-[#9be15d]/25 bg-[#9be15d]/10 px-2 py-1 text-[10px] font-bold text-[#b8ef87]">Visible to students</span>}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#77766f]">{resource.description}</p>
                  {busy && <div className="mt-3 max-w-md"><div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full bg-white/75 transition-all" style={{ width: `${progress}%` }} /></div><div className="mt-1.5 text-[10px] font-bold text-[#8f8e85]">Uploading {progress}%</div></div>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                {uploaded && <button type="button" onClick={() => void togglePublished(resource)} disabled={busy} className="mp-focus-ring inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-semibold text-[#d9d6cd] disabled:opacity-45">{resource.published ? <EyeOff size={15} /> : <Eye size={15} />}{resource.published ? "Hide" : "Show"}</button>}
                <label className="mp-focus-ring inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-[#11110f] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45">
                  <UploadCloud size={15} />{busy ? "Uploading…" : uploaded ? "Replace" : "Upload video"}
                  <input type="file" accept="video/mp4,.mp4" disabled={Boolean(uploadingId)} className="sr-only" onChange={(event) => void upload(resource, event.target.files?.[0])} />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
