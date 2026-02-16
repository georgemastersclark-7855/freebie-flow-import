import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Simple Navbar */}
      <nav className="border-b border-zinc-900 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/producer-blueprint" className="text-white font-bold text-lg">
            The Producer Blueprint.
          </Link>
          <Link 
            to="/producer-blueprint"
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-zinc-500 text-sm mb-12">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-zinc-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                When you visit our website or purchase our products, we collect certain information about you, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal information (name, email address) when you make a purchase or sign up for our email list</li>
                <li>Payment information processed securely through our third-party payment processors</li>
                <li>Usage data including pages visited, time spent on pages, and other analytics</li>
                <li>Device information including browser type, IP address, and operating system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process and deliver your purchases</li>
                <li>Send you important updates about your order and account</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website and products</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Cookies & Tracking Technologies</h2>
              <p className="mb-4">
                We use cookies, pixels, and similar tracking technologies to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Remember your preferences and settings</li>
                <li>Understand how you interact with our website</li>
                <li>Deliver relevant advertisements on third-party platforms (Facebook, Instagram, Google)</li>
                <li>Measure the effectiveness of our marketing campaigns</li>
              </ul>
              <p className="mt-4">
                We use Facebook Pixel, Google Analytics, and similar tools to track conversions and optimize our advertising. These tools may collect data about your browsing behavior across websites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Email Marketing</h2>
              <p>
                By providing your email address and making a purchase or signing up for our list, you consent to receive marketing emails from Rob Late Music. You can unsubscribe at any time by clicking the "unsubscribe" link at the bottom of any email. We use third-party email service providers to manage our email lists and send communications.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Third-Party Services</h2>
              <p>
                We may share your information with third-party service providers who help us operate our business, including payment processors, email service providers, and analytics platforms. These providers are contractually obligated to protect your information and use it only for the purposes we specify.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">7. Your Rights</h2>
              <p className="mb-4">Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt out of marketing communications</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at team@roblate.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:{" "}
                <a href="mailto:team@roblate.com" className="text-white hover:text-[#D3FF02] transition-colors">
                  team@roblate.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;