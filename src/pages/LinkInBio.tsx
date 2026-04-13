import { useEffect } from "react";
import robSignature from "/assets/rob-late-signature-white.png";

const robProfile = "/assets/rob-profile.jpg";

const links = [
  {
    title: "Work With Me 1-1",
    subtitle: "Mentorship for serious producers ready to level up",
    url: "https://audio.roblate.com/mentorship",
    thumbnail: "/assets/artist-sounds-identity.webp",
  },
  {
    title: "The Producer Blueprint",
    subtitle: "My complete music production course",
    url: "https://audio.roblate.com/producer-blueprint",
    thumbnail: "/assets/producer-blueprint-thumbnail.jpg",
  },
  {
    title: "Sound Packs & Presets",
    subtitle: "Serum presets, sample packs, and production tools",
    url: "https://roblate.com/collections/bestsellers",
    thumbnail: "/assets/sound-packs-thumbnail.png",
  },
  {
    title: "30 Ways in 30 Days",
    subtitle: "Free daily production tips straight to your inbox",
    url: "https://audio.roblate.com/30-ways",
    thumbnail: "/assets/rob-pov-studio-new.png",
  },
];

const LinkInBio = () => {
  useEffect(() => {
    document.title = "Rob Late";
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 relative overflow-hidden"
      style={{ backgroundColor: "#050505", paddingTop: "calc(env(safe-area-inset-top) + 2.5rem)", paddingBottom: "calc(env(safe-area-inset-bottom) + 2.5rem)" }}
    >
      {/* Monochrome glow effect */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(220, 220, 220, 0.14) 0%, rgba(200, 200, 200, 0.04) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(220, 220, 220, 0.08) 0%, transparent 60%)",
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
          className="w-24 h-24 rounded-full p-[2px] mb-5"
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
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-xl font-bold text-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            @roblate
          </span>
          <svg
            className="w-5 h-5 text-[#3897f0]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.7 14.5L6 12.2l1.4-1.4 2.9 2.9 6.3-6.3 1.4 1.4-7.7 7.7z" />
          </svg>
        </div>

        {/* Bio */}
        <p className="text-lg text-white/90 mb-1.5">
          Producer, Writer & Sound Designer
        </p>

        {/* Enquiries */}
        <p className="text-sm text-white/30 mb-4 tracking-wider">
          Enquiries: info@roblate.com
        </p>

        {/* Social links */}
        <div className="flex items-center gap-5 mb-7">
          {/* YouTube */}
          <a
            href="https://www.youtube.com/roblate"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.7 31.7 0 0 0 0 12a31.7 31.7 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.7 31.7 0 0 0 24 12a31.7 31.7 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
            </svg>
          </a>
          {/* Instagram */}
          <a
            href="https://www.instagram.com/roblate"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          {/* TikTok */}
          <a
            href="https://www.tiktok.com/@roblate"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.27 8.27 0 0 0 4.85 1.56V7.17a4.85 4.85 0 0 1-1.09-.48z" />
            </svg>
          </a>
        </div>

        {/* Section header */}
        <p
          className="text-lg font-bold text-white mb-4"
          style={{ letterSpacing: "-0.03em" }}
        >
          How I Can Help You:
        </p>

        {/* Links */}
        <div className="w-full max-w-lg flex flex-col gap-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full rounded-2xl border border-white/10 bg-[hsl(0_0%_7%)] transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30 hover:border-white/15 p-4 gap-5"
            >
              {/* Thumbnail */}
              <div className="w-[68px] h-[68px] rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                <img
                  src={link.thumbnail}
                  alt={link.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <span
                  className="text-lg font-bold text-white leading-tight block"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {link.title}
                </span>
                <p className="text-sm text-white/60 mt-1 leading-snug">
                  {link.subtitle}
                </p>
              </div>

              {/* Arrow */}
              <svg
                className="w-5 h-5 text-white/15 flex-shrink-0"
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
        <div className="mt-12 opacity-90">
          <img
            src={robSignature}
            alt="Rob Late"
            className="h-12 w-auto"
          />
        </div>

        {/* Footer */}
        <p className="text-xs text-white/40 mt-5 tracking-wider">
          roblate.com
        </p>
      </div>
    </div>
  );
};

export default LinkInBio;
