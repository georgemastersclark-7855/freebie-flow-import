import { useEffect } from "react";
import robSignature from "/assets/rob-late-signature-white.png";

const robProfile = "/assets/rob-profile.jpg";

const MentorshipSeptember = () => {
  useEffect(() => {
    document.title = "Rob Late - Producer Mentorship (September 2026)";
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white/90">
      <div className="max-w-2xl mx-auto px-6 py-16 font-sans">
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
        <p className="text-xs text-white/30 mb-3 tracking-wider">Updated: 27th August 2026</p>

        {/* Banner */}
        <p className="text-base font-bold text-white mb-6">
          September 2026 cohort. <span className="text-[#22c55e]">10 seats.</span> Applications close Friday 11th September - or until every seat is taken. <span className="text-[#22c55e]">First cohort sold out.</span>
        </p>
        <a href="#apply" className="inline-block px-8 py-3 bg-white text-[#050505] font-bold text-sm rounded-lg hover:bg-white/90 transition-colors mb-20" style={{ letterSpacing: "-0.02em" }}>APPLY FOR THE SEPTEMBER COHORT</a>

        {/* Intro - one flowing letter from Rob */}
        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Here's what we're doing this September.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          I'm taking 10 producers and running their production like an a-list writing camp for six weeks.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          A new track written every single week. My feedback on every one of them. Your best one finished by the end.
        </p>

        <p className="text-white font-bold text-xl mb-6" style={{ letterSpacing: "-0.02em" }}>
          Write. Finish. Ship.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Let me tell you why it's built like this.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          When I worked with Marshmello, we had three studios running in one building. A singer writing toplines in one room. Me producing the track next door. Final takes going down in the third. One song goes in, another comes out. Nobody obsessing. Everyone committing.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          That work rate is the actual job. The producer who can land the core of a song in the room, that day, is the one who gets the cut.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Earlier this year I ran my first mentorship. Sold out. And the results told me everything. The student who wrote and submitted a new track every single week improved more than everyone else. By miles. He did the reps, I corrected them, week after week. That was the whole difference.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          So this time, everyone's doing the reps.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          This page shows you how the six weeks work, who it's for, and what we'll do together. Have a read, and apply at the bottom.
        </p>

        {/* Signature */}
        <div className="mb-16">
          <img src={robSignature} alt="Rob Late" className="h-10 w-auto opacity-70" />
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* Why listen to me? */}
        <p className="text-lg font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          Why listen to me?
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-8">
          I've spent the last few years writing and producing for artists like The Chainsmokers, Marshmello, Macklemore, Clean Bandit and others. I've built a successful business selling digital products, gained sponsorships from the biggest music brands in the world and built a global audience in the process. The first cohort of this mentorship sold out, and here's what the people in it said:
        </p>

        <div className="border-l-2 border-[#22c55e]/40 pl-6 mb-6">
          <p className="text-[15px] leading-relaxed text-white/70 italic">
            "Whether you're at the beginner level, the intermediate level, even at the professional level, it's an absolute no-brainer."
          </p>
          <p className="text-white/40 text-sm mt-2">Griffin, cohort 1</p>
        </div>

        <div className="border-l-2 border-[#22c55e]/40 pl-6 mb-8">
          <p className="text-[15px] leading-relaxed text-white/70 italic">
            "So far it's been the most useful mentorship that I've done... I've spent much more money on programs that lasted much longer."
          </p>
          <p className="text-white/40 text-sm mt-2">Austin, cohort 1</p>
        </div>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          It's a small group, and I'm looking for the best fit here.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* This won't work for you if you... */}
        <p className="text-lg font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          This won't work for you if you...
        </p>

        <ul className="space-y-4 mb-8">
          {[
            "Want to watch lessons and \"get round to it\". Every week you'll owe me a track.",
            "Can't be on the live Sunday calls.",
            "Want someone else to finish your music for you.",
            "Are planning to file this next to the 400 tutorials you've saved for later.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-red-400/80 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* But if you... */}
        <p className="text-lg font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          But if you...
        </p>

        <ul className="space-y-4 mb-6">
          {[
            "Can give this a few focused hours a week",
            "Will submit something every Friday, finished or not",
            "Can take a straight answer about your music",
            "Are done collecting information and want someone at this level correcting your actual work",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-white/40 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-[15px] leading-relaxed text-white/80 mb-8">
          ...this was built for you.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Because here's what I watched happen across the first cohort. Nobody's problem was technical knowledge. Not one person. Everyone arrives overcomplicating everything. Sitting on one idea for months. Polishing sections nobody will ever hear.
        </p>

        <div className="border-l-2 border-[#22c55e]/40 pl-6 mb-4">
          <p className="text-[15px] leading-relaxed text-white/70 italic">
            "The biggest change for me from the mentorship was realizing that I'm really overcomplicating the whole process of making music."
          </p>
          <p className="text-white/40 text-sm mt-2">Austin, cohort 1</p>
        </div>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          The thing that's missing is reps. Writing at pace, week after week, with someone telling you exactly what to fix each time. It's literally rehearsing the job.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          Quality comes from fast, deliberate repetitions with feedback. Six weeks of those will move you further than six years of tutorials. I've watched it happen.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* The plan is simple: */}
        <p className="text-lg font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
          The plan is simple:
        </p>

        <div className="mb-8">
          <p className="text-base font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
            Phase 1: Set up like a pro, then write (week 1)
          </p>
          <p className="text-[15px] leading-relaxed text-white/80 mb-4">
            The moment you're in, I send you a short set of videos. How I organise a sound library I trust. The session template I use for speed. How I actually use reference playlists. One evening's work and your studio runs the way mine does. No more scrolling through 4,000 kicks.
          </p>
          <p className="text-[15px] leading-relaxed text-white/80 mb-4">
            Then the first Sunday call. I show you the commercial song shape every professional session aims for, and you write your first track in it that same week.
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            That's Phase 1. A real track written in week one, on foundations most producers never build.
          </p>
        </div>

        <div className="mb-8">
          <p className="text-base font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
            Phase 2: The reps (weeks 2 to 4)
          </p>
          <p className="text-[15px] leading-relaxed text-white/80 mb-4">
            Every Friday, you submit a new track. Every Sunday we're live for 90 minutes, and I open submissions up and operate on them in front of everyone. You watch exactly how I think inside a real project. Send your stems with your submission and you're in the draw for me to open yours up that week.
          </p>
          <p className="text-[15px] leading-relaxed text-white/80 mb-4">
            I'll also open my actual major-label projects and show you how finished records came from rough ideas that started exactly like yours.
          </p>
          <p className="text-[15px] leading-relaxed text-white/80 mb-4">
            Around week 4, we flag your strongest track.
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            Three more tracks written. Every one with my feedback on it.
          </p>
        </div>

        <div className="mb-8">
          <p className="text-base font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
            Phase 3: Finish (weeks 5 and 6)
          </p>
          <p className="text-[15px] leading-relaxed text-white/80 mb-4">
            We take your best track and build it out. I'll show you how I turn a strong opening chorus into a full record. Then we finish it.
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            You leave with your best track done, a folder of session-ready ideas you'll be pulling from for years, and a process you can run on everything you make after this.
          </p>
        </div>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          And through all six weeks, you're in a private chat with me and the other nine. I'm in there every day. Stuck at 1am on a mix decision? Drop it in. No waiting a week for an answer. You'll start with a 1:1 call with me to map out your six weeks, and I'm throwing in the Master Bundle, so every sound I reach for is sitting in your library from day one.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* Price + guarantee, woven - no header */}
        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          It's $3,000, or two payments. Your first payment goes in with your application and holds your seat while I review it.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          Then: watch the videos, get your studio set up, come to the first call. If you get to the end of that call and it's not for you, tell me and I'll refund every penny. I only want people in this room who want to be in it. So there's nothing to lose by applying.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* QuickFacts */}
        <p className="text-lg font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
          The quick facts:
        </p>
        <ul className="space-y-3 mb-12">
          {[
            "10 seats",
            "Sunday 13th September to Sunday 18th October",
            "Live calls: Sundays, 90 minutes",
            "A new track from you every Friday",
            "$3,000 (2-pay available)",
            "Applications close Friday 11th September, or when seats are gone",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-white/40 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* So if you... */}
        <p className="text-lg font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
          So, if you...
        </p>
        <ol className="space-y-3 mb-8">
          {[
            "Can be on the live call every Sunday.",
            "Can put in a few focused hours during the week.",
            "Will submit a new track every Friday, finished or not.",
            "Want direct, honest feedback on your actual music.",
            "And you're doing this now. This six weeks. No \"catching up later\".",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-white/40 mt-0.5">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>

        <p className="text-[15px] leading-relaxed text-white/80 mb-8">
          We kick off Sunday 13th September. If that sounds like you:
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          <span className="text-white font-bold">Step 1:</span> Hit apply and fill out the application. It takes about 5 minutes. Your best existing track, your goal, and your commitment.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          <span className="text-white font-bold">Step 2:</span> I review every application personally within 72 hours. If you're in, everything unlocks immediately. If it's not the right fit, you get an instant full refund and I'll tell you what to work on first.
        </p>

        {/* CTA */}
        <a
          id="apply"
          href="#apply"
          className="inline-block px-8 py-3 bg-white text-[#050505] font-bold text-sm rounded-lg hover:bg-white/90 transition-colors"
          style={{ letterSpacing: "-0.02em" }}
        >
          APPLY FOR THE SEPTEMBER COHORT
        </a>

        <p className="text-[15px] leading-relaxed text-white/80 mt-6 mb-12">
          Doors close Friday 11th September or when the 10 seats are gone. Whichever comes first.
        </p>

        {/* Signature */}
        <div className="mb-12">
          <img src={robSignature} alt="Rob Late" className="h-10 w-auto opacity-70" />
        </div>

        <p className="text-[15px] leading-relaxed text-white/80">
          P.S. The moment you're accepted, the setup videos land in your inbox. My sound library system, my speed template, how I really use references. One night's work, and you'll be producing faster before we've even had the first call.
        </p>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-xs text-white/30">
            Rob Late · roblate.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentorshipSeptember;
