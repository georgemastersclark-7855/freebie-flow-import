import { useState } from "react";
import { loadKlaviyo } from "@/utils/loadKlaviyo";
import robSignature from "/assets/rob-late-signature-white.png";

const robProfile = "/assets/rob-profile.jpg";

const KLAVIYO_LIST_ID = "TU9xTM";
const KLAVIYO_COMPANY_ID = "WrvxHn";
const DEFAULT_SOURCE = "production-emails-page";

const getCustomSource = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("utm_source") || DEFAULT_SOURCE;
};

const ProductionEmails = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);

    const customSource = getCustomSource();

    // Identify in Klaviyo
    loadKlaviyo();
    window._learnq = window._learnq || [];
    window._learnq.push([
      "identify",
      {
        $email: email,
        source: customSource,
      },
    ]);
    window._learnq.push([
      "track",
      "Newsletter Signup",
      { source: customSource },
    ]);

    // Subscribe to Klaviyo list
    try {
      await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", revision: "2024-02-15" },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              profile: {
                data: {
                  type: "profile",
                  attributes: {
                    email,
                    properties: { source: customSource },
                  },
                },
              },
              list_id: KLAVIYO_LIST_ID,
              custom_source: customSource,
            },
          },
        }),
      });
    } catch (err) {
      console.error("Klaviyo subscribe error:", err);
    }

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ backgroundColor: "#050505" }}
    >
      {/* Subtle glow */}
      <div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(34, 197, 94, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />

      <div className="relative z-10 w-full max-w-md text-center">
        {submitted ? (
          <div>
            <p
              className="text-3xl font-bold text-white mb-3"
              style={{ letterSpacing: "-0.03em" }}
            >
              You're in.
            </p>
            <p className="text-white/50 text-base leading-relaxed">
              Your first email is on its way - go check your inbox (and drag it out of promotions if it landed there).
            </p>
          </div>
        ) : (
          <>
            {/* IG-style identity */}
            <div className="flex flex-col items-center mb-5">
              <div
                className="w-16 h-16 rounded-full p-[2px] mb-3"
                style={{
                  background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#050505]">
                  <img src={robProfile} alt="Rob Late" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
                  @roblate
                </span>
                <svg className="w-3.5 h-3.5 text-[#3897f0]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.7 14.5L6 12.2l1.4-1.4 2.9 2.9 6.3-6.3 1.4 1.4-7.7 7.7z" />
                </svg>
              </div>
            </div>

            {/* Eyebrow */}
            <div className="inline-block mb-4">
              <span className="text-xs font-semibold tracking-widest text-white/30 uppercase">
                Free Emails From Rob Late
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ letterSpacing: "-0.04em" }}
            >
              Rob's Production Emails
            </h1>

            {/* Promise */}
            <p className="text-base text-white/60 mb-6 leading-relaxed">
              Stories from real sessions, honest thoughts on the industry and useful lessons for producers on the come up - from someone who started in (and still is in) a home studio.
            </p>

            {/* Bullets */}
            <ul className="flex flex-col gap-2 text-left mb-6 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <span className="text-[#22c55e] mt-0.5">•</span>
                <span>Real lessons from real sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22c55e] mt-0.5">•</span>
                <span>Mindset and career stuff you won't find anywhere else on the internet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22c55e] mt-0.5">•</span>
                <span>Cool production hacks & techniques I've picked up from even cooler artists</span>
              </li>
            </ul>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-base placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-bold text-base px-8 py-4 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
                style={{ letterSpacing: "-0.02em" }}
              >
                {loading ? "..." : "GET THE EMAILS"}
              </button>
            </form>

            {/* Signature */}
            <div className="mb-4">
              <img src={robSignature} alt="Rob Late" className="h-10 w-auto opacity-70 mx-auto" />
            </div>

            {/* Trust line */}
            <p className="text-xs text-white/20 mb-8">
              Free. Unsubscribe any time.
            </p>

            {/* Reply screenshots */}
            <div className="flex flex-col gap-2">
              {["reply-1", "reply-2", "reply-3"].map((name) => (
                <div
                  key={name}
                  className="bg-white rounded-none p-2 shadow-lg shadow-black/30 w-full max-w-full"
                  style={{ display: "none" }}
                >
                  <img
                    src={`/replies/${name}.png`}
                    alt="Reply from a subscriber"
                    onLoad={(e) => {
                      const card = e.currentTarget.parentElement;
                      if (card) card.style.display = "";
                    }}
                    className="w-full h-auto rounded-none block"
                    onError={(e) => {
                      const card = e.currentTarget.parentElement;
                      if (card) card.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductionEmails;
