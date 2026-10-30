import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, AudioLines, Check, Disc3, Layers, MessageCircle, Repeat, Users, Video, X } from "lucide-react";

/* Mentorship cohort 2 as a conventional landing page (mock-up for Rob).
   Same offer and same copy as MentorshipRobVersion.tsx, laid out like the Producer Blueprint sales pages.
   No tracking, no checkout, no Vidalytics. */

const robSignature = "/assets/mentorship-rob/web/rob-signature.webp";
const webAsset = (name: string) => `/assets/mentorship-rob/web/${name}`;

/* Seat counter: SEATS_TOTAL = cohort size, SEATS_LEFT = seats remaining (shown with the total struck through). */
const SEATS_TOTAL = 12;
const SEATS_LEFT = 11;

const CARD = "bg-gradient-to-b from-zinc-900 via-[#0A0A0A] to-black border border-zinc-800 rounded-2xl";
const GLOW_SHADOW = "shadow-[0_0_60px_rgba(255,255,255,0.06)]";
const SOFT_GLOW = "radial-gradient(ellipse at center, rgba(255,255,255,0.10) 0%, rgba(200,200,200,0.05) 45%, transparent 75%)";

/* ---------- Small shared pieces ---------- */

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <span className="inline-block py-1.5 px-4 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-[11px] font-bold uppercase tracking-widest">
    {children}
  </span>
);

const LimeEyebrow = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D3FF02]/10 border border-[#D3FF02]/20">
    <span className="w-1.5 h-1.5 rounded-full bg-[#D3FF02]" />
    <span className="text-[#D3FF02] text-[11px] font-bold uppercase tracking-widest">{children}</span>
  </span>
);

const Serif = ({ children }: { children: ReactNode }) => (
  <span className="font-serif italic font-normal tracking-normal text-zinc-200">{children}</span>
);

const SectionHeader = ({
  eyebrow,
  children,
  sub,
  lime = false,
  className = "mb-10 md:mb-16",
}: {
  eyebrow: string;
  children?: ReactNode;
  sub?: ReactNode;
  lime?: boolean;
  className?: string;
}) => (
  <div className={`text-center max-w-4xl mx-auto ${className}`}>
    <div className={children ? "mb-4" : ""}>{lime ? <LimeEyebrow>{eyebrow}</LimeEyebrow> : <Eyebrow>{eyebrow}</Eyebrow>}</div>
    {children && (
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tighter leading-[1.05] text-white">{children}</h2>
    )}
    {sub && <p className="mt-5 md:mt-6 text-[17px] md:text-[19px] leading-relaxed text-zinc-400">{sub}</p>}
  </div>
);

/* Long-form body copy: explicit px so it stays readable (html font-size is 12.5px on this site). */
const P = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`text-[16px] leading-[1.7] text-zinc-300 mb-5 ${className}`.trim()}>{children}</p>
);

const B = ({ children }: { children: ReactNode }) => <strong className="text-white font-semibold">{children}</strong>;

/* Rob's bold lines (whole-paragraph <B> in the offer doc) as highlighted standout lines. */
const Standout = ({ children }: { children: ReactNode }) => (
  <p className="my-8 border-l-[3px] border-[#D3FF02] pl-4 text-[19px] md:text-[21px] leading-[1.4] font-bold text-white tracking-tight">
    {children}
  </p>
);


/* Every apply button opens the application form, carrying UTM/referral params through so the CRM can attribute the lead. */
const applyHref = () => `/mentorship/apply${window.location.search}`;

const LimeCta = ({ id, className = "" }: { id?: string; className?: string }) => (
  <a
    id={id}
    href={applyHref()}
    className={`w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#D3FF02] text-black px-6 md:px-8 py-4 rounded-2xl text-[17px] md:text-lg font-black hover:bg-[#b8e000] transition-all shadow-[0_0_40px_rgba(211,255,2,0.4)] hover:shadow-[0_0_50px_rgba(211,255,2,0.5)] ${className}`.trim()}
  >
    Apply For The Mentorship
    <ArrowRight className="w-5 h-5" />
  </a>
);

const BridgeCta = ({ className = "mt-12 md:mt-16" }: { className?: string }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <LimeCta />
  </div>
);

/* Cohort 1 students, cropped from the testimonial posters (16:9). x = face position, oy/s = zoom origin and scale. */
const FACES = {
  griffin: { src: "/assets/mentorship-rob/testimonial-griffin-poster.jpg", x: 47, oy: 0, s: 1.3 },
  austin: { src: "/assets/mentorship-rob/testimonial-austin-poster.jpg", x: 52, oy: 0, s: 1.3 },
  aaron: { src: "/assets/mentorship-rob/testimonial-aaron-poster.jpg", x: 45, oy: 56, s: 1.5 },
} as const;

/* The zoom is done by oversizing the image rather than a CSS transform, so iPhone Safari clips it to the circle. */
const FaceAvatar = ({ who, className = "" }: { who: keyof typeof FACES; className?: string }) => {
  const f = FACES[who];
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-full bg-zinc-800 ${className}`}>
      <img
        src={f.src}
        alt=""
        aria-hidden="true"
        className="absolute max-w-none object-cover"
        style={{
          width: `${f.s * 100}%`,
          height: `${f.s * 100}%`,
          left: `${f.x * (1 - f.s)}%`,
          top: `${f.oy * (1 - f.s)}%`,
          objectPosition: `${f.x}% 50%`,
        }}
      />
    </span>
  );
};

const IG_RING = "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)";

/* Student face inside the same IG-style gradient ring as Rob's avatar. */
const RingedFace = ({ who, className = "w-10 h-10" }: { who: keyof typeof FACES; className?: string }) => (
  <span className={`block shrink-0 rounded-full p-[2px] ${className}`} style={{ background: IG_RING }}>
    <FaceAvatar who={who} className="w-full h-full border-2 border-black" />
  </span>
);

/* Rob's sales video: poster with a big play button, native controls once it's playing. */
const VslPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  return (
    <div className="relative z-10 w-full aspect-video bg-zinc-900 rounded-[24px] border border-white/10 overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        src="/assets/mentorship-rob/vsl.mp4"
        poster="/assets/mentorship-rob/vsl-poster.jpg"
        playsInline
        preload="metadata"
        controls={started}
        onPlay={() => setStarted(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {!started && (
        <button type="button" onClick={() => videoRef.current?.play()} aria-label="Play video" className="absolute inset-0 grid place-items-center">
          <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg grid place-items-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 md:w-8 md:h-8 text-white ml-1" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};

const ApplyPill = () => (
  <a
    href={applyHref()}
    className="shrink-0 bg-white text-black px-4 md:px-5 py-2 rounded-full text-[13px] font-semibold hover:bg-zinc-200 transition-colors"
  >
    Apply Now
  </a>
);

const SeatLine = () => (
  <span className="inline-flex flex-wrap items-baseline gap-x-1.5" style={{ letterSpacing: "-0.02em" }}>
    <span className="line-through decoration-2 text-white/40">{SEATS_TOTAL} seats available</span>
    <span className="text-[#D3FF02]">{SEATS_LEFT} remaining</span>
  </span>
);

/* Sticky top bar: the name with the seat count and close date under it, Apply Now on the right. */
/* Sticky top bar: seat count and close date on the left, Apply Now on the right. Rob's name lives in the eyebrow below. */
const StickyBar = () => (
  <header className="sticky top-0 z-50 bg-[#050505]/85 backdrop-blur-md border-b border-white/[0.06]">
    <div className="flex items-center justify-between gap-3 px-5 md:px-12 py-2.5 md:py-3 max-w-7xl mx-auto">
      <div className="min-w-0 leading-tight">
        <p className="text-[14px] font-bold text-white">
          <SeatLine />
        </p>
        <p className="text-[11.5px] text-white/50 mt-1">Applications close 11 November</p>
      </div>
      <ApplyPill />
    </div>
  </header>
);

const Phone = ({
  src,
  alt,
  width,
  height,
  className = "my-8",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) => (
  <figure className={`mx-auto max-w-[340px] ${className}`}>
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      className={`w-full h-auto rounded-[28px] border border-white/10 ${GLOW_SHADOW}`}
    />
  </figure>
);

const Wide = ({
  src,
  alt,
  width,
  height,
  className = "my-8",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
}) => (
  <figure className={className}>
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      className={`w-full h-auto rounded-2xl border border-white/10 ${GLOW_SHADOW} ${imgClassName}`.trim()}
    />
  </figure>
);

const PhaseCard = ({
  num,
  eyebrow,
  title,
  children,
}: {
  num: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) => (
  <article className={`${CARD} relative overflow-hidden p-5 md:p-10`}>
    <div
      aria-hidden="true"
      className="absolute top-2 right-4 md:top-6 md:right-10 font-black text-7xl md:text-9xl text-white/[0.03] select-none pointer-events-none"
    >
      {num}
    </div>
    <div className="relative z-10 max-w-3xl mx-auto">
      <p className="text-[#D3FF02] text-[12px] font-bold uppercase tracking-[0.18em] mb-2">{eyebrow}</p>
      <h3 className="text-[26px] md:text-[34px] font-bold text-white tracking-tight leading-tight mb-6">{title}</h3>
      {children}
    </div>
  </article>
);

const IncludedItem = ({ label, children, free = false }: { label: string; children: ReactNode; free?: boolean }) => (
  <li className="flex items-start gap-3">
    <Check className="w-5 h-5 text-[#D3FF02] shrink-0 mt-0.5" />
    <span className="text-zinc-300 text-[15px] leading-relaxed flex-1">
      <strong className="text-white font-semibold">{label}:</strong> {children}
    </span>
    {free && (
      <span className="text-green-400 text-[11px] font-bold uppercase tracking-wider bg-green-400/10 px-2 py-0.5 rounded shrink-0 mt-0.5">
        Free
      </span>
    )}
  </li>
);

const StepCard = ({
  num,
  label,
  title,
  children,
}: {
  num: string;
  label: string;
  title: string;
  children: ReactNode;
}) => (
  <div className={`${CARD} relative overflow-hidden p-6 md:p-7`}>
    <div
      aria-hidden="true"
      className="absolute top-0 right-3 font-black text-8xl text-white/[0.04] select-none pointer-events-none leading-none pt-2"
    >
      {num}
    </div>
    <div className="relative z-10">
      <p className="mb-5 flex flex-wrap items-baseline gap-x-2">
        <span className="text-[#D3FF02] text-[12px] font-bold uppercase tracking-[0.18em]">{label}</span>
        <span className="text-[19px] leading-snug font-bold text-white tracking-tight">{title}</span>
      </p>
      {children}
    </div>
  </div>
);

const TestimonialVideo = ({
  src,
  poster,
  name,
  who,
}: {
  src: string;
  poster: string;
  name: string;
  who: keyof typeof FACES;
}) => (
  <figure className="snap-center shrink-0 w-[85vw] max-w-[340px] md:w-auto md:max-w-none bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors">
    <video
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      className="w-full aspect-video bg-black object-cover"
    />
    <figcaption className="p-4 flex items-center gap-3">
      <RingedFace who={who} />
      <span className="text-[13px] text-zinc-500">
        <span className="text-white font-bold text-[14px] tracking-tight">{name}</span> · Cohort 1
      </span>
    </figcaption>
  </figure>
);

const QuoteCard = ({ children, name, who }: { children: ReactNode; name: string; who: keyof typeof FACES }) => (
  <figure className={`${CARD} relative overflow-hidden p-6 md:p-7 flex flex-col`}>
    <span
      aria-hidden="true"
      className="absolute -top-3 right-4 font-serif text-[110px] leading-none text-white/[0.05] select-none pointer-events-none"
    >
      &ldquo;
    </span>
    <blockquote className="relative text-[17px] md:text-[18px] leading-[1.55] font-medium text-white tracking-tight flex-1">
      {children}
    </blockquote>
    <figcaption className="relative mt-5 pt-4 border-t border-zinc-800 flex items-center gap-3">
      <FaceAvatar who={who} className="w-9 h-9" />
      <span className="text-[13px] text-zinc-500">
        <span className="text-[#D3FF02] font-semibold text-[14px]">{name}</span> · Cohort 1
      </span>
    </figcaption>
  </figure>
);

/* ---------- Page ---------- */

const MentorshipLandingVersion = () => {
  useEffect(() => {
    document.title = "Rob Late - Producer Mentorship";

    /* One video at a time: starting one pauses the rest ("play" doesn't bubble, so listen in the capture phase). */
    const pauseOthers = (e: Event) => {
      document.querySelectorAll("video").forEach((v) => {
        if (v !== e.target) v.pause();
      });
    };
    document.addEventListener("play", pauseOthers, true);

    return () => {
      document.removeEventListener("play", pauseOthers, true);
    };
  }, []);

  const outcomes = [
    {
      id: "01",
      icon: <AudioLines className="w-5 h-5" />,
      title: "20+ songstarters",
      desc: "A library of fresh musical ideas you can develop into future releases, collaborations or personal projects.",
    },
    {
      id: "02",
      icon: <Layers className="w-5 h-5" />,
      title: "4 developed track ideas",
      desc: "Each one built out to a first chorus or drop.",
    },
    {
      id: "03",
      icon: <Disc3 className="w-5 h-5" />,
      title: "1 finished track",
      desc: "Taking your strongest idea all the way from a starting point to a complete production.",
    },
    {
      id: "04",
      icon: <Repeat className="w-5 h-5" />,
      title: "A repeatable creative workflow",
      desc: "Designed to make you a faster, more confident and more capable producer long after the mentorship ends.",
    },
  ];

  const willWork = [
    "You're ready to spend a few focused hours each week actually making music",
    "You want constructive feedback on your tracks and are prepared to put it into practice.",
    "You're open to trying new workflows, experimenting and pushing yourself creatively.",
    "You can attend the weekly live calls and keep up with your submissions.",
    "You want to develop skills and habits that will improve your music long after the six weeks are over.",
  ];

  const wontWork = [
    "You can't take honest feedback on your music.",
    "You're looking for shortcuts, secret plugins or a magic formula for making great music.",
    "You don't have time to create and submit music consistently.",
    "You'd rather collect more tutorials than put what you've learned into practice.",
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-x-clip">
      <StickyBar />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* Aurora Glow Effect */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse at center bottom, rgba(211,255,2,0.15) 0%, rgba(180,230,0,0.1) 25%, rgba(211,255,2,0.05) 50%, transparent 70%)",
          }}
        />

        {/* Hero Content */}
        <main className="relative z-10 px-5 md:px-12 pt-8 md:pt-16 pb-4 md:pb-28 max-w-5xl mx-auto text-center">
          {/* HERO AMBIENT GLOW */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D3FF02]/10 blur-[120px] rounded-full pointer-events-none z-0" />

          {/* Eyebrow: who's mentoring you, then his credits */}
          <div className="relative mb-5 md:mb-8">
            <p className="text-[14px] md:text-[15px] font-semibold text-white/90 tracking-tight">Get mentored by Rob Late</p>
            <p className="mt-1 text-[12px] md:text-[13px] italic text-zinc-500 whitespace-nowrap">The Chainsmokers · Clean Bandit · Illenium</p>
          </div>

          {/* Headline */}
          <h1 className="hero-headline relative text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.05em] leading-[1.1] md:leading-[1.05] md:font-bold mb-6 md:mb-10">
            Make better music,
            <br />
            <span className="font-serif italic font-normal tracking-normal text-zinc-200">faster.</span>
          </h1>

          {/* Subheadline */}
          <p className="relative text-zinc-400 text-[16px] md:text-[19px] max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
            Six weeks of hands-on production mentorship to help you build a stronger creative workflow, improve your music, and start finishing tracks you're genuinely proud of.
          </p>

          {/* Desktop/Mobile flex container with order swapping */}
          <div className="relative flex flex-col">
            {/* CTA Area - order-2 on mobile (after VSL), order-1 on desktop (before VSL) */}
            <div className="order-2 md:order-1 mb-6 md:mb-8">
              <LimeCta className="md:text-lg" />
            </div>

            {/* Callout tiles - order-3 on mobile (after CTA), order-2 on desktop (before VSL) */}
            <div className="order-3 md:order-2 grid grid-cols-3 gap-2 md:gap-3 max-w-xl w-full mx-auto mb-8 md:mb-12">
              {[
                { icon: <Users className="w-4 h-4" />, label: "First cohort sold out" },
                { icon: <Video className="w-4 h-4" />, label: "Live calls every Sunday" },
                { icon: <MessageCircle className="w-4 h-4" />, label: "Private WhatsApp group" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3 flex flex-col items-center gap-1.5">
                  <span className="text-white">{item.icon}</span>
                  <span className="text-[12.5px] md:text-[13px] leading-snug text-zinc-300 font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Hero VSL placeholder - order-1 on mobile (first), order-3 on desktop (after CTA & Benefits) */}
            <div className="order-1 md:order-3 w-full max-w-5xl mx-auto relative mb-8 md:mb-4">
              {/* Large Ambient Glow Behind VSL */}
              <div
                className="absolute -inset-32 pointer-events-none z-0"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(180,230,0,0.15) 0%, rgba(211,255,2,0.08) 40%, transparent 70%)",
                }}
              />
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-[#D3FF02]/10 blur-3xl rounded-[30px] opacity-40" />

              {/* VSL Label */}
              <div className="relative z-10 text-center mb-3 md:hidden">
                <span className="text-white text-[12px] font-bold tracking-tight">Watch: Inside the mentorship</span>
              </div>

              {/* Video Container */}
              <VslPlayer />
            </div>
          </div>
        </main>
      </section>

      {/* ================= THE OUTCOME ================= */}
      <section className="relative bg-[#050505] border-t border-white/5 py-16 md:py-28 px-5 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Headline (Taki's lead-in), Rob's line as the subheadline, then the lead-in to the cards */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tighter leading-[1.05] text-white">
              Here's what <Serif>we're doing...</Serif>
            </h2>
            <p className="mt-5 md:mt-6 text-[17px] md:text-[19px] leading-relaxed text-zinc-400">
              I'm taking on just 12 producers, working directly with you through weekly feedback, live co-production sessions and a creative process that's completely changed the way I make music.
            </p>
          </div>

          <p className="text-center text-[20px] md:text-[24px] font-semibold text-white tracking-tight mb-6 md:mb-8">
            By the end of the six weeks, you'll have:
          </p>

          {/* Feature cards with isolated lighting */}
          <div className="relative isolate mb-14 md:mb-20">
            <div className="absolute inset-0 pointer-events-none z-0" style={{ background: SOFT_GLOW }} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 relative z-10">
              {outcomes.map((card) => (
                <div
                  key={card.id}
                  className={`${CARD} p-6 relative overflow-hidden group hover:border-zinc-600 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500`}
                >
                  <div className="absolute top-0 right-0 p-4 font-black text-6xl text-white/[0.03] select-none pointer-events-none">
                    {card.id}
                  </div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-6 text-zinc-400">{card.icon}</div>
                    <h3 className="text-[20px] font-bold text-white mb-3 leading-snug">{card.title}</h3>
                    <p className="text-zinc-400 text-[15px] leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Closer */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[22px] md:text-2xl text-white font-medium leading-relaxed mb-6">And I'll be guiding you through the entire process.</p>
            <p className="text-[16px] md:text-[17px] leading-[1.7] text-zinc-400">
              Everything’s below: how it works, who it’s for and what we’ll do together. Have a read and apply at the bottom when you’re ready.
            </p>
            <div className="flex justify-center mt-8">
              <img src={robSignature} alt="Rob Late" className="h-14 sm:h-16 w-auto opacity-90" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= STOP OVERTHINKING (Rob's story; credits stay inline, as in Taki's doc) ================= */}
      <section className="relative w-full bg-black py-16 md:py-28 px-5 md:px-6 overflow-x-clip">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-zinc-800/30 blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] text-white">
              Stop overthinking.
              <br />
              <Serif>Start creating.</Serif>
            </h2>
          </div>

          {/* Story column */}
          <div className="max-w-[640px] mx-auto">
            <P>One of the biggest things that changed the trajectory of my career as a producer wasn't a new plugin, mixing technique or some secret production trick.</P>

            <Standout>It was learning to make more ideas, more often.</Standout>

            <P>
              I've spent the last few years writing and producing with artists like The Chainsmokers, Marshmello, Macklemore, Clean Bandit and many more, alongside working in film, TV, gaming and building my own music production businesses.
            </P>

            <P>And a huge part of that journey has been developing a workflow that allows me to create better music, faster.</P>

            {/* Photos near the credits line */}
            <div className="relative my-10">
              <div className="absolute inset-0 -m-6 pointer-events-none" style={{ background: SOFT_GLOW }} />
              <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                <img
                  src={webAsset("rob-chainsmokers.webp")}
                  alt="Rob with The Chainsmokers"
                  width={600}
                  height={799}
                  loading="lazy"
                  className={`w-full aspect-[3/4] object-cover object-top rounded-2xl border border-white/10 ${GLOW_SHADOW}`}
                />
                <img
                  src={webAsset("rob-marshmello.webp")}
                  alt="Rob with Marshmello"
                  width={600}
                  height={923}
                  loading="lazy"
                  className={`w-full aspect-[3/4] object-cover rounded-2xl border border-white/10 ${GLOW_SHADOW}`}
                />
                <img
                  src={webAsset("rob-session.webp")}
                  alt="Rob in a writing session"
                  width={1050}
                  height={1442}
                  loading="lazy"
                  className={`col-span-2 sm:col-span-1 w-full aspect-[16/10] sm:aspect-[3/4] object-cover rounded-2xl border border-white/10 ${GLOW_SHADOW}`}
                />
              </div>
            </div>

            <P>In professional writing camps, I used to turn up to sessions with loads of nearly finished tracks.</P>

            <P>But I quickly realised that when a track is already fully formed, there's not much room for other people to contribute creatively.</P>

            <P>
              So instead, I started bringing <B>songstarters</B>.
            </P>

            <P>Little four or eight-bar ideas. Interesting chords, unique sounds, catchy hooks, cool rhythms. Nothing complicated. Just enough to spark something.</P>

            <P>Instead of making five full tracks, I could make 50 songstarters in roughly the same amount of time.</P>

            <P>I'd flick through these ideas in sessions until something caught someone's attention, and suddenly we'd have the starting point for a new track.</P>

            <div className="relative my-10">
              <div className="absolute inset-0 -m-6 pointer-events-none" style={{ background: SOFT_GLOW }} />
              <img
                src={webAsset("rob-studio-portrait.webp")}
                alt="Rob in his studio"
                width={1067}
                height={1600}
                loading="lazy"
                className={`relative w-full max-w-[440px] mx-auto aspect-[4/5] object-cover object-[center_40%] rounded-2xl border border-white/10 ${GLOW_SHADOW}`}
              />
            </div>

            <P>We'd build the idea into a verse, chorus or drop, then move on to the next one. At the end, we'd choose the strongest tracks to finish.</P>

            <P>But here's what I didn't expect.</P>

            <Standout>This process made me a dramatically better producer.</Standout>

            <P>Because every new idea was another opportunity to practise sound design, melodies, drums, arrangement and creative decision-making.</P>

            <P>I was getting more creative reps in, experimenting with different sounds, and learning to recognise what actually makes a great track.</P>

            <P>Without getting stuck spending weeks tweaking full tracks that might never get heard or used.</P>

            <P>And that's the foundation of this mentorship.</P>

            <Standout>You don't need to want to work with major artists or attend writing camps to benefit from this approach.</Standout>

            <P>Whether you're making music for yourself, building an artist project or looking to produce professionally, the goal is the same:</P>

            <p className="text-[21px] md:text-[24px] leading-[1.4] font-semibold text-white tracking-tight">
              Make more ideas. Develop your instincts. Learn what makes your music special. And finish the tracks that will serve you the most.
            </p>
          </div>

          {/* Austin's words as proof of the method, right where Rob's story lands */}
          <div className="max-w-[640px] mx-auto mt-12 md:mt-16">
            <QuoteCard name="Austin" who="austin">
              "The biggest change for me from the mentorship was realising that I'm really overcomplicating the whole process of making music. I’m shocked at how simple and effective Rob’s workflow was."
            </QuoteCard>
          </div>

          <BridgeCta />
        </div>
      </section>

      {/* ================= THE SIX WEEKS ================= */}
      <section className="relative bg-[#050505] border-t border-white/5 py-16 md:py-28 px-5 md:px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader eyebrow="So how do we get you there?" className="mb-10 md:mb-14">
            Here's how the six weeks <Serif>work.</Serif>
          </SectionHeader>

          <Wide
            src={webAsset("live-call-gallery.webp")}
            alt="Zoom call with Rob and the cohort 1 producers, Ableton on screen"
            width={1200}
            height={753}
            className="mb-8 md:mb-12 max-w-4xl mx-auto"
          />

          <div className="flex flex-col gap-5 md:gap-8">
            {/* Before we start */}
            <PhaseCard num="01" eyebrow="Before we start" title="Your 1:1 production assessment">
              <P>We'll kick things off with a private one-to-one call.</P>
              <P>Play me your music, tell me what you're working towards, and we'll identify the biggest things holding you back.</P>
              <P>I'll help you figure out exactly what you need to focus on throughout the mentorship, and we'll use that to track your progress.</P>
              <P>You'll also get access to your personal student portal, including session templates, reference playlists and sound libraries designed to help you work faster and more efficiently.</P>
              <Wide
                src={webAsset("portal-onboarding.webp")}
                alt="Student portal onboarding"
                width={1004}
                height={811}
                className="mt-8 mb-0 max-w-[520px] mx-auto"
              />
            </PhaseCard>

            {/* Weeks 1-4 */}
            <PhaseCard num="02" eyebrow="Weeks 1–4" title="Doing The Reps">
              <P>This is where we get to work.</P>
              <P>
                Every week, you'll create a minimum of <B>five new songstarters</B> and choose your favourite to develop into a larger musical idea, up to a first chorus or drop.
              </P>
              <P>Every Thursday, you'll upload your work into the student portal, where I'll personally review your submissions and give you feedback on what's working, what needs improving, and how to take your music further.</P>
              <P>Along the way, we'll tackle the essential skills behind great productions, including sound selection, arrangement, drums, sound design, mixing and commercial song structures.</P>

              <Standout>Then every Sunday, we're live for 90 minutes.</Standout>

              <P>I'll open up a selected student's project and co-produce it live, walking everyone through my decisions, techniques and thought process as we improve the track together.</P>

              <Wide
                src={webAsset("live-call-rob-ableton.webp")}
                alt="Rob inside a project on a cohort 1 call, students on Zoom down the side"
                width={1200}
                height={674}
                className="my-8"
              />

              <Phone
                src={webAsset("rob-stems-surgery.webp")}
                width={900}
                height={701}
                alt="WhatsApp: Rob asks a cohort 1 student for stems to work on live"
              />

              <P>We'll also cover the areas the group needs help with, break down real major-label projects, and finish with a Q&A.</P>

              <Phone
                src={webAsset("rob-project-sunday.webp")}
                width={900}
                height={870}
                alt="WhatsApp: Rob offers to open a project on the Sunday call"
              />

              <P>You'll see exactly how I approach music in real-world situations, and how to apply those techniques to your own productions.</P>

              <Standout>
                By the end of week four, you'll have at least 20 songstarters, four developed track ideas, and a much clearer understanding of what makes your music work.
              </Standout>
            </PhaseCard>

            {/* Weeks 5-6 */}
            <PhaseCard num="03" eyebrow="Weeks 5–6" title="Finishing Your Strongest Track">
              <P>Now we take everything you've learned and put it into practice.</P>
              <P>We'll choose your strongest track and dedicate the final two weeks to taking it all the way to a finished production, with my guidance and feedback throughout.</P>
              <P>The goal isn't just to walk away with one finished piece of music.</P>
              <Standout>It's to understand the process well enough to keep doing it yourself.</Standout>
            </PhaseCard>

            {/* Throughout */}
            <PhaseCard num="04" eyebrow="Throughout" title="Direct Access & Accountability">
              <P>Between our weekly sessions, you'll have access to a private WhatsApp group with me and the other producers.</P>
              <P>Ask questions, share your progress, get advice, and be part of a small group of producers working towards the same goal.</P>
              <P>I'll also be sharing insights into my daily life as a full-time producer, my projects, and how I approach the creative and business sides of the industry.</P>

              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory mt-8 -mx-5 px-5 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:overflow-visible scrollbar-hide items-start">
                <img
                  src={webAsset("rob-reps-folders.webp")}
                  width={800}
                  height={1434}
                  alt="WhatsApp: Rob's project folders"
                  loading="lazy"
                  className="snap-start shrink-0 w-[72%] sm:w-auto h-auto rounded-[20px] border border-white/10"
                />
                <img
                  src={webAsset("austin-chat.webp")}
                  width={800}
                  height={1320}
                  alt="WhatsApp: Austin's message to Rob"
                  loading="lazy"
                  className="snap-start shrink-0 w-[72%] sm:w-auto h-auto rounded-[20px] border border-white/10"
                />
                <img
                  src={webAsset("aaron-video-breakdown.webp")}
                  width={800}
                  height={1499}
                  alt="WhatsApp: Rob's video breakdown for Aaron"
                  loading="lazy"
                  className="snap-start shrink-0 w-[72%] sm:w-auto h-auto rounded-[20px] border border-white/10"
                />
              </div>
            </PhaseCard>
          </div>
        </div>
      </section>

      {/* ================= ONE MORE THING (Master Bundle as a quiet aside, not a bonus card) ================= */}
      <section className="relative bg-[#050505] pt-20 md:pt-28 pb-16 md:pb-28 px-5 md:px-6 overflow-hidden">
        {/* Visual connector */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 md:h-24 bg-gradient-to-b from-zinc-800 to-transparent" />

        <div className="max-w-[640px] mx-auto relative z-10 text-center">
          <SectionHeader eyebrow="One more thing..." className="mb-6 md:mb-8" />

          <p className="text-[18px] md:text-[20px] leading-[1.6] text-zinc-300">
            You'll also get my complete <B>Master Bundle sample and preset collection</B> included for free. If you've already purchased it, I'll refund that purchase when you join.
          </p>

          <p className="mt-5 text-[18px] md:text-[20px] leading-[1.6] text-zinc-300">
            So you've got a war chest of quality sounds to work with throughout the mentorship. <B>More on that in your onboarding...</B>
          </p>

          <img
            src={webAsset("master-bundle.webp")}
            alt="The Master Bundle"
            width={840}
            height={840}
            loading="lazy"
            className="w-full max-w-[280px] mx-auto mt-8 md:mt-10 rounded-xl border border-white/10"
          />
        </div>
      </section>

      {/* ================= STUDENT WINS ================= */}
      <section className="relative py-16 md:py-28 overflow-x-clip border-t border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D3FF02]/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto px-5 md:px-6 relative z-10">
          <SectionHeader eyebrow="STUDENT WINS" className="mb-8 md:mb-12">
            Real producers. <Serif>Real progress.</Serif>
          </SectionHeader>

          <div className="max-w-[640px] mx-auto mb-10 md:mb-14">
            <P>The first cohort sold out, and one thing became very clear.</P>
            <P>The students who made the most progress weren't necessarily the ones with the most experience.</P>
            <Standout>They were the ones who consistently showed up, submitted music, took feedback on board, and put it into practice.</Standout>
            <P>That's why I've made creative repetition and accountability an even bigger part of Cohort 2.</P>
            <p className="text-[17px] leading-[1.6] text-white font-semibold mt-8">Here's what previous students have said:</p>
          </div>

          {/* Scrollable gallery on mobile, 3-up on desktop */}
          <div
            className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-5 px-5 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 md:mx-0 md:px-0 scrollbar-hide mb-10 md:mb-14"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <TestimonialVideo
              src="/assets/mentorship-rob/testimonial-griffin.mp4"
              poster="/assets/mentorship-rob/testimonial-griffin-poster.jpg"
              name="Griffin"
              who="griffin"
            />
            <TestimonialVideo
              src="/assets/mentorship-rob/testimonial-austin.mp4"
              poster="/assets/mentorship-rob/testimonial-austin-poster.jpg"
              name="Austin"
              who="austin"
            />
            <TestimonialVideo
              src="/assets/mentorship-rob/testimonial-aaron.mp4"
              poster="/assets/mentorship-rob/testimonial-aaron-poster.jpg"
              name="Aaron"
              who="aaron"
            />
            {/* Spacer for mobile scrolling */}
            <div className="w-2 shrink-0 md:hidden" />
          </div>

          {/* Quote cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <QuoteCard name="Griffin" who="griffin">
              "Whether you're a beginner, at the intermediate level, or even a professional, Rob’s mentorship is an absolute no-brainer."
            </QuoteCard>
            <QuoteCard name="Austin" who="austin">
              "So far it's been the most useful mentorship that I've done... and I've spent much more money on other programs that lasted much longer."
            </QuoteCard>
            <QuoteCard name="Aaron" who="aaron">
              "Having someone with actual industry experience… it really helps."
            </QuoteCard>
          </div>

          <BridgeCta />
        </div>
      </section>

      {/* ================= IS IT FOR YOU ================= */}
      <section className="relative py-16 md:py-28 px-5 md:px-6 bg-[#050505] border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            eyebrow="Before you apply"
            className="mb-10 md:mb-14"
            sub="I'm keeping this group small because I want to work closely with producers who are serious about improving."
          >
            Is this mentorship <Serif>right for you?</Serif>
          </SectionHeader>

          <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-zinc-800">
            {/* Left: WILL work */}
            <div className="bg-zinc-900/40 p-7 md:p-10">
              <h3 className="text-[20px] md:text-[22px] font-bold text-white mb-6 tracking-tight leading-snug">This mentorship WILL work for you if:</h3>
              <ul className="space-y-4">
                {willWork.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#D3FF02] shrink-0 mt-0.5" />
                    <span className="text-zinc-300 text-[15px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: WON'T work */}
            <div className="bg-[#0A0A0A] border-t md:border-t-0 md:border-l border-zinc-800 p-7 md:p-10">
              <h3 className="text-[20px] md:text-[22px] font-bold text-white mb-6 tracking-tight leading-snug">This mentorship WON’T work for you if:</h3>
              <ul className="space-y-4">
                {wontWork.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-400 text-[15px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <BridgeCta className="mt-12" />
        </div>
      </section>

      {/* ================= EVERYTHING INCLUDED + PRICE ================= */}
      <section id="pricing" className="relative py-16 md:py-28 scroll-mt-20">
        <div className="max-w-xl mx-auto px-5 md:px-6">
          <div className="text-center mb-10 md:mb-14">
            <div className="mb-4">
              <Eyebrow>The quick facts</Eyebrow>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tighter leading-[1.05]">
              Everything included in <Serif>your mentorship</Serif>
            </h2>
            <p className="text-zinc-300 text-[17px] md:text-xl max-w-2xl mx-auto font-bold leading-snug">6 weeks. 12 producers. Direct mentorship from me, Rob Late.</p>
          </div>

          {/* Pricing card */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            <ul className="space-y-5">
              <IncludedItem label="Private 1:1 onboarding call">
                I'll review your music, identify where you need to improve, and help set your goals.
              </IncludedItem>
              <IncludedItem label="Weekly personalised feedback">
                Submit your music through the student portal and get direct feedback from me.
              </IncludedItem>
              <IncludedItem label="Six weekly live group calls">
                Sundays, 7:00–8:30 PM UK time, including live co-production, teaching and Q&A.
              </IncludedItem>
              <IncludedItem label="Structured weekly assignments">
                Create at least 20 songstarters, develop four ideas and finish your strongest track.
              </IncludedItem>
              <IncludedItem label="Private WhatsApp community">
                Ask questions, share work and connect with me and the other students.
              </IncludedItem>
              <IncludedItem label="Production resources">
                Access to session templates, reference material and sound libraries.
              </IncludedItem>
              <IncludedItem label="The Master Bundle" free>
                My full sample and preset collection, included at no extra cost.
              </IncludedItem>
            </ul>

            <div className="pt-6 mt-7 border-t border-zinc-800">
              <div className="flex justify-between items-baseline mb-5">
                <span className="text-zinc-400 text-[16px]">Your investment:</span>
                <span className="text-4xl font-bold text-white tracking-tight">$2,497</span>
              </div>

              <a
                href={applyHref()}
                className="w-full bg-[#D3FF02] hover:bg-[#b8e000] text-black font-bold py-4 px-8 rounded-xl text-[17px] transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#D3FF02]/25 flex items-center justify-center gap-2"
              >
                Apply For The Mentorship
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW TO APPLY ================= */}
      <section className="relative py-16 md:py-28 px-5 md:px-6 bg-[#050505] border-t border-zinc-900 overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] pointer-events-none z-0"
          style={{
            background:
              "radial-gradient(ellipse at center bottom, rgba(211,255,2,0.12) 0%, rgba(180,230,0,0.07) 30%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto">
          <SectionHeader eyebrow="How to apply" className="mb-8 md:mb-10">
            Secure <Serif>your spot</Serif>
          </SectionHeader>

          <div className="text-center max-w-[640px] mx-auto mb-10 md:mb-12">
            <p className="text-[17px] md:text-[19px] leading-[1.6] text-zinc-300 mb-4">
              I'm only accepting 12 producers for Cohort 2 so I can give everyone the attention and feedback they need.
            </p>
            <p className="text-[17px] md:text-[19px] leading-[1.6] text-white font-medium">Here's how to secure your place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12">
            <StepCard num="1" label="STEP 1:" title="Send your application:">
              <P>Hit the button below and tell me about yourself, your goals and your current production experience. You'll also submit one of your existing tracks.</P>
              <P className="!mb-0">It takes around five minutes, and there's nothing to pay at this stage.</P>
            </StepCard>
            <StepCard num="2" label="STEP 2:" title="I'll review your music">
              <P className="!mb-0">I personally review every application within 72 hours. If I think we're a good fit, I'll offer you a place in the mentorship and send over the payment details.</P>
            </StepCard>
            <StepCard num="3" label="STEP 3:" title="Secure your place">
              <P className="!mb-0">Once you've completed your payment, you'll get access to the student portal, your onboarding information and can book your private one-to-one call with me.</P>
            </StepCard>
          </div>

          <p className="text-center text-[22px] md:text-2xl text-white font-medium mb-10 md:mb-12">Then we're ready to get to work.</p>

          {/* Dates */}
          <div className="max-w-[640px] mx-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-7 mb-10 md:mb-12">
            <p className="text-[17px] md:text-[18px] leading-[1.6] text-white font-bold mb-4">
              Cohort 2 starts Sunday 15 November.
            </p>
            <p className="text-[16px] md:text-[17px] leading-[1.65] text-zinc-300">
              Applications close{" "}
              <B>
                Wednesday 11 November at 11:59 PM UK time
              </B>
              , or as soon as all 12 places are filled.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <LimeCta id="apply" className="scroll-mt-24" />
            <p className="mt-10 text-[19px] text-zinc-300">See you inside.</p>
            <img src={robSignature} alt="Rob Late" className="h-16 sm:h-20 w-auto mt-3" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 bg-[#030303] border-t border-zinc-900 py-8 px-5">
        <p className="text-center text-xs text-zinc-600">Rob Late · roblate.com</p>
      </footer>
    </div>
  );
};

export default MentorshipLandingVersion;
