import { useEffect, type ReactNode } from "react";
const robSignature = "/assets/mentorship-draft/rob-signature-bold.png";

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
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) => (
  <figure className={`mx-auto ${className} max-w-[340px]`}>
    <img
      src={src}
      alt={alt}
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
    className="inline-block px-8 py-3.5 bg-white text-[#050505] font-bold text-sm rounded-lg hover:bg-white/90 transition-colors"
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

const PhotoWide = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => (
  <img
    src={src}
    alt={alt}
    className={`w-full aspect-[16/10] object-cover rounded-xl my-8 border border-white/10 ${className}`.trim()}
  />
);

const PhotoPair = ({
  items,
}: {
  items: { src: string; caption: string; className?: string }[];
}) => (
  <div className="grid grid-cols-2 gap-3 my-8">
    {items.map((item) => (
      <figure key={item.src}>
        <img
          src={item.src}
          alt={item.caption}
          className={`w-full aspect-[4/5] object-cover rounded-xl border border-white/10 ${item.className ?? ""}`.trim()}
        />
        <figcaption className="text-[13px] text-white/45 mt-2">{item.caption}</figcaption>
      </figure>
    ))}
  </div>
);

const Signature = ({ className }: { className: string }) => (
  <div className={className}>
    <img src={robSignature} alt="Rob Late" className="h-16 sm:h-20 w-auto" />
  </div>
);

const VideoBlock = () => (
  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black my-10 ring-1 ring-white/20 shadow-2xl shadow-black/70">
    <img src="/assets/mentorship-draft/video-thumb.jpg" alt="Rob on camera" className="w-full h-full object-cover" />
    <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent" />
    <div className="absolute inset-0 grid place-items-center">
      <div className="w-[76px] h-[76px] rounded-full bg-white/25 backdrop-blur-md border border-white/50 grid place-items-center shadow-xl">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="text-white ml-1" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
    <div className="absolute inset-x-4 bottom-3 flex items-center gap-3">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white/90 shrink-0" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
      </svg>
      <div className="h-1 flex-1 rounded-full bg-white/30" />
    </div>
  </div>
);

/* Seat counter: show the original availability crossed out beside the remaining seats. */
const SEATS_TOTAL = 12;
const SEATS_LEFT = 11;

/* ---------- Page ---------- */

const MentorshipCohort2Draft = () => {
  useEffect(() => {
    document.title = "Rob Late - Producer Mentorship";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    return () => {
      robots.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white/90">
      <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-14 font-sans">
        {/* IG-style header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-full p-[2px] mb-3" style={{
            background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)"
          }}>
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#050505]">
              <img src={robProfile} alt="Rob Late" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-white" style={{ letterSpacing: "-0.02em" }}>@roblate</span>
            <svg className="w-3.5 h-3.5 text-[#3897f0]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.7 14.5L6 12.2l1.4-1.4 2.9 2.9 6.3-6.3 1.4 1.4-7.7 7.7z" />
            </svg>
          </div>
        </div>

        {/* Stamp */}
        <p className="text-xs text-white/30 mb-3 tracking-wider">Updated: 17th October 2026</p>

        {/* Banner */}
        <div className="mb-6 space-y-2">
          <p className="flex flex-wrap items-baseline gap-x-1.5 text-[17px] leading-snug font-bold text-white" style={tightSpacing}>
            <span className="line-through decoration-2 text-white/40">{SEATS_TOTAL} seats available</span>
            <span className="text-[#22c55e]">{SEATS_LEFT} remaining</span>
          </p>
          <p className="text-[13px] leading-relaxed text-white/65">
            Applications close 29 October, or sooner if full.
          </p>
          <p className="text-[13px] leading-relaxed font-medium text-white/80">First cohort sold out.</p>
        </div>
        <div className="mb-4">
          <CtaButton />
        </div>

        <VideoBlock />

        <P>Here's what we're doing in the mentorship.</P>

        <P>I'm taking on 12 producers and running their productions like an A-list writing camp for six weeks.</P>



        <Big>Finish better music, faster.</Big>

        <P className="-mt-4 text-white font-semibold">In a session with an artist or on your own releases.</P>

        <P>By the end, you’ll have:</P>
        <ul className="space-y-3 mb-6">
          {["Four new songs, each written to the first chorus or drop, with my feedback on every one", "20+ ideas to play to artists in sessions, or build your own tracks from", "Your best song taken all the way to a finished track"].map((item) => (
            <li key={item} className="flex items-start gap-3 text-[16px] leading-[1.6] text-white/80">
              <span className="mt-[0.55em] w-1.5 h-1.5 rounded-full shrink-0 bg-[#22c55e]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>


        <P><strong className="text-white font-semibold">Produce. Finish. Move on to the next idea.</strong></P>

        <P>Everything’s below: how it works, who it’s for and what we’ll do together. Have a read and apply at the bottom when you’re ready.</P>

        <Signature className="mt-8 mb-4" />

        <figure className="my-10">
          <img
            src="/assets/mentorship-draft/live-call-gallery.jpg"
            alt="Zoom call with Rob and the cohort 1 producers, Ableton on screen"
            className="w-full rounded-2xl border border-white/10"
          />
        </figure>





        <P>When I work with big artists, we often have multiple studios running in one building.</P>

        <PhotoWide src="/assets/rob-writing-session.jpg" alt="Rob in a session" className="object-[center_30%]" />

        <P>
          <Strong>One song goes in, another comes out.</Strong>
        </P>

        <P>
          Big artists and labels don’t just choose producers with good technical skills. They need to know you’re capable of working fast.
        </P>

        <P>
          In those sessions, we write from the intro to the first chorus or drop. That’s enough for the artist to hear where it’s going and decide whether to take it further.
        </P>




        <P>
          A huge part of this for me has been turning up to sessions with 30 or 40 ideas in a folder. Little loops, interesting sounds, a hook. I’d play them to the artists and writers until someone caught a vibe and started writing over the top.
        </P>

        <P>
          That loop became the song we all built together. My production was already in it, so my credit was in the bag. And it left room for everyone else to put their stamp on it, instead of me walking in with a song that’s almost finished.
        </P>

        <P>
          That’s an asset I want you building too. Ideas ready to take into sessions with artists, or pull from when you’re making your own music.
        </P>

        <Receipt
          src="/assets/mentorship-draft/rob-reps-folders.png"
          alt="WhatsApp: Rob shares his Ableton project folders with cohort 1"
        />


        <P>My first mentorship sold out fast, and the results told me everything. The students who submitted the most music and used my feedback improved the most. The ones who overanalysed improved the least.</P>

        <P>So for this next cohort, everyone's doing the reps.</P>

        <P>If you’ve got ten in you, I want ten.</P>


        <H2>Why listen to me?</H2>

        <P>
          I've spent the last few years writing and producing for artists like The Chainsmokers, Marshmello, Macklemore, Clean Bandit and many others. I've also built a successful digital product business, gained sponsorships from the biggest music brands in the world and built a global audience.
        </P>

        <PhotoPair
          items={[
            { src: "/assets/rob-chainsmokers.jpg", caption: "With The Chainsmokers", className: "object-top" },
            { src: "/assets/rob-marshmello.jpg", caption: "With Marshmello" },
          ]}
        />




        <Quote name="Griffin">
          "Whether you're at the beginner level, the intermediate level, even at the professional level, it's an absolute no-brainer."
        </Quote>

        <Quote name="Austin">
          "So far it's been the most useful mentorship that I've done... and I've spent much more money on other programs that lasted much longer."
        </Quote>

        <P>
          This cohort will be a small group so I'm only looking for serious producers that will be the best fit for mentoring.
        </P>

        <H2>This mentorship WON’T work for you if:</H2>

        <BulletList
          tone="red"
          items={[
            "You have the budget, but you can’t find the time each week to show up and work hard.",
            "You can't attend the live calls each week.",
            "You think there’s a simple ‘producer hack’ that will magically make you a better producer.",
            "You’re planning to file this next to the 400 tutorials you've saved for later.",
          ]}
        />

        <H2>This mentorship WILL work for you if:</H2>

        <BulletList
          tone="green"
          items={[
            "You can take hard constructive criticism about your music and listen to feedback.",
            "You’re ready to submit work every Friday and put that feedback into your music.",
            "You can give this at least a few focused hours per week.",
            "You understand that progress requires self-motivation and dedication.",
          ]}
        />

        <P>
          <Strong>If you can do all of the above, you WILL be a better producer at the end of this.</Strong>
        </P>


        <Quote name="Austin">
          "The biggest change for me from the mentorship was realising that I'm really overcomplicating the whole process of making music. I’m shocked at how simple and effective Rob’s workflow was."
        </Quote>

        <Receipt
          src="/assets/mentorship-draft/austin-chat.png"
          alt="WhatsApp: Austin's message to Rob in the cohort 1 group chat"
        />


        <H2>The plan is simple:</H2>

        <H3>Phase 1: <em>Set up like a pro, then work (week 1)</em></H3>

        <P>
          Before week one, you get a 1:1 call with me. Play me your music. I’ll figure out what’s holding you back and tell you where to focus your efforts. Then we’ll hold you accountable to it throughout the mentorship.
        </P>

        <P>
          We’ll check your session template, reference playlist, sound library and stem exports so you’re ready to work quickly. You'll also get my complete sample pack ‘The Master Bundle’ included (already bought it? Once you’re in, I’ll refund what you paid for it).
        </P>

        <img src="/assets/master-bundle.webp" alt="The Master Bundle" className="w-full max-w-[340px] mx-auto my-8 rounded-xl" />

        <P>
          Then we attack song structure and dive into the commercial song format that every professional session needs.
        </P>

        <P>
          By the end of week one, your setup’s been checked against mine, you’ve started five ideas and you’ll have your first song written to the chorus.
        </P>

        <H3>Phase 2: <em>Doing the reps (weeks 2 to 4)</em></H3>

        <P>
          Each week, you’ll make five fresh song starters minimum and develop your favourite in that same structure. Every Friday, you’ll submit your starters, your developed song and its multitrack stems.
        </P>

        <P>
          Every Sunday we're live for 90 minutes. This is where I open selected submissions and operate on them in front of everyone. You watch exactly how I think inside real projects, alongside teaching around topics the group needs and Q&A to help you get unstuck.
        </P>

        <figure className="my-10">
          <img
            src="/assets/mentorship-draft/live-call-rob-ableton.jpg"
            alt="Rob inside a project on a cohort 1 call, students on Zoom down the side"
            className="w-full rounded-2xl border border-white/10"
            loading="lazy"
          />
        </figure>

        <Receipt
          src="/assets/mentorship-draft/rob-stems-surgery.png"
          alt="WhatsApp: Rob asks a cohort 1 student for stems to work on live"
        />

        <P>Your weekly song gets my personal feedback whether or not it's one of the projects I open on that Sunday's call.</P>

        <P>
          Where it helps explain what we’re working on, I'll also open my actual major-label projects and show you how finished records came from rough ideas that started exactly like yours.
        </P>

        <Receipt
          src="/assets/mentorship-draft/rob-project-sunday.png"
          alt="WhatsApp: Rob offers to open a project on the Sunday call"
        />


        <P>
          By the end of week four, you’ll have 20+ ideas in your folder and four songs written to the first chorus or drop, each one with my feedback on it.
        </P>

        <H3>Phase 3: <em>Finish (weeks 5 and 6)</em></H3>

        <P>
          We take your best track and dedicate the final two weeks to finishing it. I'll show you how I turn an initial idea into a full record.
        </P>



        <P>
          Do the reps and you’ll finish with 20+ ideas, four songs to the chorus/drop, and your best one built out into a full, finished track. Plus a process you can run on every track you make after this.
        </P>

        <P>Between calls, you’re in the WhatsApp group with me and the other producers.</P>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 my-10 items-start">
          <Receipt
            src="/assets/mentorship-draft/aaron-video-breakdown.png"
            alt="WhatsApp: Rob sends Aaron a video breakdown of his drums"
            className="my-0"
          />
          <figure className="mx-auto my-0 max-w-[340px]">
            <video
              src="/assets/mentorship-draft/rob-voice-notes.mp4"
              poster="/assets/mentorship-draft/rob-voice-notes-poster.jpg"
              controls
              playsInline
              preload="metadata"
              className="w-full rounded-[28px] border border-white/10 shadow-2xl shadow-black/60 bg-black"
            />
            <figcaption className="text-[13px] text-white/45 text-center mt-3 leading-snug">Sound on.</figcaption>
          </figure>
        </div>



        <P>
          I only want people in this group that have the dedication to level up their approach to producing. If it’s not the right time for you, I'll tell you what to work on first.
        </P>

        <H2>The quick facts:</H2>

        <BulletList
          tone="green"
          items={[
            <>
              <Strong>12 producers, 6 weeks.</Strong> Sunday 1 November to Sunday 6 December 2026.
            </>,
            <>
              <Strong>A 1:1 call with me to review your music.</Strong> Before we start, I’ll pinpoint exactly what’s holding your tracks back and what to focus on first.
            </>,
            <>
              <Strong>Live with me every Sunday,</Strong> 7pm to 8:30pm UK time (GMT). A lesson built around what the group needs, then I open up selected tracks and produce on them live.
            </>,
            <>
              <Strong>My personal feedback on every song you submit.</Strong> What needs work, why, and what to do next.
            </>,
            <>
              <Strong>Private WhatsApp group with me and the other producers.</Strong> Ask me anything between calls.
            </>,
            <>
              <Strong>The Master Bundle</Strong> included.
            </>,
            <>
              <Strong>You leave with</Strong> 20+ ideas, four songs written to the first chorus or drop, and your best one finished as a full track.
            </>,
            <>
              <Strong>Price:</Strong> $2,497
            </>,
          ]}
        />

        <P>
          We kick off Sunday 1 November at 7pm UK time (GMT). If you’re ready for this:
        </P>

        <P>
          <Strong>Step 1:</Strong> Hit apply and fill out the application. It takes about 5 minutes. Submit your best existing track, tell me your goals and your commitment level. There's nothing to pay when you apply.
        </P>

        <P>
          <Strong>Step 2:</Strong> I review every application personally within 72 hours. If you're a good fit, I'll offer you a place and send you the payment link.
        </P>

        <P>
          <Strong>Step 3:</Strong> Secure your place with the full payment. Once your payment goes through, you can book your 1:1 onboarding call with me.
        </P>

        <div className="mt-8">
          <CtaButton id="apply" />
        </div>

        <P className="mt-6">
          Doors close Thursday 29 October at 11:59pm UK time (GMT) or when the 12 seats are gone. Whichever comes first.
        </P>

        <Signature className="mt-10" />

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-xs text-white/30">Rob Late · roblate.com</p>
        </div>
      </div>
    </div>
  );
};

export default MentorshipCohort2Draft;
