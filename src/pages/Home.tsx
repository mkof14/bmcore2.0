import { Activity, Brain, Shield, Heart, Lightbulb, Sparkles, ArrowRight, Check, BookOpen, Lock } from 'lucide-react';
import { useEffect } from 'react';
import HealthCategories from '../components/HealthCategories';
import SEO from '../components/SEO';
import Testimonials from '../components/Testimonials';
import StatsCounter from '../components/StatsCounter';
import TrustSignals from '../components/TrustSignals';
import CTASection, { CTABanner } from '../components/CTASection';
import { generateOrganizationSchema, generateWebSiteSchema, injectStructuredData } from '../lib/structuredData';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const coreValues = [
    {
      icon: Brain,
      title: 'Understanding, Not Overwhelm',
      description: 'We convert signals into meaning, then into gentle, supportive daily guidance. Clarity without pressure.'
    },
    {
      icon: Heart,
      title: 'Reassurance, Not Urgency',
      description: 'Built on a foundation of emotional safety. You are learning, never failing. Guidance is invitational, not prescriptive.'
    },
    {
      icon: Lightbulb,
      title: 'Interpretation, Not Diagnosis',
      description: 'We help you understand how your body is responding day-to-day. Educational, supportive, wellness-first.'
    }
  ];

  const howItWorks = [
    { step: '1', title: 'Join', description: 'Create your account and set your wellness focus' },
    { step: '2', title: 'Activate Services', description: 'Choose from 200+ AI services across 20 health categories' },
    { step: '3', title: 'Receive Daily Insights', description: 'Get personalized guidance that helps you understand what your body needs' }
  ];

  const whoItsFor = [
    'Seeking clarity, not diagnosis',
    'Early wellness optimization',
    'Stress, fatigue, and recovery guidance',
    'Longevity and self-regulation',
    'Understanding before symptoms escalate',
    'Proactive self-care without clinical pressure'
  ];

  useEffect(() => {
    const orgSchema = generateOrganizationSchema();
    const websiteSchema = generateWebSiteSchema();
    injectStructuredData(orgSchema);
    injectStructuredData(websiteSchema);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <SEO
        title="AI-Powered Personalized Health Intelligence"
        description="Transform your health data into actionable insights with AI-powered analysis, personalized recommendations, and comprehensive health tracking. Join BioMath Core for preventive wellness."
        keywords={['AI health analytics', 'personalized medicine', 'preventive healthcare', 'wellness tracking', 'health intelligence', 'biomarkers analysis']}
        url="/"
      />

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/20 dark:from-orange-500/20 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to BioMath Core
            </h1>
            <p className="text-3xl md:text-4xl lg:text-5xl font-medium text-blue-500 dark:text-blue-400 mb-8">
              Where data meets daily life
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-500 dark:text-gray-400 mb-12">
              All of Health One Platform
            </h2>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-12 max-w-5xl mx-auto leading-relaxed">
              From sleep to cognition, from movement to mood — BioMath Core brings clarity to your
              health journey. Track, understand, and optimize your wellbeing through intelligent, real-time insights tailored to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => onNavigate('signup')}
                className="px-6 py-2.5 bg-gray-100/30 dark:bg-gray-800/30 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 border border-gray-300/30 dark:border-gray-700/30 hover:border-gray-300/50 dark:hover:border-gray-600/50 rounded-lg text-orange-600 dark:text-orange-500 text-lg font-semibold cursor-pointer hover:text-orange-700 dark:hover:text-orange-400 transition-all duration-300"
              >
                Start Free Today
              </button>
              <span className="text-gray-400 dark:text-gray-500 text-2xl">•</span>
              <button
                onClick={() => onNavigate('learning')}
                className="px-6 py-2.5 bg-gray-100/30 dark:bg-gray-800/30 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 border border-gray-300/30 dark:border-gray-700/30 hover:border-gray-300/50 dark:hover:border-gray-600/50 rounded-lg text-orange-700 dark:text-orange-400 text-lg font-semibold cursor-pointer hover:text-orange-800 dark:hover:text-orange-300 transition-all duration-300"
              >
                Explore Learning Center
              </button>
            </div>
          </div>
        </div>
      </section>

      <HealthCategories onNavigate={onNavigate} />

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-orange-500/10 dark:from-blue-500/20 dark:to-orange-500/20 border border-blue-200/50 dark:border-blue-500/30 rounded-full mb-6">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">How We Transform Your Health Journey</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-500 dark:text-gray-600 mb-6">
              From Signals to Meaning to Support
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Rather than tracking numbers, BioMath Core focuses on interpretation, education,
              and preventive wellness through personalized AI insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              const colors = [
                { bg: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/30', icon: 'text-blue-600 dark:text-blue-400', gradient: 'from-blue-500/20 to-transparent' },
                { bg: 'from-orange-500/10 to-orange-600/5', border: 'border-orange-500/30', icon: 'text-orange-600 dark:text-orange-400', gradient: 'from-orange-500/20 to-transparent' },
                { bg: 'from-blue-500/10 to-orange-500/5', border: 'border-blue-500/30', icon: 'text-blue-600 dark:text-blue-400', gradient: 'from-blue-500/20 via-orange-500/10 to-transparent' }
              ];
              const color = colors[index];

              return (
                <div
                  key={index}
                  className={`group relative bg-gradient-to-br ${color.bg} backdrop-blur-xl border ${color.border} rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`}></div>
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-br ${color.bg} border ${color.border} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${color.icon}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-500 dark:text-gray-600 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Simple, supportive, effective
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-xl p-6 h-full">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-lg font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-orange-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-500 dark:text-gray-600 mb-4">
              Who Is This For?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              BioMath Core is designed for people who want understanding, not overwhelm
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {whoItsFor.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-800 rounded-lg">
                <Check className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur border border-gray-700/40 rounded-2xl p-6 md:p-8 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Brain className="h-7 w-7 text-blue-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-500 dark:text-gray-600">
                AI Health with Two Expert Opinions
              </h2>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Get comprehensive health insights powered by dual AI analysis. Our unique Second Opinion system compares insights from multiple AI models, providing balanced recommendations.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-blue-400 mb-1">200+</div>
                <div className="text-xs text-gray-400">AI Services</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-blue-400 mb-1">3M+</div>
                <div className="text-xs text-gray-400">Insights</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-blue-400 mb-1">98%</div>
                <div className="text-xs text-gray-400">Accuracy</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-3xl font-bold text-orange-400 mb-1">24/7</div>
                <div className="text-xs text-gray-400">Support</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-colors duration-300">
                <div className="text-sm font-semibold text-blue-400 mb-1">Dual AI Analysis</div>
                <div className="text-xs text-gray-400">Multiple model insights</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/40 transition-colors duration-300">
                <div className="text-sm font-semibold text-orange-400 mb-1">Consensus Reports</div>
                <div className="text-xs text-gray-400">Balanced recommendations</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-colors duration-300">
                <div className="text-sm font-semibold text-blue-400 mb-1">Expert Validation</div>
                <div className="text-xs text-gray-400">Professionally verified</div>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur border border-gray-700/40 rounded-2xl p-6 md:p-8 hover:border-orange-500/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-500/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Lock className="h-7 w-7 text-orange-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-500 dark:text-gray-600">
                Model Archive - Your Secure Vault
              </h2>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              All your health data in one encrypted vault. Store lab results, genetic data, wearable metrics, and medical records with military-grade security.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-lg p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-xl font-bold text-blue-400 mb-1">AES-256</div>
                <div className="text-xs text-gray-400">Encryption</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/20 rounded-lg p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-xl font-bold text-orange-400 mb-1">Zero-Trust</div>
                <div className="text-xs text-gray-400">Architecture</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-lg p-4 hover:scale-105 transition-transform duration-300">
                <div className="text-xl font-bold text-blue-400 mb-1">SOC 2</div>
                <div className="text-xs text-gray-400">Certified</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
