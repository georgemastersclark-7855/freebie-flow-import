import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Simple Navbar */}
      <nav className="border-b border-zinc-900 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/theproducerblueprint001" className="text-white font-bold text-lg">
            The Producer Blueprint.
          </Link>
          <Link 
            to="/theproducerblueprint001" 
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
          <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
          <p className="text-zinc-500 text-sm mb-12">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-zinc-400 leading-relaxed">
            <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">No Refunds / All Sales Final</h2>
              <p className="text-lg">
                Due to the immediate digital nature of this product (downloadable project files, templates, and instant access content), we do not offer refunds. All sales are final.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">Why We Have This Policy</h2>
              <p>
                By purchasing The Producer Blueprint, you agree to this policy. This creates a secure environment for our intellectual property. Because our course materials are delivered digitally and include downloadable files that cannot be "returned," we cannot offer refunds once access has been granted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">What You're Getting</h2>
              <p className="mb-4">
                Before purchasing, please review the course curriculum and all information provided on our sales page to ensure The Producer Blueprint is right for you. Your purchase includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Immediate access to all video lessons</li>
                <li>Downloadable project files and templates</li>
                <li>12 months access to the course materials</li>
                <li>All included bonuses as described on the sales page</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">Technical Issues</h2>
              <p>
                If you experience any technical issues accessing the course materials, please contact us at{" "}
                <a href="mailto:team@roblate.com" className="text-white hover:text-[#FF4F33] transition-colors">
                  team@roblate.com
                </a>
                {" "}and our team will work to resolve the issue promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Refund Policy before making a purchase, please reach out to:{" "}
                <a href="mailto:team@roblate.com" className="text-white hover:text-[#FF4F33] transition-colors">
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

export default RefundPolicy;