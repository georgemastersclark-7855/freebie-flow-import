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

        {/* Cohort banner */}
        <p className="text-base font-bold text-white mb-6">
          September 2026 cohort. <span className="text-[#22c55e]">10 seats.</span> Applications close Friday 11th September, or when every seat is taken. <span className="text-[#22c55e]">First cohort sold out.</span>
        </p>
        <a href="#apply" className="inline-block px-8 py-3 bg-white text-[#050505] font-bold text-sm rounded-lg hover:bg-white/90 transition-colors mb-20" style={{ letterSpacing: "-0.02em" }}>APPLY FOR THE SEPTEMBER COHORT</a>

        {/* Rob's letter - What this is */}
        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Most of my time is spent producing records with major artists. The Chainsmokers, Marshmello, Macklemore, Clean Bandit.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Those sessions all run the same way. Ideas out fast. The core of the song landing in the room that day. The producer who can do that is the one who gets the cut.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Earlier this year I ran my first mentorship. It sold out, and the results genuinely surprised me. The student who wrote and submitted a new track every single week improved more than everyone else. By miles. It had nothing to do with talent or gear. He just did the reps, and every week I corrected them.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          So this cohort is built entirely around that.
        </p>

        {/* Signature */}
        <div className="mb-16">
          <img src={robSignature} alt="Rob Late" className="h-10 w-auto opacity-70" />
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* The promise */}
        <p className="text-lg font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          I'm going to take 10 producers and run their production like an a-list writing camp for six weeks.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-6">
          A new track written every single week. My feedback on every one of them. Your best one finished by the end.
        </p>

        <p className="text-white font-bold text-xl mb-12" style={{ letterSpacing: "-0.02em" }}>
          Write. Finish. Ship.
        </p>

        {/* Three outcomes */}
        <ul className="space-y-3 mb-12">
          {[
            "Six new tracks written in six weeks, every one with my feedback on it",
            "A library of session-ready ideas and song-starters you'll pull from for years",
            "Your best track finished, plus the repeatable process that got it there",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-white/40 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* Why listen to me */}
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

        <div className="border-l-2 border-[#22c55e]/40 pl-6 mb-12">
          <p className="text-[15px] leading-relaxed text-white/70 italic">
            "So far it's been the most useful mentorship that I've done... I've spent much more money on programs that lasted much longer."
          </p>
          <p className="text-white/40 text-sm mt-2">Austin, cohort 1</p>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* This isn't for you if */}
        <p className="text-lg font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          This isn't for you if...
        </p>

        <ul className="space-y-4 mb-8">
          {[
            "You want to watch lessons and get round to it \"someday\". Every week you'll owe me a track.",
            "You can't be on the live Sunday calls.",
            "You want someone else to finish your music for you.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-red-400/80 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-base font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          But if you:
        </p>

        <ul className="space-y-4 mb-6">
          {[
            "Can give this a few focused hours a week",
            "Will submit something every Friday, finished or not",
            "Are done with tutorials and want someone at this level correcting your actual work",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-green-400/80 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          ...then keep reading, because this was designed for you.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* Why nothing's moved the needle yet */}
        <p className="text-lg font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          Why nothing's moved the needle yet
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          You've done what everyone does. Years of YouTube. Maybe a course or two. And your tracks still take months, and most never get finished.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Here's what I watched happen across cohort 1: the gap was never technical knowledge. Everyone arrives overcomplicating everything, sitting on one idea for months, polishing sections nobody will ever hear.
        </p>

        <div className="border-l-2 border-[#22c55e]/40 pl-6 mb-4">
          <p className="text-[15px] leading-relaxed text-white/70 italic">
            "The biggest change for me from the mentorship was realizing that I'm really overcomplicating the whole process of making music."
          </p>
          <p className="text-white/40 text-sm mt-2">Austin</p>
        </div>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          The thing you've never had is reps. Writing at pace, week after week, with someone who does this at the highest level telling you exactly what to fix each time. That's how every professional producer I know got good. It's literally rehearsing the job.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          Quality comes from fast, deliberate repetitions with feedback. Six weeks of them changes more than six years of tutorials.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* How the six weeks work */}
        <p className="text-lg font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
          How the six weeks work
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Every week, everyone writes and submits a new track in the same commercial shape. I'll teach you exactly what that shape is on call 1, and it's the same one I use in every professional session.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Submissions land on Fridays. On Sundays we're live for 90 minutes: I open up submissions and operate on them live, so you watch exactly how I think inside a real project, then I teach into whatever the group needs. Send your stems with your submission and you're in the draw for that week's live surgery.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          You'll also see inside my actual major-label projects, and how finished records came from rough ideas that started exactly like yours.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Weeks 1 to 4, you're writing a new track every week. Around week 4 we flag your strongest one. Weeks 5 and 6, we build it out and finish it.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          And the moment you pay, your pre-work unlocks: a short set of videos where I help you build a sound library you trust, a session template designed for speed, and a reference playlist. It's a night's work, and it means everyone walks into call 1 with the same foundations I take into every session.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* What you get */}
        <p className="text-lg font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
          What you get
        </p>

        <div className="mb-8">
          <p className="text-base font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            Six live group calls (Sundays, 90 minutes)
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            Live track surgeries first, then teaching built around what the group actually needs that week.
          </p>
        </div>

        <div className="mb-8">
          <p className="text-base font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            My feedback on every track, every week
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            You submit, I listen properly, I tell you exactly what to fix and why.
          </p>
        </div>

        <div className="mb-8">
          <p className="text-base font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            A private chat I'm in every day
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            Stuck at 1am on a mix decision? Drop it in. No waiting a week for answers.
          </p>
        </div>

        <div className="mb-8">
          <p className="text-base font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            Nine other serious producers doing the reps beside you
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            Same deadline every Friday, same goal, real accountability. This is half the value and the reason it's a cohort.
          </p>
        </div>

        <div className="mb-8">
          <p className="text-base font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            The pre-work foundations
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            Sound library, speed template, reference playlist. Yours before we even start.
          </p>
        </div>

        <div className="mb-12">
          <p className="text-base font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            The Master Bundle, included
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            Every sound I reach for, in your library from day one.
          </p>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* Price */}
        <p className="text-lg font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
          Price
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          <span className="text-white font-bold text-lg">$3,000.</span>
          <span className="text-white/50 ml-2">A 2-pay option is available.</span>
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          Six weeks of me inside your music, every single week.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* The guarantee */}
        <p className="text-lg font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          The guarantee
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          Do the pre-work and come to the first call. If you decide at the end of that call this isn't for you, tell me and I'll refund every penny. I only want people in this room who want to be in it.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* Quick facts */}
        <p className="text-lg font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
          Quick facts
        </p>

        <ul className="space-y-3 mb-12">
          {[
            "10 seats",
            "6 weeks: Sunday 13th September to Sunday 18th October",
            "Live calls: Sundays, 90 minutes",
            "A new track from you every Friday",
            "$3,000 (2-pay available)",
            "Applications close: Friday 11th September, or when seats are gone",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-white/40 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* Before you apply */}
        <p className="text-lg font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
          Before you apply - be honest with yourself
        </p>

        <ol className="space-y-3 mb-6">
          {[
            "I can be on the live call every Sunday.",
            "I can put in a few focused hours during the week.",
            "I will submit a new track every Friday, finished or not.",
            "I want direct, honest feedback on my actual music.",
            "I'm doing this now. This six weeks. Once it starts, there's no catching up later.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-white/40 mt-0.5">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          Ticked all five? Apply below.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* How to apply */}
        <p className="text-lg font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
          How to apply
        </p>

        <ol className="space-y-4 mb-12">
          {[
            "Hit the button and fill out the application. Takes about 5 minutes: your best existing track, your goal, and your commitment.",
            "Your first payment is taken with your application. That's what holds your seat while I review.",
            "I review every application personally within 72 hours. If you're in, your pre-work unlocks immediately and you'll book your 1:1 onboarding call with me. If it's not the right fit, you get an instant full refund and I'll tell you what to work on first.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-white/40 mt-0.5">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>

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
          P.S. The first applications accepted get first pick of the week 1 surgery slots. If you want me inside your track on day one, apply early.
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
