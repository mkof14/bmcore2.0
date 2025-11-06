import { BarChart3, Users2, Rocket, Globe, Target, TrendingUp, Cpu, Shield, Zap, Lock, Lightbulb } from 'lucide-react';

interface InvestorsProps {
  onNavigate: (page: string) => void;
}

export default function Investors({ onNavigate }: InvestorsProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/20 to-transparent"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-sm font-semibold text-orange-500 mb-3 tracking-wide uppercase">
            FOR INVESTORS
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Strategic investment in <span className="text-blue-400">next-generation health intelligence</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            BioMath Core transforms complex health data into actionable, personalized guidance through biomathematical modeling and AI. We're building scalable infrastructure for preventive health—combining proven technology with measurable user outcomes and clear unit economics.
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
            We work with institutional investors, strategic partners, family offices, and individual investors. Our approach is flexible: equity investment, strategic partnerships, licensing agreements, or hybrid structures tailored to mutual value creation.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-2.5 bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/30 hover:border-gray-600/50 rounded-lg text-orange-500 hover:text-orange-400 text-lg font-semibold transition-all duration-300"
            >
              Contact the team
            </button>
            <button
              onClick={() => onNavigate('biomath-core-summary')}
              className="px-6 py-2.5 bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/30 hover:border-gray-600/50 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              <span className="text-blue-500 hover:text-blue-400">Summary</span>
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="px-6 py-2.5 bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/30 hover:border-gray-600/50 rounded-lg text-blue-400 hover:text-blue-300 text-lg font-semibold transition-all duration-300"
            >
              Learn about us
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our investor <span className="text-blue-400">partners</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto">
              We've built relationships across the investment ecosystem. Each investor type brings unique value, and we structure engagements accordingly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-white">Institutional & VC funds</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                We work with health-tech focused venture funds and growth equity investors seeking defensible technology platforms with clear monetization paths. Our structured approach to product-market fit, retention metrics, and expansion revenue makes us attractive for institutional mandates.
              </p>
              <div className="border-l-2 border-gray-700 pl-4">
                <p className="text-sm font-semibold text-white mb-2">What we offer:</p>
                <p className="text-sm text-gray-400">
                  Professional governance, transparent reporting, measurable KPIs, and institutional-grade data rooms.
                </p>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Users2 className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Family offices & HNWIs</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                We value long-term partners who understand preventive health's societal impact. Family offices often bring sector expertise, network access, and patient capital. We offer flexible structures, co-investment opportunities, and direct founder access.
              </p>
              <div className="border-l-2 border-gray-700 pl-4">
                <p className="text-sm font-semibold text-white mb-2">What we offer:</p>
                <p className="text-sm text-gray-400">
                  Flexible terms, advisory board participation, and alignment on mission-driven outcomes.
                </p>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-green-500/10 p-3 rounded-lg">
                  <Rocket className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Strategic corporate investors</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Healthcare providers, insurance companies, pharma, and wellness brands see value in our platform for member engagement, risk stratification, and care navigation. Strategic investors gain preferred access to technology, co-development rights, and data insights (privacy-compliant, opt-in).
              </p>
              <div className="border-l-2 border-gray-700 pl-4">
                <p className="text-sm font-semibold text-white mb-2">What we offer:</p>
                <p className="text-sm text-gray-400">
                  Integration partnerships, pilot programs, and mutual customer success initiatives.
                </p>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-purple-500/10 p-3 rounded-lg">
                  <Globe className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Angel & operator investors</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Experienced founders and operators in health-tech, AI, SaaS, and consumer platforms bring tactical value beyond capital. We welcome angels who can contribute domain expertise, customer introductions, hiring networks, or technical guidance.
              </p>
              <div className="border-l-2 border-gray-700 pl-4">
                <p className="text-sm font-semibold text-white mb-2">What we offer:</p>
                <p className="text-sm text-gray-400">
                  Active involvement opportunities, product feedback loops, and early-stage upside participation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Current traction & <span className="text-orange-500">business fundamentals</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto">
              We're beyond concept validation. The platform is live, monetizing, and demonstrating retention and engagement metrics that validate our approach.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Target className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">Platform status</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <span className="text-gray-400">Service categories live</span>
                  <span className="text-2xl font-bold text-blue-400">20+</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <span className="text-gray-400">AI-powered services</span>
                  <span className="text-2xl font-bold text-blue-400">200+</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-400">Platform architecture</span>
                  <span className="text-lg font-bold text-blue-400">Production-ready</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">Business model validation</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-semibold">Subscription tiers:</p>
                    <p className="text-gray-400 text-sm">5-day trial, Core, Daily, Max plans with 30-90% gross margins</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-semibold">Monetization:</p>
                    <p className="text-gray-400 text-sm">Direct consumer subscriptions + B2B licensing pipeline</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-semibold">CAC payback:</p>
                    <p className="text-gray-400 text-sm">Targeting 6-12 months through organic and partnership channels</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-semibold">Retention:</p>
                    <p className="text-gray-400 text-sm">Focus on long-term engagement through personalized value delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Technical differentiation & <span className="text-blue-400">IP</span>
            </h2>
          </div>

          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Cpu className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Core Technology</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-semibold mb-1">Proprietary modeling layer:</p>
                    <p className="text-gray-400 text-sm">
                      Biomathematical models for personalized health trajectories, combining evidence-based rules with AI-assisted reasoning
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-semibold mb-1">Multi-modal data integration:</p>
                    <p className="text-gray-400 text-sm">
                      Questionnaires, wearables, labs, genetic data processed through unified framework
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-semibold mb-1">Explainable outputs:</p>
                    <p className="text-gray-400 text-sm">
                      Transparent reasoning chains, not black-box predictions—critical for clinical trust and regulatory positioning
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-semibold mb-1">Privacy architecture:</p>
                    <p className="text-gray-400 text-sm">
                      Minimal data collection, user-controlled sharing, encryption standards exceeding HIPAA requirements
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-semibold mb-1">Scalable infrastructure:</p>
                    <p className="text-gray-400 text-sm">
                      Modular service architecture allowing rapid category expansion without core refactoring
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-white font-semibold mb-1">Continuous learning:</p>
                    <p className="text-gray-400 text-sm">
                      Model updates based on aggregated, anonymized outcomes—improving accuracy while preserving privacy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Business <span className="text-blue-400">model</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
              <div className="bg-blue-500/10 p-4 rounded-lg w-fit mb-6">
                <Users2 className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Consumer plans</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-400 text-sm">5-day trial with subscription</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-400 text-sm">Premium bundles by category</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-400 text-sm">Optional add-on analyses</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
              <div className="bg-blue-500/10 p-4 rounded-lg w-fit mb-6">
                <Globe className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">B2B services</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-400 text-sm">Licensing of modules</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-400 text-sm">Co-branded programs</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-400 text-sm">Privacy-first integrations</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
              <div className="bg-orange-500/10 p-4 rounded-lg w-fit mb-6">
                <Shield className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Data services (opt-in)</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-400 text-sm">Aggregated, de-identified learnings</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-400 text-sm">Model improvement loops</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-400 text-sm">Strict user consent rules</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Market <span className="text-blue-400">opportunity</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 text-center">
              <div className="bg-green-500/10 p-4 rounded-lg w-fit mx-auto mb-6">
                <TrendingUp className="h-10 w-10 text-green-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">$230B+</div>
              <p className="text-gray-400 text-sm">Global digital health market by 2030</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 text-center">
              <div className="bg-blue-500/10 p-4 rounded-lg w-fit mx-auto mb-6">
                <Globe className="h-10 w-10 text-blue-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">500M+</div>
              <p className="text-gray-400 text-sm">Addressable users worldwide</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 text-center">
              <div className="bg-orange-500/10 p-4 rounded-lg w-fit mx-auto mb-6">
                <Target className="h-10 w-10 text-orange-500" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">20</div>
              <p className="text-gray-400 text-sm">Health service categories</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 text-center">
              <div className="bg-yellow-500/10 p-4 rounded-lg w-fit mx-auto mb-6">
                <Lightbulb className="h-10 w-10 text-yellow-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">200+</div>
              <p className="text-gray-400 text-sm">AI-powered services</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Growth <span className="text-orange-500">roadmap</span>
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 flex items-start gap-6">
              <div className="bg-orange-500 p-4 rounded-lg flex-shrink-0">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-orange-500 font-bold text-lg">2025</span>
                  <h3 className="text-2xl font-bold text-white">Platform Launch</h3>
                </div>
                <p className="text-gray-400">Consumer product launch, 20 categories, 200+ services live</p>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 flex items-start gap-6">
              <div className="bg-orange-500 p-4 rounded-lg flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-orange-500 font-bold text-lg">2026</span>
                  <h3 className="text-2xl font-bold text-white">B2B Expansion</h3>
                </div>
                <p className="text-gray-400">Enterprise partnerships, co-branded wellness programs</p>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8 flex items-start gap-6">
              <div className="bg-orange-500 p-4 rounded-lg flex-shrink-0">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-orange-500 font-bold text-lg">2027+</span>
                  <h3 className="text-2xl font-bold text-white">Global Scale</h3>
                </div>
                <p className="text-gray-400">International markets, advanced AI capabilities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Zap className="h-8 w-8 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">The BioMath Core Engine</h2>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                A modeling layer that transforms raw inputs into personalized, time-aware suggestions. It blends evidence-based rules, transparent heuristics, and AI assistance.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Multi-input:</span>
                    <span className="text-gray-400 text-sm ml-1">questionnaires, wearables, labs, context</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Explainable outputs:</span>
                    <span className="text-gray-400 text-sm ml-1">what matters now, and why</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Privacy by design:</span>
                    <span className="text-gray-400 text-sm ml-1">minimal data, user control, encryption</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-semibold">Continuous updates:</span>
                    <span className="text-gray-400 text-sm ml-1">learn from engagement, not profiles</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-orange-500/10 p-3 rounded-lg">
                  <Rocket className="h-8 w-8 text-orange-500" />
                </div>
                <h2 className="text-3xl font-bold text-white">Why now (and why us)</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Execution first</h3>
                  <p className="text-gray-400 text-sm">We ship focused, useful features instead of hype</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Lower friction</h3>
                  <p className="text-gray-400 text-sm">Clear UX, fast answers, practical recommendations</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Unit economics</h3>
                  <p className="text-gray-400 text-sm">Path to healthy margins through modular plans</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Partnership-ready</h3>
                  <p className="text-gray-400 text-sm">Designed for integrations with clinics and wellness providers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-12">
            <div className="bg-orange-500/10 p-4 rounded-lg w-fit mx-auto mb-6">
              <Lock className="h-12 w-12 text-orange-500" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Trust, privacy, and clarity
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
              Health guidance must respect people. We minimize data collection, keep explanations readable, and separate suggestions from diagnosis. Legal pages are public and plain-language. We grow through transparency, not promises of "miracles."
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <button onClick={() => onNavigate('privacy-policy')} className="text-orange-500 hover:text-orange-400 font-semibold transition-colors cursor-pointer">Privacy Policy</button>
              <span className="text-gray-600">•</span>
              <button onClick={() => onNavigate('terms-of-service')} className="text-orange-500 hover:text-orange-400 font-semibold transition-colors cursor-pointer">Terms of Use</button>
              <span className="text-gray-600">•</span>
              <button onClick={() => onNavigate('disclaimer')} className="text-orange-500 hover:text-orange-400 font-semibold transition-colors cursor-pointer">Disclaimer</button>
              <span className="text-gray-600">•</span>
              <button onClick={() => onNavigate('hipaa-notice')} className="text-orange-500 hover:text-orange-400 font-semibold transition-colors cursor-pointer">HIPAA Notice</button>
              <span className="text-gray-600">•</span>
              <button onClick={() => onNavigate('security')} className="text-orange-500 hover:text-orange-400 font-semibold transition-colors cursor-pointer">Security</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-12">
            <Shield className="h-16 w-16 text-orange-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to join our journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We're actively engaging with investors who share our vision for evidence-based, user-controlled health intelligence. Whether you're exploring strategic partnerships, equity investment, or licensing opportunities, we'd be happy to discuss how we can work together.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-2.5 bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/30 hover:border-gray-600/50 rounded-lg text-orange-500 hover:text-orange-400 text-lg font-semibold transition-all duration-300"
              >
                Contact the team
              </button>
              <button
                onClick={() => onNavigate('biomath-core-summary')}
                className="px-6 py-2.5 bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/30 hover:border-gray-600/50 rounded-lg text-lg font-semibold transition-all duration-300"
              >
                <span className="text-blue-500 hover:text-blue-400">Summary</span>
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-2.5 bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/30 hover:border-gray-600/50 rounded-lg text-blue-400 hover:text-blue-300 text-lg font-semibold transition-all duration-300"
              >
                Learn about us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
