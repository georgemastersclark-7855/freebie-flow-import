import { useState } from "react";
import { loadKlaviyo } from "@/utils/loadKlaviyo";

const ThirtyWays = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);

    loadKlaviyo();
    window._learnq = window._learnq || [];
    window._learnq.push([
      "identify",
      { $email: email, source: "30_ways_squeeze" },
    ]);
    window._learnq.push([
      "track",
      "Newsletter Signup",
      { source: "30_ways_squeeze" },
    ]);

    await new Promise((r) => setTimeout(r, 800));
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
              One tip a day for 30 days. Straight from the studio. No fluff.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-base placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black font-bold text-base px-8 py-4 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 flex-shrink-0"
                style={{ letterSpacing: "-0.02em" }}
              >
                {loading ? "..." : "Send me the tips"}
              </button>
            </form>

            {/* Trust line */}
            <p className="text-xs text-white/20">
              Free. Unsubscribe any time. No spam, obviously.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ThirtyWays;
