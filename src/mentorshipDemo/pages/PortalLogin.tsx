import { useState } from "react";
import { ArrowRight } from "lucide-react";
import robWorking from "@/assets/rob-working-3-loop.mp4";
import "../login.css";
import { usePortalStore } from "../PortalStore";
import { PrimaryButton } from "../components/PortalUI";

export function PortalLogin() {
  const { login } = usePortalStore();
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState("");

  const openView = async (role: "student" | "coach") => {
    setOpening(true);
    setError("");
    try {
      await login(role === "coach" ? "rob@demo.com" : "jack@demo.com", "demo");
    } catch {
      setError("Couldn't open the preview. Please try again.");
      setOpening(false);
    }
  };

  return (
    <div className="mentorship-portal mp-login">
      <div className="mp-login-backdrop" aria-hidden="true">
        <video autoPlay muted loop playsInline tabIndex={-1} src={robWorking} className="mp-login-film" />
      </div>
      <div className="mp-grain mp-login-grain" aria-hidden="true" />
      <main className="mp-login-content">
        <header className="mp-login-brand">
          <div className="mp-login-identity">
            <div className="mp-login-portrait" style={{ background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}>
              <img src="/assets/rob-profile.jpg" alt="Rob Late" width={52} height={52} />
            </div>
            <span>ROB LATE'S</span>
          </div>
          <h1 className="mp-display mp-login-title"><span>PRODUCER</span><span>MENTORSHIP</span></h1>
        </header>
        <section className="mp-login-card" aria-labelledby="preview-heading">
          <div className="mp-login-card-heading">
            <h2 id="preview-heading">Take a look around</h2>
            <p>Choose a view to explore. No password needed.</p>
          </div>
          <div className="mp-login-form">
            <PrimaryButton onClick={() => void openView("coach")} disabled={opening} className="mp-login-submit">
              Rob's view <ArrowRight size={18} />
            </PrimaryButton>
            <button type="button" onClick={() => void openView("student")} disabled={opening} className="mp-focus-ring flex min-h-[50px] w-full items-center justify-center gap-3 rounded-[10px] border border-white/20 bg-white/5 px-5 py-3 text-[15px] font-bold text-white hover:bg-white/10 disabled:opacity-50">
              Student view <ArrowRight size={18} />
            </button>
            {error && <p role="alert" className="mp-login-error">{error}</p>}
          </div>
          <p className="mt-5 text-center text-xs leading-5 text-[#959d97]">Demo preview with example students. Use Switch view to explore both sides.</p>
        </section>
      </main>
    </div>
  );
}
