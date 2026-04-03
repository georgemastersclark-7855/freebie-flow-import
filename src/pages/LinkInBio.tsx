import robSignature from "/assets/rob-late-signature-white.png";

const robProfile = "/assets/rob-profile.jpg";

// TODO: Replace thumbnails with proper images when available
const links = [
  {
    title: "Sound Packs & Presets",
    subtitle: "Serum presets, sample packs, and production tools",
    url: "https://roblate.com/collections/bestsellers",
    highlight: true,
    thumbnail: "/assets/master-bundle.webp",
  },
  {
    title: "The Producer Blueprint",
    subtitle: "Free training - how to build a career in music production",
    url: "https://audio.roblate.com/producer-blueprint",
    highlight: false,
    thumbnail: "/assets/producer-blueprint-thumbnail.jpg",
  },
  {
    title: "Work With Me 1-1",
    subtitle: "Mentorship for serious producers ready to level up",
    url: "https://audio.roblate.com/mentorship",
    highlight: false,
    thumbnail: "/assets/artist-sounds-identity.webp",
  },
];

const LinkInBio = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-10 relative overflow-hidden"
      style={{ backgroundColor: "#050505" }}
    >
      {/* Aurora glow effect - matches RLA brand */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(211, 255, 2, 0.08) 0%, rgba(211, 255, 2, 0.03) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(211, 255, 2, 0.04) 0%, transparent 60%)",
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
        <p className="text-base text-white/90 mb-5">
          Producer. Content Creator.
        </p>

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
              className={`flex items-center w-full rounded-2xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30 ${
                link.highlight
                  ? "border-[#D3FF02]/15 bg-[hsl(0_0%_8%)] shadow-lg shadow-black/20"
                  : "border-white/6 bg-[hsl(0_0%_7%)] hover:border-white/10"
              } p-3 gap-4`}
            >
              {/* Thumbnail */}
              <div
                className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${
                  link.highlight ? "bg-[#1a1a1a]" : "bg-white/5"
                }`}
              >
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
        <div className="mt-10 opacity-70">
          <img
            src={robSignature}
            alt="Rob Late"
            className="h-10 w-auto"
          />
        </div>

        {/* Footer */}
        <p className="text-[10px] text-white/15 mt-4 tracking-wider">
          roblate.com
        </p>
      </div>
    </div>
  );
};

export default LinkInBio;
