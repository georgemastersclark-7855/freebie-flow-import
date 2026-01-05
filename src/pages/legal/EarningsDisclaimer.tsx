import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const EarningsDisclaimer = () => {
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
          <h1 className="text-4xl font-bold mb-8">Earnings & Results Disclaimer</h1>
          <p className="text-zinc-500 text-sm mb-12">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 text-zinc-400 leading-relaxed">
            <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
              <p className="text-lg leading-relaxed">
                We make every effort to ensure that we accurately represent these products and services and their potential for income. Earning and/or income statements made by Rob Late Music are estimates of what you can possibly earn. There is no guarantee that you will make these levels of income and you accept the risk that the earnings and income statements differ by individual.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">No Guarantees</h2>
              <p>
                The examples shown on our website, in our marketing materials, and in testimonials are not to be interpreted as any guarantee, promise, representation, or assurance. We do not purport our business and/or us as being a "get rich scheme."
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">Success Requires Work</h2>
              <p>
                Success in ANY business requires leadership, hard work and dedication. The success stories and testimonials shared are from individuals who have applied the principles taught and put in significant effort to achieve their results. Your results will vary based on many factors including but not limited to your background, experience, dedication, and work ethic.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">Music Industry Considerations</h2>
              <p className="mb-4">
                The music industry is highly competitive and success depends on numerous factors outside of production skills alone, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Market conditions and industry trends</li>
                <li>Networking and relationship building</li>
                <li>Timing and luck</li>
                <li>Consistent effort over extended periods</li>
                <li>Marketing and self-promotion abilities</li>
                <li>Unique artistic vision and creativity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">Forward-Looking Statements</h2>
              <p>
                Any forward-looking statements outlined on this website or in our marketing materials are simply our opinion and thus are not guarantees or promises for actual performance. It should be clear to you that by law we make no guarantees that you will achieve any results from our ideas or techniques shared in our materials.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">Personal Responsibility</h2>
              <p>
                Ultimately, you are responsible for your own success. We provide the education, tools, and techniques, but the application and results are up to you. We encourage you to do your own due diligence before making any purchasing decision.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Earnings Disclaimer, please contact us at:{" "}
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

export default EarningsDisclaimer;