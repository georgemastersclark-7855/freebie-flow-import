import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Download, FileText, Package, Play } from "lucide-react";
import { usePortalStore } from "../PortalStore";
import { completeSetupOutline } from "../onboarding";
import { PortalVideo } from "../components/PortalVideo";
import { setupLessons, setupLessonPath } from "../setupLessons";
import { cx } from "../utils";

export function SetupLesson() {
  const { lessonKey } = useParams();
  const { setupVideos } = usePortalStore();
  const videos = completeSetupOutline(setupVideos);
  const index = setupLessons.findIndex((item) => item.key === lessonKey);
  const lesson = setupLessons[index];
  const video = videos.find((item) => (item.key ?? item.id) === lessonKey);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [lessonKey]);

  if (!lesson || !video) return <div className="mx-auto max-w-3xl p-8"><h1 className="mp-display">Lesson not found</h1><Link to="/mentorship-portal/welcome#setup-videos" className="mp-focus-ring mt-6 inline-flex items-center gap-2 rounded text-sm text-[#f2efe6]"><ArrowLeft size={16} />Back to your setup</Link></div>;
  const previous = setupLessons[index - 1];
  const next = setupLessons[index + 1];
  const worksheetUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(lesson.worksheet.text)}`;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 xl:px-12">
      <Link to="/mentorship-portal/welcome#setup-videos" className="mp-focus-ring inline-flex items-center gap-2 rounded text-xs font-semibold text-[#b6b3a8]"><ArrowLeft size={14} />Back to your setup</Link>
      <header className="mb-7 mt-7 max-w-4xl"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#f2efe6]">Your setup / Lesson {index + 1} of {setupLessons.length}</p><h1 className="mp-display mp-lesson-title mt-3 text-[#f2efe6]">{video.title}</h1><p className="mt-4 max-w-3xl text-sm leading-6 text-[#b6b3a8]">{lesson.intro}</p></header>

      <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 space-y-6">
          <PortalVideo key={lesson.key} src={video.url} title={video.title} />
          <section className="mp-card rounded-2xl p-5 sm:p-7"><h2 className="text-xl font-bold text-[#eeeae1]">Put this into practice</h2><div className="mt-5 space-y-6">{lesson.notes.map((note) => <div key={note.title}><h3 className="text-sm font-bold text-[#e9e5dc]">{note.title}</h3><p className="mt-2 text-sm leading-7 text-[#aaa99f]">{note.text}</p></div>)}</div></section>
          <section className="mp-card rounded-2xl p-5 sm:p-7"><h2 className="text-xl font-bold text-[#eeeae1]">Before you move on</h2><ol className="mt-5 space-y-4">{lesson.actions.map((action, actionIndex) => <li key={action} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 text-xs font-semibold text-[#b6b3a8]">{actionIndex + 1}</span><p className="pt-0.5 text-sm leading-6 text-[#b6b3a8]">{action}</p></li>)}</ol><p className="mt-6 flex gap-2.5 rounded-xl bg-white/5 p-4 text-sm leading-6 text-[#d4d0c5]"><Check size={17} className="mt-1 shrink-0 text-[#f2efe6]" />{lesson.outcome}</p></section>
          <section className="mp-card rounded-2xl p-5 sm:p-7"><h2 className="text-xl font-bold text-[#eeeae1]">Your downloads</h2><div className="mt-5 space-y-3"><div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 p-4"><FileText size={23} className="shrink-0 text-[#f2efe6]" /><div className="min-w-0 flex-1 basis-48"><h3 className="text-sm font-bold text-[#e9e5dc]">{lesson.worksheet.title}</h3><p className="mt-1 text-xs leading-5 text-[#aaa99f]">{lesson.worksheet.description}</p></div><a href={worksheetUrl} download={lesson.worksheet.filename} className="mp-focus-ring inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-xs font-bold text-[#f2efe6]"><Download size={14} />Download worksheet</a></div>
            {lesson.key === "sound-library" && <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/15 bg-white/[0.025] p-4"><Package size={23} className="shrink-0 text-[#f2efe6]" /><div className="min-w-0 flex-1 basis-48"><h3 className="text-sm font-bold text-[#e9e5dc]">The Master Bundle</h3><p className="mt-1 text-xs leading-5 text-[#aaa99f]">Your included sound library. Pick a few favourites and try them in a song starter.</p>{!video.downloadUrl && <p className="mt-2 text-xs leading-5 text-[#b6b3a8]">Your download link will appear here once your access is ready. You can start with sounds you already have.</p>}</div>{video.downloadUrl && <a href={video.downloadUrl} target="_blank" rel="noreferrer" className="mp-focus-ring inline-flex items-center gap-2 rounded-lg bg-[#D3FF02] px-3 py-2.5 text-xs font-bold text-black"><Download size={14} />Get the Master Bundle</a>}</div>}
          </div></section>
          <nav aria-label="Lesson navigation" className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">{previous ? <Link to={setupLessonPath(previous.key)} className="mp-focus-ring inline-flex items-center gap-2 rounded py-2 text-xs font-semibold text-[#b6b3a8]"><ArrowLeft size={14} />Previous lesson</Link> : <span />}{next ? <Link to={setupLessonPath(next.key)} className="mp-focus-ring inline-flex items-center gap-2 rounded-xl bg-[#D3FF02] px-4 py-3 text-sm font-bold text-black">Next lesson<ArrowRight size={15} /></Link> : <Link to="/mentorship-portal/welcome#setup-videos" className="mp-focus-ring inline-flex items-center gap-2 rounded-xl bg-[#D3FF02] px-4 py-3 text-sm font-bold text-black">Back to my setup<ArrowRight size={15} /></Link>}</nav>
        </div>
        <aside className="mp-card rounded-2xl p-5 xl:sticky xl:top-6"><h2 className="text-sm font-bold text-[#eeeae1]">Your setup lessons</h2><nav aria-label="Setup lessons" className="mt-4 space-y-2">{setupLessons.map((item, itemIndex) => <Link key={item.key} to={setupLessonPath(item.key)} aria-current={item.key === lesson.key ? "page" : undefined} className={cx("mp-focus-ring flex items-start gap-3 rounded-xl border px-3 py-3 text-xs leading-5", item.key === lesson.key ? "border-white/20 bg-white/5 text-[#f2efe6]" : "border-white/[0.06] text-[#aaa99f] hover:bg-white/[0.035]")}><span className="shrink-0 text-[#f2efe6]">{String(itemIndex + 1).padStart(2, "0")}</span><span className="flex-1">{videos.find((entry) => (entry.key ?? entry.id) === item.key)?.title}</span>{item.key === lesson.key && <Play size={12} className="mt-1 shrink-0" />}</Link>)}</nav><p className="mt-5 text-xs leading-5 text-[#aaa99f]">Work through the lessons, put your setup together, then tick the setup step off on your welcome page.</p></aside>
      </div>
    </div>
  );
}
