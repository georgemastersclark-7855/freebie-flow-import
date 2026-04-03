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

        {/* Updated date */}
        <p className="text-xs text-white/30 mb-8 tracking-wider">Updated: April 2026</p>

        {/* Opening letter with left border */}
        <div className="border-l-2 border-white/20 pl-6 mb-12">
          <p className="text-lg font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
            <span className="bg-[#297947]/30 text-white px-1">10 spots available.</span> This is the first cohort - I'm taking on 10 serious producers who want direct mentorship. I want your results and your testimonials. Once these spots are gone, price goes up. If this page is open, there is still a spot remaining.
          </p>

          <p className="text-[15px] leading-relaxed text-white/80 mb-4">
            I've been getting asked about mentorship for a while now. Rather than just doing one-off sessions, I've built something proper - a 6-week program where I work with a small group of producers directly.
          </p>

          <p className="text-[15px] leading-relaxed text-white/80 mb-4">
            I'm keeping it to 10 people so I can give everyone the attention they deserve. Here's exactly what it is, how it works, and whether it's right for you.
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
            "Personally listening to your tracks, telling you exactly what to fix and why, and working with you every week until your music sounds the way you hear it in your head",
            "Coaching you through developing your sound, production skills, and social media presence",
            "Bringing the experience of producing for The Chainsmokers, Marshmello and Clean Bandit directly to your music",
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
          I've spent the last few years producing for artists like The Chainsmokers, Marshmello and Clean Bandit. I've built a career doing exactly what you're trying to do - and I want to bring that experience directly to your music.
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
            You send your work. I listen properly. I tell you exactly what to fix and why. Specific, actionable notes on your mix, your arrangement, your sound design, your everything. Every single week for 6 weeks.
          </p>
        </div>

        {/* Group Calls */}
        <div className="mb-8">
          <p className="text-base font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            6 Weekly Group Calls (Live)
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            I teach production techniques live, open up projects from major tracks, and do Q&A on anything you're working through - music or career. You can bring any track you're working on. This is where you see how I think in real time.
          </p>
        </div>

        {/* Group Chat */}
        <div className="mb-8">
          <p className="text-base font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            Group Chat Access
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            Ask me questions anytime. I check in every day. No waiting a week for a reply. If you're stuck at 1am on a mix decision, drop it in the chat. I'll get to it. My business partner George is in there too. He runs all the ads and ecommerce for Rob Late Audio - so if you're selling sample packs or want to know how to actually market your music, he's the one to ask.
          </p>
        </div>

        {/* Your Cohort */}
        <div className="mb-12">
          <p className="text-base font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            Your Cohort
          </p>
          <p className="text-[15px] leading-relaxed text-white/80">
            You're grouped with other serious producers going through the program alongside you. People who are actually doing the work. Not lurkers. Not hobbyists. Producers who are here to level up.
          </p>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* How the 6 Weeks Work */}
        <p className="text-lg font-bold text-white mb-6" style={{ letterSpacing: "-0.02em" }}>
          How the 6 weeks work:
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          We start with where you are right now. I listen to your current work, identify the biggest gaps holding you back, and give you a clear focus.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Most producers try to improve everything at once. That's why they don't improve at all. I'll identify what's actually holding your sound back and we go after that first. Then we keep building from there.
        </p>

        <div className="border-l-2 border-white/10 pl-6 my-8">
          <p className="text-[15px] leading-relaxed text-white/60 italic">
            "Your low end is masking your kick, here's how to fix it."
          </p>
          <p className="text-[15px] leading-relaxed text-white/60 italic mt-2">
            "Your B section drops energy because it's got the same elements as your A."
          </p>
          <p className="text-[15px] leading-relaxed text-white/60 italic mt-2">
            "You need to focus on your drums right now - here's what you should be paying attention to..."
          </p>
        </div>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          That kind of feedback, every week, on your actual tracks.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          Then you go and work on it. Next week, you send me the updated version plus anything new. I listen again. We keep going for 6 weeks.
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-4">
          The other thing we'll work on is getting your music out there and building your profile. Whether that's dissecting what you're posting on Instagram and building your influence there, reaching out to artists or brands, or putting tracks on Spotify.
        </p>

        <p className="text-lg font-bold text-white mb-12" style={{ letterSpacing: "-0.02em" }}>
          Making music is half the job. Getting it heard is the other half - and most producers never figure that part out.
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
            "You can't commit 5-10 hours per week to production during the 6 weeks. This only works if you're actually producing.",
            "You're not open to feedback. I'm going to be honest about what needs fixing. That's what you're paying for.",
            "You expect guaranteed placements or success. Nobody can promise that - anyone who does is lying to you.",
            "You're brand new to production and haven't finished a track yet. This program is built around feedback on your work - you need to be at a level where you're actually making things I can give notes on.",
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
            "You want someone who's actually doing it at the highest level to listen to YOUR music and tell you what to fix.",
            "You're serious enough to commit 6 weeks of focused work. Not \"I'll try to find time\" - actually committed.",
            "You know your DAW. You've got a setup. You're past the basics. You need direction, not instruction.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-white/80">
              <span className="text-green-400/80 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-lg font-bold text-white mb-12" style={{ letterSpacing: "-0.02em" }}>
          By the end, you'll come out of the 6 weeks a different producer.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* Investment */}
        <p className="text-lg font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
          Investment:
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-2">
          <span className="text-white font-bold text-lg">$1,997</span>
          <span className="text-white/50 ml-2">for the full 6 weeks</span>
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-12">
          Or two payments of $1,097 (30 days apart) if you'd prefer to split it.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-white/10 mb-12" />

        {/* How to Apply */}
        <p className="text-lg font-bold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
          How to apply:
        </p>

        <p className="text-[15px] leading-relaxed text-white/80 mb-6">
          This is application-based. I don't take everyone who applies - I need to make sure you're a good fit and that I can actually help you. If you're not ready for the Mentorship yet, I'll tell you straight and point you in the right direction.
        </p>

        <ol className="space-y-3 mb-8">
          {[
            "Fill in a quick application below - takes a couple of minutes",
            "I'll review your application personally and get back to you",
            "If you're a fit, I'll get you set up. If you're not quite there yet, I'll tell you exactly what to work on first",
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
