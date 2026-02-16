import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
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
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-zinc-500 text-sm mb-12">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-zinc-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using The Producer Blueprint website and purchasing our products, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services or purchase our products.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Products and Services</h2>
              <p>
                The Producer Blueprint is a digital education product that provides video lessons, project files, templates, and other educational materials related to music production. Access to the course is provided immediately upon purchase through our online learning platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. Intellectual Property Rights</h2>
              <p className="mb-4">
                All content included in The Producer Blueprint, including but not limited to video lessons, audio files, project files, templates, graphics, and written materials, is the exclusive property of Rob Late Music and is protected by copyright and other intellectual property laws.
              </p>
              <p className="mb-4 font-medium text-white">
                You are expressly prohibited from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Reselling, redistributing, or sharing course materials with others</li>
                <li>Uploading course content to file-sharing platforms or torrent sites</li>
                <li>Creating derivative products based on our course materials for commercial sale</li>
                <li>Sharing your login credentials with others</li>
                <li>Recording, screenshotting, or otherwise capturing course content for redistribution</li>
              </ul>
              <p className="mt-4">
                Violation of these terms will result in immediate termination of your access without refund, and may result in legal action.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. User Conduct</h2>
              <p className="mb-4">When using our products and services, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate information when making a purchase</li>
                <li>Use the materials solely for your personal education and music production</li>
                <li>Respect other students in any community or group settings</li>
                <li>Not engage in any activity that disrupts or interferes with our services</li>
                <li>Not use our materials to create competing educational products</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. License Grant</h2>
              <p>
                Upon purchase, you are granted a limited, non-exclusive, non-transferable license to access and use The Producer Blueprint materials for your personal, non-commercial use. This license does not include the right to resell, sublicense, or distribute the materials in any way.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Disclaimer of Warranties</h2>
              <p>
                The Producer Blueprint is provided "as is" without warranties of any kind. We do not guarantee any specific results from using our materials. Success in music production depends on many factors including individual effort, skill development, and market conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Rob Late Music shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our products and services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">8. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after any changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:{" "}
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

export default TermsOfService;