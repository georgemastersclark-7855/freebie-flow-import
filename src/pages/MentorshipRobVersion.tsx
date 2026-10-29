import { useEffect, useRef, useState, type ReactNode } from "react";
const robSignature = "/assets/mentorship-rob/web/rob-signature.webp";

const robProfile = "/assets/rob-profile.jpg";

const tightSpacing = { letterSpacing: "-0.02em" } as const;

/* ---------- Small local components ---------- */

const P = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`text-[16px] leading-[1.7] text-white/80 mb-5 ${className}`.trim()}>{children}</p>
);

const H2 = ({ children }: { children: ReactNode }) => (
  <p role="heading" aria-level={2} className="text-[24px] leading-tight font-bold text-white mt-14 mb-5" style={tightSpacing}>
    {children}
  </p>
);

const H3 = ({ children }: { children: ReactNode }) => (
  <p role="heading" aria-level={3} className="text-[18px] leading-snug font-bold text-white mt-10 mb-3" style={tightSpacing}>
    {children}
  </p>
);

const Big = ({ children }: { children: ReactNode }) => (
  <p className="text-[28px] leading-tight font-bold text-white my-8" style={tightSpacing}>
    {children}
  </p>
);

const Quote = ({ children, name }: { children: ReactNode; name: string }) => (
  <figure className="my-8 border-l-[3px] border-[#22c55e] pl-5">
    <blockquote className="text-[19px] sm:text-[20px] leading-[1.5] font-medium italic text-white" style={tightSpacing}>
      {children}
    </blockquote>
    <figcaption className="mt-3 text-[13px] text-white/50">
      <span className="text-[#22c55e] font-semibold">{name}</span> · Cohort 1
    </figcaption>
  </figure>
);

const PlaceholderTag = ({ children }: { children: ReactNode }) => (
  <span className="absolute top-3 left-3 z-10 bg-white text-[#050505] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
    {children}
  </span>
);

const Receipt = ({
  src,
  alt,
  caption,
  className = "my-10",
  width,
  height,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  width?: number;
  height?: number;
}) => (
  <figure className={`mx-auto ${className} max-w-[340px]`}>
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      className="w-full rounded-[28px] border border-white/10 shadow-2xl shadow-black/60"
    />
    {caption && <figcaption className="text-[13px] text-white/45 text-center mt-3 leading-snug">{caption}</figcaption>}
  </figure>
);


const CtaButton = ({ id }: { id?: string }) => (
  <a
    id={id}
    href="#apply"
    className="block w-full text-center sm:inline-block sm:w-auto px-8 py-[15px] bg-white text-[#050505] font-bold text-[15px] leading-[22px] rounded-lg hover:bg-white/90 transition-colors"
    style={tightSpacing}
  >
    APPLY FOR THE MENTORSHIP
  </a>
);

const BulletList = ({ items, tone }: { items: ReactNode[]; tone: "red" | "green" }) => (
  <ul className="space-y-4 mb-8">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3 text-[16px] leading-[1.6] text-white/80">
        <span
          className={`mt-[0.55em] w-1.5 h-1.5 rounded-full shrink-0 ${
            tone === "red" ? "bg-red-400/80" : "bg-[#22c55e]"
          }`}
        />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const Strong = ({ children }: { children: ReactNode }) => (
  <strong className="text-white font-semibold">{children}</strong>
);

const Signature = ({ className }: { className: string }) => (
  <div className={className}>
    <img src={robSignature} alt="Rob Late" className="h-16 sm:h-20 w-auto" />
  </div>
);

/* Rob's sales video: poster with a big play button, native controls once it's playing. */
const VideoBlock = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black my-10 ring-1 ring-white/20 shadow-2xl shadow-black/70">
      <video
        ref={videoRef}
        src="/assets/mentorship-rob/vsl.mp4"
        poster="/assets/mentorship-rob/vsl-poster.jpg"
        playsInline
        preload="metadata"
        controls={started}
        onPlay={() => setStarted(true)}
        className="w-full h-full object-cover"
      />
      {!started && (
        <button type="button" onClick={() => videoRef.current?.play()} aria-label="Play video" className="absolute inset-0 grid place-items-center">
          <span className="w-[76px] h-[76px] rounded-full bg-white/25 backdrop-blur-md border border-white/50 grid place-items-center shadow-xl">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="text-white ml-1" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};


/* ---------- New small components ---------- */

const PhotoWide = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={`w-full aspect-[16/10] object-cover rounded-xl my-8 border border-white/10 ${className}`.trim()}
  />
);

const Section = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <>
    <p className="text-[11px] uppercase tracking-[0.18em] text-[#22c55e] font-semibold mt-12 mb-1">{eyebrow}</p>
    <p role="heading" aria-level={3} className="text-[18px] leading-snug font-bold text-white mb-3" style={tightSpacing}>
      {title}
    </p>
  </>
);

const B = ({ children }: { children: ReactNode }) => (
  <strong className="text-white font-semibold">{children}</strong>
);

const TestimonialVideo = ({ src, poster, name }: { src: string; poster: string; name: string }) => (
  <figure className="my-6">
    <video
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      className="w-full aspect-video rounded-2xl border border-white/10 bg-black object-cover"
    />
    <figcaption className="mt-2 text-[13px] text-white/50">
      <span className="text-[#22c55e] font-semibold">{name}</span> · Cohort 1
    </figcaption>
  </figure>
);

/* ---------- Page ---------- */

/* Seat counter: SEATS_TOTAL = cohort size, SEATS_LEFT = seats remaining (shown with the total struck through). */
const SEATS_TOTAL = 12;
const SEATS_LEFT = 11;

const MentorshipRobVersion = () => {
  useEffect(() => {
    document.title = "Rob Late - Producer Mentorship";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    /* One video at a time: starting one pauses the rest ("play" doesn't bubble, so listen in the capture phase). */
    const pauseOthers = (e: Event) => {
      document.querySelectorAll("video").forEach((v) => {
        if (v !== e.target) v.pause();
      });
    };
    document.addEventListener("play", pauseOthers, true);

    return () => {
      robots.remove();
      document.removeEventListener("play", pauseOthers, true);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white/90">
      <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-14 font-sans">
        {/* Note from Rob: avatar beside the update stamp and seat line, like Taki's doc */}
        <div className="flex items-start gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-full p-[2px] shrink-0" style={{
            background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)"
          }}>
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#050505]">
              <img src={robProfile} alt="Rob Late" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="min-w-0 space-y-1.5">
            <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-white/40 tracking-wider">
              <span className="text-sm font-bold text-white tracking-normal" style={{ letterSpacing: "-0.02em" }}>@roblate</span>
              <svg className="w-3.5 h-3.5 text-[#3897f0]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.7 14.5L6 12.2l1.4-1.4 2.9 2.9 6.3-6.3 1.4 1.4-7.7 7.7z" />
              </svg>
              <span>· Updated: 29th October 2026</span>
            </p>
            <p className="flex flex-wrap items-baseline gap-x-1.5 text-[17px] leading-snug font-bold text-white" style={tightSpacing}>
              <span className="line-through decoration-2 text-white/40">{SEATS_TOTAL} seats available</span>
              <span className="text-[#22c55e]">{SEATS_LEFT} remaining</span>
            </p>
            <p className="text-[13px] leading-relaxed text-white/65">
              Applications close Wednesday 11 November, or sooner if full.
            </p>
            <p className="text-[13px] leading-relaxed font-medium text-white/80">First cohort sold out.</p>
          </div>
        </div>

        <Big>Make better music, faster.</Big>

        <P className="-mt-4">
          Six weeks of hands-on production mentorship to help you build a stronger creative workflow, improve your music, and start finishing tracks you're genuinely proud of.
        </P>

        <VideoBlock />

        {/* relative so the button paints above the video's drop shadow */}
        <div className="relative -mt-2 mb-8">
          <CtaButton />
        </div>

        <P>
          I'm taking on just 12 producers, working directly with you through weekly feedback, live co-production sessions and a creative process that's completely changed the way I make music.
        </P>

        <P>By the end of the six weeks, you'll have:</P>

        <BulletList
          tone="green"
          items={[
            <>
              <Strong>20+ songstarters:</Strong> A library of fresh musical ideas you can develop into future releases, collaborations or personal projects.
            </>,
            <>
              <Strong>4 developed track ideas:</Strong> Each one built out to a first chorus or drop.
            </>,
            <>
              <Strong>1 finished track:</Strong> Taking your strongest idea all the way from a starting point to a complete production.
            </>,
            <>
              <Strong>A repeatable creative workflow:</Strong> Designed to make you a faster, more confident and more capable producer long after the mentorship ends.
            </>,
          ]}
        />

        <P>And I'll be guiding you through the entire process.</P>

        <P>Everything’s below: how it works, who it’s for and what we’ll do together. Have a read and apply at the bottom when you’re ready.</P>

        <Signature className="mt-8 mb-4" />

        <figure className="my-10">
          <img
            src="/assets/mentorship-rob/web/live-call-gallery.webp"
            width={1200}
            height={753}
            loading="lazy"
            alt="Zoom call with Rob and the cohort 1 producers, Ableton on screen"
            className="w-full rounded-2xl border border-white/10"
          />
        </figure>

        <H2>Stop overthinking. Start creating.</H2>

        <P>
          One of the biggest things that changed the trajectory of my career as a producer wasn't a new plugin, mixing technique or some secret production trick.
        </P>

        <P>
          <B>It was learning to make more ideas, more often.</B>
        </P>

        <P>
          I've spent the last few years writing and producing with artists like The Chainsmokers, Marshmello, Macklemore, Clean Bandit and many more, alongside working in film, TV, gaming and building my own music production businesses.
        </P>

        <P>And a huge part of that journey has been developing a workflow that allows me to create better music, faster.</P>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-8">
          <img
            src="/assets/mentorship-rob/web/rob-chainsmokers.webp"
            alt="Rob with The Chainsmokers"
            loading="lazy"
            className="w-full aspect-[3/4] object-cover rounded-xl border border-white/10 object-top"
          />
          <img
            src="/assets/mentorship-rob/web/rob-marshmello.webp"
            alt="Rob with Marshmello"
            loading="lazy"
            className="w-full aspect-[3/4] object-cover rounded-xl border border-white/10"
          />
          <img
            src="/assets/mentorship-rob/web/rob-session.webp"
            alt="Rob in a writing session"
            loading="lazy"
            className="col-span-2 sm:col-span-1 w-full aspect-[16/10] sm:aspect-[3/4] object-cover rounded-xl border border-white/10"
          />
        </div>

        <P>In professional writing camps, I used to turn up to sessions with loads of nearly finished tracks.</P>

        <P>But I quickly realised that when a track is already fully formed, there's not much room for other people to contribute creatively.</P>

        <P>
          So instead, I started bringing <B>songstarters</B>.
        </P>

        <P>Little four or eight-bar ideas. Interesting chords, unique sounds, catchy hooks, cool rhythms. Nothing complicated. Just enough to spark something.</P>

        <P>Instead of making five full tracks, I could make 50 songstarters in roughly the same amount of time.</P>

        <P>I'd flick through these ideas in sessions until something caught someone's attention, and suddenly we'd have the starting point for a new track.</P>

        <PhotoWide src="/assets/mentorship-rob/web/rob-writing-session.webp" alt="Rob in a writing session" className="object-top" />

        <P>We'd build the idea into a verse, chorus or drop, then move on to the next one. At the end, we'd choose the strongest tracks to finish.</P>

        <P>But here's what I didn't expect.</P>

        <P>
          <B>This process made me a dramatically better producer.</B>
        </P>

        <P>Because every new idea was another opportunity to practise sound design, melodies, drums, arrangement and creative decision-making.</P>

        <P>I was getting more creative reps in, experimenting with different sounds, and learning to recognise what actually makes a great track.</P>

        <P>Without getting stuck spending weeks tweaking full tracks that might never get heard or used.</P>

        <P>And that's the foundation of this mentorship.</P>

        <P>
          <B>You don't need to want to work with major artists or attend writing camps to benefit from this approach.</B>
        </P>

        <P>Whether you're making music for yourself, building an artist project or looking to produce professionally, the goal is the same:</P>

        <P>Make more ideas. Develop your instincts. Learn what makes your music special. And finish the tracks that will serve you the most.</P>

        <H2>Here's how the six weeks work.</H2>

        <Section eyebrow="Before we start" title="Your 1:1 production assessment" />

        <P>We'll kick things off with a private one-to-one call.</P>

        <P>Play me your music, tell me what you're working towards, and we'll identify the biggest things holding you back.</P>

        <P>I'll help you figure out exactly what you need to focus on throughout the mentorship, and we'll use that to track your progress.</P>

        <P>You'll also get access to your personal student portal, including session templates, reference playlists and sound libraries designed to help you work faster and more efficiently.</P>

        <figure className="my-8">
          <img
            src="/assets/mentorship-rob/web/portal-onboarding.webp"
            width={1004}
            height={811}
            loading="lazy"
            alt="Student portal onboarding"
            className="w-full max-w-[520px] mx-auto rounded-2xl border border-white/10"
          />
        </figure>

        <Section eyebrow="Weeks 1–4" title="Doing The Reps" />

        <P>This is where we get to work.</P>

        <P>
          Every week, you'll create a minimum of <B>five new songstarters</B> and choose your favourite to develop into a larger musical idea, up to a first chorus or drop.
        </P>

        <P>Every Thursday, you'll upload your work into the student portal, where I'll personally review your submissions and give you feedback on what's working, what needs improving, and how to take your music further.</P>

        <P>Along the way, we'll tackle the essential skills behind great productions, including sound selection, arrangement, drums, sound design, mixing and commercial song structures.</P>

        <P>
          <B>Then every Sunday, we're live for 90 minutes.</B>
        </P>

        <P>I'll open up a selected student's project and co-produce it live, walking everyone through my decisions, techniques and thought process as we improve the track together.</P>

        <figure className="my-10">
          <img
            src="/assets/mentorship-rob/web/live-call-rob-ableton.webp"
            width={1200}
            height={674}
            alt="Rob inside a project on a cohort 1 call, students on Zoom down the side"
            className="w-full rounded-2xl border border-white/10"
            loading="lazy"
          />
        </figure>

        <Receipt
          src="/assets/mentorship-rob/web/rob-stems-surgery.webp"
          width={900}
          height={701}
          alt="WhatsApp: Rob asks a cohort 1 student for stems to work on live"
        />

        <P>We'll also cover the areas the group needs help with, break down real major-label projects, and finish with a Q&A.</P>

        <Receipt
          src="/assets/mentorship-rob/web/rob-project-sunday.webp"
          width={900}
          height={870}
          alt="WhatsApp: Rob offers to open a project on the Sunday call"
        />

        <P>You'll see exactly how I approach music in real-world situations, and how to apply those techniques to your own productions.</P>

        <P>
          <B>By the end of week four, you'll have at least 20 songstarters, four developed track ideas, and a much clearer understanding of what makes your music work.</B>
        </P>

        <Section eyebrow="Weeks 5–6" title="Finishing Your Strongest Track" />

        <P>Now we take everything you've learned and put it into practice.</P>

        <P>We'll choose your strongest track and dedicate the final two weeks to taking it all the way to a finished production, with my guidance and feedback throughout.</P>

        <P>The goal isn't just to walk away with one finished piece of music.</P>

        <P>
          <B>It's to understand the process well enough to keep doing it yourself.</B>
        </P>

        <Section eyebrow="Throughout" title="Direct Access & Accountability" />

        <P>Between our weekly sessions, you'll have access to a private WhatsApp group with me and the other producers.</P>

        <P>Ask questions, share your progress, get advice, and be part of a small group of producers working towards the same goal.</P>

        <P>I'll also be sharing insights into my daily life as a full-time producer, my projects, and how I approach the creative and business sides of the industry.</P>

        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory my-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:overflow-visible">
          <img
            src="/assets/mentorship-rob/web/rob-reps-folders.webp"
            width={800}
            height={1434}
            alt="WhatsApp: Rob's project folders"
            loading="lazy"
            className="snap-start shrink-0 w-[72%] sm:w-auto rounded-[20px] border border-white/10"
          />
          <img
            src="/assets/mentorship-rob/web/austin-chat.webp"
            width={800}
            height={1320}
            alt="WhatsApp: Austin's message to Rob"
            loading="lazy"
            className="snap-start shrink-0 w-[72%] sm:w-auto rounded-[20px] border border-white/10"
          />
          <img
            src="/assets/mentorship-rob/web/aaron-video-breakdown.webp"
            width={800}
            height={1499}
            alt="WhatsApp: Rob's video breakdown for Aaron"
            loading="lazy"
            className="snap-start shrink-0 w-[72%] sm:w-auto rounded-[20px] border border-white/10"
          />
        </div>

        <P>
          You'll also get my complete <B>Master Bundle sample and preset collection</B> included for free. If you've already purchased it, I'll refund that purchase when you join.
        </P>

        <img src="/assets/mentorship-rob/web/master-bundle.webp" alt="The Master Bundle" width={840} height={840} loading="lazy" className="w-full max-w-[280px] mx-auto my-8 rounded-xl" />

        <H2>Real producers. Real progress.</H2>

        <P>The first cohort sold out, and one thing became very clear.</P>

        <P>The students who made the most progress weren't necessarily the ones with the most experience.</P>

        <P>
          <B>They were the ones who consistently showed up, submitted music, took feedback on board, and put it into practice.</B>
        </P>

        <P>That's why I've made creative repetition and accountability an even bigger part of Cohort 2.</P>

        <P>Here's what previous students have said:</P>

        <TestimonialVideo
          src="/assets/mentorship-rob/testimonial-griffin.mp4"
          poster="/assets/mentorship-rob/testimonial-griffin-poster.jpg"
          name="Griffin"
        />

        <TestimonialVideo
          src="/assets/mentorship-rob/testimonial-austin.mp4"
          poster="/assets/mentorship-rob/testimonial-austin-poster.jpg"
          name="Austin"
        />

        <TestimonialVideo
          src="/assets/mentorship-rob/testimonial-aaron.mp4"
          poster="/assets/mentorship-rob/testimonial-aaron-poster.jpg"
          name="Aaron"
        />

        <Quote name="Griffin">
          "Whether you're a beginner, at the intermediate level, or even a professional, Rob’s mentorship is an absolute no-brainer."
        </Quote>

        <Quote name="Austin">
          "So far it's been the most useful mentorship that I've done... and I've spent much more money on other programs that lasted much longer."
        </Quote>

        <Quote name="Austin">
          "The biggest change for me from the mentorship was realising that I'm really overcomplicating the whole process of making music. I’m shocked at how simple and effective Rob’s workflow was."
        </Quote>

        <H2>Is this mentorship right for you?</H2>

        <P>I'm keeping this group small because I want to work closely with producers who are serious about improving.</P>

        <H3>This mentorship WILL work for you if:</H3>

        <BulletList
          tone="green"
          items={[
            "You're ready to spend a few focused hours each week actually making music",
            "You want constructive feedback on your tracks and are prepared to put it into practice.",
            "You're open to trying new workflows, experimenting and pushing yourself creatively.",
            "You can attend the weekly live calls and keep up with your submissions.",
            "You want to develop skills and habits that will improve your music long after the six weeks are over.",
          ]}
        />

        <H3>This mentorship WON’T work for you if:</H3>

        <BulletList
          tone="red"
          items={[
            "You're looking for shortcuts, secret plugins or a magic formula for making great music.",
            "You don't have time to create and submit music consistently.",
            "You'd rather collect more tutorials than put what you've learned into practice.",
            "You don't need to be an advanced producer or have aspirations to work with major artists.",
          ]}
        />

        <H2>Everything included in your mentorship</H2>

        <P>
          <B>6 weeks. 12 producers. Direct mentorship from me, Rob Late.</B>
        </P>

        <BulletList
          tone="green"
          items={[
            <>
              <Strong>Private 1:1 onboarding call:</Strong> I'll review your music, identify where you need to improve, and help set your goals.
            </>,
            <>
              <Strong>Weekly personalised feedback:</Strong> Submit your music through the student portal and get direct feedback from me.
            </>,
            <>
              <Strong>Six weekly live group calls:</Strong> Sundays, 7:00–8:30 PM UK time, including live co-production, teaching and Q&A.
            </>,
            <>
              <Strong>Structured weekly assignments:</Strong> Create at least 20 songstarters, develop four ideas and finish your strongest track.
            </>,
            <>
              <Strong>Private WhatsApp community:</Strong> Ask questions, share work and connect with me and the other students.
            </>,
            <>
              <Strong>Production resources:</Strong> Access to session templates, reference material and sound libraries.
            </>,
            <>
              <Strong>The Master Bundle:</Strong> My full sample and preset collection, included at no extra cost.
            </>,
          ]}
        />

        <p className="text-[22px] font-bold text-white mt-8 mb-6" style={tightSpacing}>
          Your investment: $2,497
        </p>

        <div className="mb-4">
          <CtaButton />
        </div>

        <H2>How to apply</H2>

        <P>I'm only accepting 12 producers for Cohort 2 so I can give everyone the attention and feedback they need.</P>

        <P>Here's how to secure your place.</P>

        <P className="!mb-1">
          <B>STEP 1: Send your application:</B>
        </P>

        <P>Hit the button below and tell me about yourself, your goals and your current production experience. You'll also submit one of your existing tracks.</P>

        <P>It takes around five minutes, and there's nothing to pay at this stage.</P>

        <P className="!mb-1">
          <B>STEP 2: I'll review your music</B>
        </P>

        <P>I personally review every application within 72 hours. If I think we're a good fit, I'll offer you a place in the mentorship and send over the payment details.</P>

        <P className="!mb-1">
          <B>STEP 3: Secure your place</B>
        </P>

        <P>Once you've completed your payment, you'll get access to the student portal, your onboarding information and can book your private one-to-one call with me.</P>

        <P>Then we're ready to get to work.</P>

        <P>
          <B>
            Cohort 2 starts Sunday 15 November.
          </B>
        </P>

        <P>
          Applications close{" "}
          <B>
            Wednesday 11 November at 11:59 PM UK time
          </B>
          , or as soon as all 12 places are filled.
        </P>

        <div className="mt-8">
          <CtaButton id="apply" />
        </div>

        <P className="mt-10">See you inside.</P>

        <Signature className="mt-2 mb-4" />

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-xs text-white/30">Rob Late · roblate.com</p>
        </div>
      </div>
    </div>
  );
};

export default MentorshipRobVersion;
