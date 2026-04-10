import { useState } from "react";
import { loadKlaviyo } from "@/utils/loadKlaviyo";

const KLAVIYO_LIST_ID = "TUHS3v";
const KLAVIYO_COMPANY_ID = "WrvxHn";

const ThirtyWays = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);

    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ");

    // Identify in Klaviyo
    loadKlaviyo();
    window._learnq = window._learnq || [];
    window._learnq.push([
      "identify",
      {
        $email: email,
        $first_name: firstName || undefined,
        $last_name: lastName || undefined,
        source: "30_ways_squeeze",
      },
    ]);
    window._learnq.push([
      "track",
      "Newsletter Signup",
      { source: "30_ways_squeeze" },
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
                    first_name: firstName || undefined,
                    last_name: lastName || undefined,
                    properties: { source: "30_ways_squeeze" },
                  },
                },
              },
              list_id: KLAVIYO_LIST_ID,
              custom_source: "30 Ways Squeeze Page",
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
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
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
              You're in 🔥
            </p>
            <p className="text-white/50 text-base">
              Check your inbox. Day 1 is on its way.
            </p>
          </div>
        ) : (
          <>
            {/* Photo */}
            <div className="w-full max-w-sm mx-auto mb-8 rounded-2xl overflow-hidden border border-white/10">
              <img
                src="/assets/rob-marshmello-cropped.jpg"
                alt="Rob Late x Marshmello"
                className="w-full h-auto"
              />
            </div>

            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="text-xs font-semibold tracking-widest text-white/30 uppercase">
                Free - 30 Day Email Series
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ letterSpacing: "-0.04em" }}
            >
              30 Ways in 30 Days
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-white/60 mb-2 leading-relaxed">
              Level up your production game.
            </p>
            <p className="text-base text-white/40 mb-8 leading-relaxed">
              One lesson every day for 30 days. Straight from the studio.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-base placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors"
              />
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
                {loading ? "..." : "Send me the lessons"}
              </button>
            </form>

            {/* Trust line */}
            <p className="text-xs text-white/20">
              Free. Unsubscribe any time.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ThirtyWays;
