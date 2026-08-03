import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  Download,
  FileAudio,
  FileArchive,
  Pause,
  Play,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";
import type { FileKind, PortalFile, WeekState } from "../types";
import { cx, formatFileSize } from "../utils";

export function PortalMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-[11px] font-black tracking-[-0.08em] text-white">
        RL
      </div>
      {!compact && (
        <div>
          <div className="text-[12px] font-semibold leading-none tracking-[0.15em] text-white">ROB LATE'S</div>
          <div className="mt-1 text-[11px] leading-none tracking-[0.08em] text-[#aaa99f]">PRODUCER MENTORSHIP</div>
        </div>
      )}
    </div>
  );
}

const stateStyles: Record<WeekState, string> = {
  not_started: "border-white/10 bg-white/[0.04] text-[#88887f]",
  in_progress: "border-white/10 bg-white/[0.05] text-[#b8b7af]",
  ready: "border-[#e4c85a]/30 bg-[#302a12] text-[#f0d56d]",
  submitted: "border-[#9be15d]/30 bg-[#1c2b13] text-[#b8ef87]",
  late: "border-red-400/25 bg-red-950/30 text-red-300",
};

const stateLabels: Record<WeekState, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  ready: "Ready to submit",
  submitted: "Submitted",
  late: "Submitted late",
};

export function StatusPill({ state }: { state: WeekState }) {
  return (
    <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold", stateStyles[state])}>
      {stateLabels[state]}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "mp-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D3FF02] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#b8e000] disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  type = "button",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cx(
        "mp-focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-[#f2efe6] transition hover:border-white/20 hover:bg-white/[0.07]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const percentage = max === 0 ? 100 : Math.min(100, (value / max) * 100);
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
      <div
        className="h-full rounded-full bg-white/70 transition-[width] duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

interface FileDropProps {
  label: string;
  help: string;
  kind: FileKind;
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  compact?: boolean;
}

export function FileDrop({ label, help, kind, accept, multiple, onFiles, compact }: FileDropProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const Icon = kind === "stems" ? FileArchive : FileAudio;

  return (
    <div
      className={cx(
        "group relative rounded-2xl border border-dashed border-white/15 bg-black/15 transition hover:border-white/30 hover:bg-white/[0.025]",
        compact ? "p-4" : "p-6",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length) onFiles(files);
          event.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mp-focus-ring flex w-full items-center gap-4 text-left"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-[#aaa99f] transition group-hover:border-white/20 group-hover:text-white">
          {compact ? <Plus size={19} /> : <UploadCloud size={20} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-[#f2efe6]">{label}</span>
          <span className="mt-0.5 block text-xs text-[#8f8e85]">{help}</span>
        </span>
        {!compact && <Icon className="hidden text-white/15 sm:block" size={24} />}
      </button>
    </div>
  );
}

export function FileRow({
  file,
  onRemove,
  showDownload = false,
}: {
  file: PortalFile;
  onRemove?: () => void;
  showDownload?: boolean;
}) {
  const Icon = file.kind === "stems" ? FileArchive : FileAudio;
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.08] bg-black/20 px-3.5 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-[#aaa99f]">
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-[#e9e6de]">{file.name}</span>
        <span className="block text-[11px] text-[#7f7e76]">{formatFileSize(file.size)}</span>
      </span>
      {showDownload && (
        <a href={file.objectUrl ?? "#"} download={file.name} target={file.objectUrl ? "_blank" : undefined} rel={file.objectUrl ? "noreferrer" : undefined} className="mp-focus-ring rounded-lg p-2 text-[#8f8e85] hover:bg-white/[0.05] hover:text-white" aria-label={`Download ${file.name}`}>
          <Download size={16} />
        </a>
      )}
      {onRemove && (
        <button type="button" onClick={onRemove} className="mp-focus-ring rounded-lg p-2 text-[#77766f] hover:bg-red-500/10 hover:text-red-300" aria-label={`Remove ${file.name}`}>
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}

export function MockAudioPlayer({ file, label }: { file?: PortalFile; label?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(96);
  const bars = [35, 68, 46, 86, 54, 73, 42, 92, 63, 77, 48, 81, 36, 67, 52, 88, 62, 74, 40, 57, 82, 46, 69, 39, 75, 53, 84, 47, 71, 58];

  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
  }, [file?.objectUrl]);

  const formatTime = (seconds: number) => {
    const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const minutes = Math.floor(safe / 60);
    return `${String(minutes).padStart(2, "0")}:${String(Math.floor(safe % 60)).padStart(2, "0")}`;
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) {
      setPlaying((value) => !value);
      return;
    }
    if (audio.paused) {
      await audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const activeBars = file?.objectUrl ? Math.ceil(progress * bars.length) : 12;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d0b] p-4">
      {file?.objectUrl && (
        <audio
          ref={audioRef}
          src={file.objectUrl}
          preload="metadata"
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onEnded={() => { setPlaying(false); setCurrentTime(0); }}
        />
      )}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => void togglePlayback()}
          className="mp-focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-black transition hover:scale-[1.03]"
          aria-label={playing ? "Pause preview" : "Play preview"}
        >
          {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" className="ml-0.5" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <span className="truncate text-sm font-semibold text-[#eeebe3]">{label ?? file?.name ?? "Audio preview"}</span>
            <span className="text-[11px] tabular-nums text-[#77766e]">{formatTime(file?.objectUrl ? currentTime : 42)} / {formatTime(duration)}</span>
          </div>
          <div className="flex h-8 items-center gap-[3px] overflow-hidden">
            {bars.map((height, index) => (
              <span
                key={`${height}-${index}`}
                className={cx("w-[3px] shrink-0 rounded-full", index < activeBars ? "bg-white/65" : "bg-white/15")}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChecklistRow({
  complete,
  title,
  detail,
}: {
  complete: boolean;
  title: string;
  detail?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className={cx("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border", complete ? "border-[#9be15d]/40 bg-[#9be15d]/15 text-[#b8ef87]" : "border-white/15 text-transparent")}>
        <Check size={12} strokeWidth={3} />
      </span>
      <span>
        <span className={cx("block text-sm font-semibold", complete ? "text-[#d6d3ca]" : "text-[#8b8a82]")}>{title}</span>
        {detail && <span className="mt-0.5 block text-xs text-[#77766f]">{detail}</span>}
      </span>
    </div>
  );
}

export function CollapsibleFiles({ files }: { files: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
      <button type="button" onClick={() => setOpen((value) => !value)} className="mp-focus-ring flex w-full items-center justify-between gap-4 bg-white/[0.025] px-4 py-3 text-left">
        <span>
          <span className="block text-sm font-semibold text-[#ddd9d0]">Raw ideas</span>
          <span className="block text-xs text-[#77766f]">{files.length} uploaded. Available for context, not part of the main review.</span>
        </span>
        <ChevronDown size={17} className={cx("shrink-0 text-[#77766f] transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="space-y-2 border-t border-white/[0.08] p-3">
          {files.map((name) => (
            <div key={name} className="flex items-center gap-3 rounded-xl bg-black/20 px-3 py-2.5">
              <FileAudio size={15} className="text-[#77766f]" />
              <span className="min-w-0 flex-1 truncate text-sm text-[#bbb8af]">{name}</span>
              <button type="button" className="mp-focus-ring rounded-lg p-1.5 text-[#77766f] hover:text-white" aria-label={`Download ${name}`}><Download size={15} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
