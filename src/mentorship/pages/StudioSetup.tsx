import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePortalStore } from "../PortalStore";
import { completeSetupOutline } from "../onboarding";
import { SetupVideoCard } from "../components/SetupVideoCard";

export function StudioSetup() {
  const { setupVideos, onboardingTasks, toggleOnboardingTask } = usePortalStore();
  const videos = completeSetupOutline(setupVideos);
  const task = onboardingTasks.find((item) => (item.key ?? item.id) === "prework");
  const [saving, setSaving] = useState(false);
  const toggle = async () => {
    if (!task || saving) return;
    setSaving(true);
    try { await toggleOnboardingTask(task.id); }
    catch { toast.error("Your progress couldn't save. Please try again."); }
    finally { setSaving(false); }
  };
  return <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
    <header className="max-w-3xl">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#b6b3a8]">Before your first session</p>
      <h1 className="mp-display mt-3">STUDIO SETUP</h1>
      <p className="mt-5 text-base leading-7 text-[#d4d0c5]">Prepare your sounds, session template, references and stems.</p>
      <p className="mt-3 text-sm leading-7 text-[#aaa99f]">Before our first session, I want everyone working from the same starting point. These four lessons cover the setup I want you to use throughout the mentorship.</p>
      <p className="mt-3 text-sm leading-7 text-[#aaa99f]">Have sounds you can find quickly, a template you can write in straight away, reference tracks to compare against, and stems I can open in a live session. This is part of learning how to prepare for work with other producers and artists. Get it done now so we can spend our sessions making music.</p>
      <p className="mt-4 text-sm font-bold">Rob x</p>
    </header>
    <section id="setup-videos" className="mt-8 scroll-mt-24" aria-label="Studio Setup lessons">
      <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Your four setup lessons</h2><span className="text-xs text-[#aaa99f]">Work through in order</span></div>
      <div className="grid gap-4 sm:grid-cols-2">{videos.map((video, index) => <SetupVideoCard key={video.id} video={video} index={index} />)}</div>
    </section>
    <section className="mp-card mt-6 flex flex-wrap items-center justify-between gap-5 rounded-2xl p-5 sm:p-6">
      <div className="max-w-xl"><h2 className="text-lg font-bold">Ready for your first session?</h2><p className="mt-2 text-sm leading-6 text-[#aaa99f]">Once you've watched the lessons and put everything into practice, tick off Studio Setup. Your progress is saved on your Dashboard too.</p>
        {task && <label className="mt-4 inline-flex items-center gap-3 text-sm font-semibold">{saving ? <Loader2 size={16} className="animate-spin" /> : <input type="checkbox" checked={task.complete} disabled={saving || (!task.complete && videos.some((video) => !video.url))} onChange={() => void toggle()} className="mp-focus-ring h-4 w-4 accent-white" />} {task.complete ? <><Check size={15} />Studio Setup complete</> : "I've completed Studio Setup"}</label>}
      </div>
      <Link to="/mentorship-portal/dashboard" className="mp-focus-ring inline-flex items-center gap-2 rounded-xl bg-[#D3FF02] px-5 py-3 text-sm font-bold text-black">Back to Dashboard<ArrowRight size={16} /></Link>
    </section>
  </div>;
}
