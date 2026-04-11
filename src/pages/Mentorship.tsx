import robSignature from "/assets/rob-late-signature-white.png";

const robProfile = "/assets/rob-profile.jpg";

const Mentorship = () => {
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

        {/* Cohort info */}
        <p className="text-sm font-semibold text-white/80 mb-8 tracking-wide">First cohort starting 27th April. 10 spots available.</p>

        {/* Opening letter with left border */}
        <div className="border-l-2 border-white/20 pl-6 mb-12">
          <p className="text-lg font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
            I'm taking on 10 serious producers for direct mentorship. This is the first cohort at a reduced price, once these spaces are gone the next group will be at full price.
          </p>

          <p className="text-[15px] leading-relaxed text-white/80 mb-4">
            I've been asked a lot about personalised mentorship for a long time now. Rather than pre-recorded courses and ad hoc Zoom sessions, I've been building something very special. A full 6-week program for serious producers.
          </p>

          <p className="text-[15px] leading-relaxed text-white/80 mb-4">
            I'm restricting this to only 10 people just to be sure that I can give everyone the attention they deserve.
          </p>

          <p className="text-[15px] leading-relaxed text-white/80 mb-4">
            Here's exactly what it is, how it works and whether it's right for you.
          </p>

          <p className="text-[15px] leading-relaxed text-white/80 mb-8">
            Have a read, and apply with the link at the bottom.
          </p>

          {/* Signature */}
          <div>
            <img src={robSignature} alt="Rob Late" className="h-10 w-auto opacity-70" />
          </div>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* What This Is */}
        <p className="text-lg font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          I'm going to work with you directly for 6 weeks to get your production to the level you've been chasing.
        </p>

        <ul className="space-y-3 mb-6">
          {[
            "Personally listening to your tracks, telling you exactly what to fix and why.",
            "Coaching you through developing your sound, production skills, and social media presence.",
            "Bringing the experience of producing for The Chainsmokers, Marshmello, Macklemore, Clean Bandit and more directly to your music",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-white/40 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          This is hands-on. Not a course. Not a community. Direct mentorship from someone who's doing it at the highest level.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* Why listen to me */}
        <p className="text-lg font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          Why listen to me?
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          I've spent the last few years writing and producing for artists like The Chainsmokers, Marshmello, Macklemore, Clean Bandit and others. I've built a successful business selling digital products, gained sponsorships from the biggest music brands in the world and I've built a global audience in the process. I've done this completely independently and I want to teach you exactly how I did it.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          I only take on people I'm confident I can help, so I'm looking for best-fit here.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* What You Get */}
        <p className="text-lg font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
          What you get:
        </p>

        {/* Weekly 1:1 */}
        <div className="mb-8">
          <p className="text-base font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            Weekly 1:1 Production Feedback
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            You send your work. I listen properly. I tell you exactly what to fix and why. Specific, actionable notes on your mix, your arrangement, your sound design, everything. Every single week for 6 weeks.
          </p>
        </div>

        {/* Group Calls */}
        <div className="mb-8">
          <p className="text-base font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            6 Weekly Group Calls (Live)
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            I teach production techniques live, open up projects from major tracks and do Q&A's on anything you're working through. Music or career advice. You can bring any track you're working on. This is where you see how I think in real time.
          </p>
        </div>

        {/* Group Chat */}
        <div className="mb-8">
          <p className="text-base font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            Group Chat Access
          </p>
          <p className="text-[15px] leading-relaxed text-white/80 mb-4">
            You'll be given access to a private WhatsApp group. You can ask me anything, anytime. I check in every day. No waiting a week for a reply. If you're stuck at 1am on a mix decision, drop it in the chat. Production, gear or marketing questions, nothing is off limits. Photos, videos, voice messages, this is where the real magic happens.
          </p>
          <p className="text-[15px] leading-relaxed text-white/80 mb-4">
            No overthinking, get instant advice and feedback. A direct line.
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            My business partner George is in there too. He runs all my ads and e-commerce for Rob Late Audio so if you're selling sample packs or have marketing questions, he's got your back.
          </p>
        </div>

        {/* Your Cohort */}
        <div className="mb-12">
          <p className="text-base font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            Your Cohort
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            You'll be grouped with other serious producers going through the program alongside you. People who are actually in the trenches doing the work. No time wasters, but real producers that are serious about improving their skills.
          </p>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* How the 6 Weeks Work */}
        <p className="text-lg font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
          How the 6 weeks work:
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          We start with a 1-1 Zoom call.. I listen to your current work, identify the biggest issues holding you back and give you a clear focus for the weeks ahead.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Most producers get overwhelmed trying to shortcut their way to improving everything at once. That's why they don't improve at all. I'll identify what's actually holding you back, then we keep building from there.
        </p>

        <div className="border-l-2 border-white/10 pl-6 my-8">
          <p className="text-[15px] leading-relaxed text-white/60 italic">
            "Your low end is ruining your mix, here's how to fix it."
          </p>
          <p className="text-[15px] leading-relaxed text-white/60 italic mt-2">
            "Your arrangement is losing energy, you need to try doing this instead.."
          </p>
          <p className="text-[15px] leading-relaxed text-white/60 italic mt-2">
            "You need to focus on your drums right now - here's what you should be paying attention to..."
          </p>
        </div>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          I'll give you useful, actionable feedback, every week. You learn what's important, what not to waste your time on, send me updates and this continues for 6 weeks.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          We'll also work on getting your music out there and building your profile. Whether that's dissecting what you're posting on social media to build your influence there, reaching out to artists or brands, or putting tracks on Spotify.
        </p>

        <p className="text-lg font-bold text-white mb-12" style={{ letterSpacing: "-0.02em" }}>
          Making music is half the job. Getting heard is the other half and most producers never figure that out.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          By the end of the program, you'll see a clear transformation in your approach to music production.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* Don't apply if */}
        <p className="text-lg font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          Don't apply if:
        </p>

        <ul className="space-y-4 mb-12">
          {[
            "You're looking for a magic pill. There's no shortcut that replaces putting in the hours. I'll show you exactly where to point those hours, but you still have to do the work.",
            "You can't commit the necessary hours per week to making music. This only works if you're actively producing.",
            "You're not open to constructive criticism. I'm going to be honest about what needs fixing. That's what you're paying for.",
            "You expect guaranteed placements or success. Nobody can promise that. Anyone who does is lying to you.",
            "You're brand new to production and haven't finished a track yet. This program is built around feedback on your work. You need to be at a level where you're actually making things that I can give notes on.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-red-400/80 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Do apply if */}
        <p className="text-lg font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          Do apply if:
        </p>

        <ul className="space-y-4 mb-6">
          {[
            "You want access to someone who's actually working at the highest level to listen to YOUR music and to tell you what to fix.",
            "You're serious enough to commit 6 weeks of focused work. Not \"I'll try to find time\". You must be committed.",
            "You know your DAW. You've got a setup. You're past the basics. You need direction, not instruction.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-green-400/80 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-lg font-bold text-white mb-12" style={{ letterSpacing: "-0.02em" }}>
          By the end, you'll come out of the 6 weeks a better producer.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* Investment */}
        <p className="text-lg font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
          Investment:
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          <span className="text-white font-bold text-lg">$1,997</span>
          <span className="text-white/50 ml-2">for the full 6 weeks</span>
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* How to Apply */}
        <p className="text-lg font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          How to apply:
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-6">
          This is application-based only. I don't take on everyone that applies. I need to make sure you're a good fit and that I can actually help you. If you're not ready for the mentorship yet, I'll tell you straight and point you in the right direction.
        </p>

        <ol className="space-y-3 mb-8">
          {[
            "Fill in a quick application below. This takes a couple of minutes.",
            "I'll review your application personally and get back to you.",
            "If we're a good fit, I'll get you set up. If you're not quite there yet, I'll tell you exactly what to work on first. But don't worry, there will be future cohorts for you to join when you're ready.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-white/40 mt-0.5 font-mono text-xs">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>

        {/* CTA */}
        <a
          href="https://form.typeform.com/to/EpLfx77a"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-white text-[#050505] font-bold text-sm rounded-lg hover:bg-white/90 transition-colors"
          style={{ letterSpacing: "-0.02em" }}
        >
          APPLY FOR THE MENTORSHIP
        </a>

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

export default Mentorship;
