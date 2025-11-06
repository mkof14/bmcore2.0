import { Target, MapPin, Users, Sparkles, Shield, Users2, TrendingUp, CheckCircle, Award, Globe, Heart, Building2 } from 'lucide-react';
import BackButton from '../components/BackButton';
import SEO from '../components/SEO';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export default function About({ onNavigate }: AboutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <SEO
        title="About Us - Mission, Vision & Team"
        description="Learn about BioMath Core's mission to build trustworthy wellness intelligence through biomathematics, computational biology, and AI. Discover our founder's journey and our commitment to preventive health."
        keywords={['about biomath core', 'health technology mission', 'computational biology', 'biomathematics', 'preventive wellness', 'health AI company']}
        url="/about"
      />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton onNavigate={onNavigate} />

          <section className="py-16 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-500 dark:text-gray-600 mb-6">
              About BioMath Core
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              Digital health and biomath analytics platform engineered for precision, transparency, and human-centered intelligence
            </p>
          </section>

          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-600/30 rounded-xl flex items-center justify-center mb-6 group-hover:border-orange-500 group-hover:shadow-lg group-hover:shadow-orange-600/20 transition-all duration-300">
                    <Target className="w-10 h-10 text-orange-500 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-600 mb-4 group-hover:text-orange-50 transition-colors">Our Mission</h2>
                  <p className="text-gray-400 leading-relaxed">
                    We build trustworthy, practical wellness intelligence at the intersection of{' '}
                    <span className="font-bold text-white">biomathematics</span>,{' '}
                    <span className="font-bold text-white">computational biology</span>, and{' '}
                    <span className="font-bold text-white">AI</span>. BioMath Core helps people and professionals navigate complex health questions with precise, explainable guidance — focused on prevention, wellness, and long-term resilience.
                  </p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-600/30 rounded-xl flex items-center justify-center mb-6 group-hover:border-orange-500 group-hover:shadow-lg group-hover:shadow-orange-600/20 transition-all duration-300">
                    <MapPin className="w-10 h-10 text-orange-500 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-600 mb-4 group-hover:text-orange-50 transition-colors">Our Founder</h2>
                  <div className="text-gray-400 space-y-3 leading-relaxed">
                    <p>
                      <span className="font-bold text-white">Michael Kofman</span> is a visionary technology entrepreneur and creator of BioMath Core — a platform uniting advanced analytics, AI, and human health.
                    </p>
                    <p>
                      Through{' '}
                      <a
                        href="https://digitalinvest.com/#home"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-400 font-semibold underline transition-colors"
                      >
                        Digital Invest Inc.
                      </a>{' '}
                      and{' '}
                      <a
                        href="https://biomathlife.com/#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-400 font-semibold underline transition-colors"
                      >
                        BioMath Life
                      </a>, he turns rigorous science into usable systems that scale.
                    </p>
                    <p>
                      Recognized by <span className="text-orange-500 font-semibold">Healthcare Tech Outlook</span>.{' '}
                      <a
                        href="https://www.healthcaretechoutlook.com/digital-invest-inc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-400 underline transition-colors"
                      >
                        Read the interview →
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <p className="text-gray-300 text-lg">
                  Our platform spans{' '}
                  <span className="font-bold text-white">20 categories with 200+ services</span>{' '}
                  (and growing). We expand only when the signal is strong — based on real user needs and evidence.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-500 dark:text-gray-600 mb-4">Our Team</h2>
              <p className="text-xl text-gray-400">Building the future of digital healthcare together</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-8">
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  We began our journey in <span className="font-bold text-white">2008</span>, working in digital healthcare and biomathematical modeling across different countries worldwide. Over these years, we have gained{' '}
                  <span className="font-bold text-white">tremendous practical experience</span>, deep understanding of user needs, and expertise in integrating science, technology, and human health.
                </p>

                <p>
                  By studying real people's needs — from patients to clinicians, from families to corporate programs — we arrived at{' '}
                  <span className="font-bold text-white">today's understanding</span> of what is truly necessary for preventive medicine, wellness management, and long-term health. This understanding became the foundation of our{' '}
                  <span className="font-bold text-white">Human Data Model</span>, which forms the core of the BioMath Core platform.
                </p>

                <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-6 my-6">
                  <p className="text-gray-300">
                    <span className="font-bold text-white">BioMath Core Platform</span> is not just a set of tools. It is a{' '}
                    <span className="font-bold text-white">living ecosystem</span> capable of incorporating multiple services, implementing innovations, and leveraging achievements from various sciences — from biomathematics and epidemiology to machine learning and behavioral psychology —{' '}
                    <span className="font-bold text-white">for the benefit of users</span>.
                  </p>
                </div>

                <p>
                  We continuously work on <span className="font-bold text-white">platform improvement</span>: enhancing model accuracy, expanding health category coverage, increasing algorithm transparency, and deepening personalization. We have{' '}
                  <span className="font-bold text-white">big plans</span> — from integrating advanced wearable devices to implementing genomic analytics and predictive horizons.
                </p>

                <p>
                  We are <span className="font-bold text-white">full of energy and enthusiasm</span>, passionate about our work, and convinced of its value. This endeavor has been shaped by years of applied experience, hundreds of consultations with users and professionals, thousands of hours of research and development.
                </p>

                <div className="border-l-4 border-orange-500 pl-6 py-2 my-6">
                  <p className="text-gray-300">
                    Throughout our journey, we have assembled and collaborated with{' '}
                    <span className="font-bold text-white">talented specialists</span> — engineers, biomathematicians, clinicians, data analysts, designers, and researchers — who share our vision,{' '}
                    <span className="font-bold text-white">goals, and plans</span>.
                  </p>
                </div>

                <p>
                  Today, we are <span className="font-bold text-white">one large team of passionate professionals</span>, experts in our field, committed to innovation and ready for{' '}
                  <span className="font-bold text-white">a great path of development</span>. We are building the future of digital healthcare — transparent, human-centered, and science-based.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-500 dark:text-gray-600 mb-4">The BioMath Core AI Engine</h2>
              <p className="text-xl text-gray-400">A layered system that unifies biological priors, time-series, and context into a single, inspectable pipeline</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 border border-orange-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:border-orange-500/40 group-hover:shadow-lg group-hover:shadow-orange-600/10 transition-all">
                    <Sparkles className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-600 font-bold mb-2 text-lg">Model-first design</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Biomathematical structures guide learning — reducing overfitting and improving stability
                  </p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 border border-orange-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:border-orange-500/40 group-hover:shadow-lg group-hover:shadow-orange-600/10 transition-all">
                    <Globe className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-600 font-bold mb-2 text-lg">Multi-modal fusion</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Lab results, lifestyle inputs, wearable data, and clinical knowledge aligned into explainable insights
                  </p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 border border-orange-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:border-orange-500/40 group-hover:shadow-lg group-hover:shadow-orange-600/10 transition-all">
                    <Shield className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-600 font-bold mb-2 text-lg">Quality gates</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Validation, uncertainty flags, and human-in-the-loop review for sensitive areas
                  </p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 border border-orange-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:border-orange-500/40 group-hover:shadow-lg group-hover:shadow-orange-600/10 transition-all">
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-600 font-bold mb-2 text-lg">Outcome orientation</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Recommendations aim at wellness, prevention, and performance — not treatment
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-500 dark:text-gray-600 mb-4">Our Philosophy</h2>
              <p className="text-xl text-gray-400">Core principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-500 dark:text-gray-600 mb-4 group-hover:text-orange-50 transition-colors">Data belongs to you</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Only you decide what to share. Your privacy is paramount.
                  </p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-500 dark:text-gray-600 mb-4 group-hover:text-orange-50 transition-colors">Knowledge is power</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Understanding your biomarkers gives you the chance to prevent problems early.
                  </p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-500 dark:text-gray-600 mb-4 group-hover:text-orange-50 transition-colors">AI is an assistant</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Not a doctor. We provide insights to support your health conversations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-500 dark:text-gray-600 mb-4">Platform Highlights</h2>
              <p className="text-xl text-gray-400">What makes BioMath Core unique</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 text-center hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-900 border border-orange-600/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:border-orange-500/40 group-hover:shadow-lg group-hover:shadow-orange-600/10 transition-all">
                    <Sparkles className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-600 font-bold mb-2 text-lg">AI-Powered Insights</h3>
                  <p className="text-sm text-gray-400">
                    Advanced machine learning algorithms analyze your health data
                  </p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 text-center hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-900 border border-orange-600/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:border-orange-500/40 group-hover:shadow-lg group-hover:shadow-orange-600/10 transition-all">
                    <Shield className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-600 font-bold mb-2 text-lg">HIPAA Compliant</h3>
                  <p className="text-sm text-gray-400">
                    Enterprise-grade security with end-to-end encryption
                  </p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 text-center hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-900 border border-orange-600/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:border-orange-500/40 group-hover:shadow-lg group-hover:shadow-orange-600/10 transition-all">
                    <Users2 className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-600 font-bold mb-2 text-lg">Family Focused</h3>
                  <p className="text-sm text-gray-400">
                    Manage health analytics for your entire family
                  </p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 text-center hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-900 border border-orange-600/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:border-orange-500/40 group-hover:shadow-lg group-hover:shadow-orange-600/10 transition-all">
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-600 font-bold mb-2 text-lg">Real-Time Analytics</h3>
                  <p className="text-sm text-gray-400">
                    Instant insights from connected devices
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-500 dark:text-gray-600 mb-4">Who We Serve</h2>
              <p className="text-xl text-gray-400">Empowering diverse communities with health intelligence</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <ul className="space-y-4 text-gray-300">
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:text-orange-500 transition-colors" />
                      <div>
                        <h3 className="font-bold text-white mb-1">Individual Users</h3>
                        <p className="text-sm text-gray-400">Those who want to understand their health metrics and track progress</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:text-orange-500 transition-colors" />
                      <div>
                        <h3 className="font-bold text-white mb-1">Families</h3>
                        <p className="text-sm text-gray-400">For caring about loved ones' health, including children and elderly relatives</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <ul className="space-y-4 text-gray-300">
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:text-orange-500 transition-colors" />
                      <div>
                        <h3 className="font-bold text-white mb-1">Clinics & Corporate Clients</h3>
                        <p className="text-sm text-gray-400">Supporting wellness programs and preventive care initiatives</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:text-orange-500 transition-colors" />
                      <div>
                        <h3 className="font-bold text-white mb-1">Investors & Partners</h3>
                        <p className="text-sm text-gray-400">Participating in the development of a digital health ecosystem</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
