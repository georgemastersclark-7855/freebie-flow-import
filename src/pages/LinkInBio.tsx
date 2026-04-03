import robSignature from "/assets/rob-late-signature-white.png";

const robProfile = "/assets/rob-profile.jpg";

const links = [
  {
    title: "Sound Packs & Presets",
    subtitle: "Serum presets, sample packs, and production tools",
    url: "https://roblate.com/collections/bestsellers",
    thumbnail: "/assets/sound-packs-thumbnail.png",
  },
  {
    title: "The Producer Blueprint",
    subtitle: "My complete music production course for home studio producers",
    url: "https://audio.roblate.com/producer-blueprint",
    thumbnail: "/assets/producer-blueprint-thumbnail.jpg",
  },
  {
    title: "Work With Me 1-1",
    subtitle: "Mentorship for serious producers ready to level up",
    url: "https://audio.roblate.com/mentorship",
    thumbnail: "/assets/artist-sounds-identity.webp",
  },
];

const LinkInBio = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-10 relative overflow-hidden"
      style={{ backgroundColor: "#050505" }}
    >
      {/* Monochrome glow effect */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(220, 220, 220, 0.18) 0%, rgba(200, 200, 200, 0.06) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(220, 220, 220, 0.1) 0%, transparent 60%)",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Profile picture */}
        <div
          className="w-20 h-20 rounded-full p-[2px] mb-4"
          style={{
            background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
          }}
        >
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#050505]">
            <img
              src={robProfile}
              alt="Rob Late"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Handle with verified badge */}
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className="text-lg font-bold text-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            @roblate
          </span>
          <svg
            className="w-4 h-4 text-[#3897f0]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.7 14.5L6 12.2l1.4-1.4 2.9 2.9 6.3-6.3 1.4 1.4-7.7 7.7z" />
          </svg>
        </div>

        {/* Bio */}
        <p className="text-base text-white/90 mb-1">
          Producer, Writer, & Sound Designer
        </p>

        {/* Enquiries */}
        <p className="text-xs text-white/30 mb-3 tracking-wider">
          Enquiries: info@roblate.com
        </p>

        {/* Social links */}
        <div className="flex items-center gap-4 mb-6">
          {/* YouTube */}
          <a
            href="https://youtube.com/@robl8"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
            </svg>
          </a>
          {/* TikTok */}
          <a
            href="https://tiktok.com/@robl8"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.27 8.27 0 0 0 4.85 1.56V7.17a4.85 4.85 0 0 1-1.09-.48z" />
            </svg>
          </a>
          {/* Email */}
          <a
            href="mailto:info@roblate.com"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0-8.25 5.69a2.25 2.25 0 0 1-2.5 0L2.25 6.75" />
            </svg>
          </a>
        </div>

        {/* Section header */}
        <p
          className="text-base font-bold text-white mb-5"
          style={{ letterSpacing: "-0.03em" }}
        >
          How I Can Help You:
        </p>

        {/* Links */}
        <div className="w-full max-w-md flex flex-col gap-3">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full rounded-2xl border border-white/10 bg-[hsl(0_0%_7%)] transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30 hover:border-white/15 p-3 gap-4"
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                <img
                  src={link.thumbnail}
                  alt={link.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <span
                  className="text-base font-bold text-white leading-tight block"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {link.title}
                </span>
                <p className="text-xs text-white/60 mt-0.5 leading-snug">
                  {link.subtitle}
                </p>
              </div>

              {/* Arrow */}
              <svg
                className="w-4 h-4 text-white/15 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          ))}
        </div>

        {/* Signature */}
        <div className="mt-10 opacity-90">
          <img
            src={robSignature}
            alt="Rob Late"
            className="h-10 w-auto"
          />
        </div>

        {/* Footer */}
        <p className="text-[10px] text-white/40 mt-4 tracking-wider">
          roblate.com
        </p>
      </div>
    </div>
  );
};

export default LinkInBio;
