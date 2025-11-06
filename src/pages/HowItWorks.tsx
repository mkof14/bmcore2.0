import { useState } from 'react';
import { ArrowRight, CheckCircle, Users, Brain, Activity, FileText, Shield, Zap, Target, TrendingUp, Heart, Sparkles, ChevronRight, Box, HelpCircle, Layers, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import BackButton from '../components/BackButton';

interface HowItWorksProps {
  onNavigate?: (page: string) => void;
}

export default function HowItWorks({ onNavigate }: HowItWorksProps) {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Target },
    { id: 'signup', title: '1. Sign Up', icon: Users },
    { id: 'connect', title: '2. Connect Devices', icon: Activity },
    { id: 'analyze', title: '3. AI Analysis', icon: Brain },
    { id: 'reports', title: '4. Get Reports', icon: FileText },
    { id: 'action', title: '5. Take Action', icon: Zap },
    { id: 'black-box', title: 'Health Black Box', icon: Box },
    { id: 'dual-ai', title: 'Dual AI System', icon: Sparkles },
    { id: 'categories', title: 'Health Categories', icon: Layers },
    { id: 'learning', title: 'Learning Center', icon: BookOpen },
    { id: 'faq', title: 'FAQ', icon: HelpCircle },
    { id: 'security', title: 'Security & Privacy', icon: Shield },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <SEO
        title="How It Works"
        description="Learn how BioMath Core uses advanced AI technology to transform your health data into actionable insights"
        keywords="how it works, AI health, health analytics, biomath core system"
      />

      <div className="flex pt-16">
        <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-gray-900/50 border-r border-gray-800 overflow-y-auto z-10">
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Navigation</h3>
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-orange-900/40 to-orange-800/20 border border-orange-600/50 text-orange-400'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{section.title}</span>
                    {activeSection === section.id && <ChevronRight className="h-4 w-4 ml-auto" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 lg:ml-72">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {onNavigate && <BackButton onNavigate={onNavigate} />}

            <section id="overview" className="mb-20">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400">
                  How BioMath Core Works
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Transform your health data into personalized insights with our advanced dual AI system.
                  Simple, secure, and scientifically validated.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-600/30 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Dual AI Models</h3>
                  <p className="text-gray-400 text-sm">Two independent AI systems analyze your data for comprehensive insights</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-600/30 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Bank-Level Security</h3>
                  <p className="text-gray-400 text-sm">HIPAA-compliant encryption protects your sensitive health data</p>
                </div>

                <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-600/30 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Real-Time Updates</h3>
                  <p className="text-gray-400 text-sm">Instant analysis as new data comes in from your devices</p>
                </div>
              </div>
            </section>

            <div className="space-y-16">
              <section id="signup" className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <h2 className="text-3xl font-bold text-white">Sign Up & Create Your Profile</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                      <div className="aspect-video bg-gradient-to-br from-orange-900/20 to-pink-900/20 rounded-lg flex items-center justify-center mb-4">
                        <Users className="h-24 w-24 text-orange-400 opacity-50" />
                      </div>
                      <div className="space-y-2 text-sm text-gray-400">
                        <p className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          Enter your email and create a secure password
                        </p>
                        <p className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          Complete your health profile questionnaire
                        </p>
                        <p className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          Set your health goals and preferences
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Getting Started is Easy</h3>
                    <p className="text-gray-300 mb-4">
                      Create your account in under 2 minutes. We'll ask you a few questions about your health
                      history, current conditions, and wellness goals to personalize your experience.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Secure Registration</p>
                          <p className="text-sm text-gray-400">Your data is encrypted from the moment you sign up</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Health Profile</p>
                          <p className="text-sm text-gray-400">Tell us about your medical history and goals</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Preference Settings</p>
                          <p className="text-sm text-gray-400">Customize notifications and report frequency</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="connect" className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <h2 className="text-3xl font-bold text-white">Connect Your Health Devices</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <h3 className="text-xl font-bold text-white mb-4">Seamless Integration</h3>
                    <p className="text-gray-300 mb-4">
                      BioMath Core connects with over 100+ health devices and apps. Link your wearables,
                      smart scales, blood pressure monitors, and more in just a few taps.
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                        <Activity className="h-6 w-6 text-blue-400 mb-2" />
                        <p className="text-sm font-medium text-white">Fitness Trackers</p>
                        <p className="text-xs text-gray-400">Apple Watch, Fitbit, Garmin</p>
                      </div>
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                        <Heart className="h-6 w-6 text-red-400 mb-2" />
                        <p className="text-sm font-medium text-white">Health Monitors</p>
                        <p className="text-xs text-gray-400">BP, glucose, weight scales</p>
                      </div>
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                        <Brain className="h-6 w-6 text-purple-400 mb-2" />
                        <p className="text-sm font-medium text-white">Health Apps</p>
                        <p className="text-xs text-gray-400">Apple Health, Google Fit</p>
                      </div>
                      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                        <FileText className="h-6 w-6 text-green-400 mb-2" />
                        <p className="text-sm font-medium text-white">Lab Results</p>
                        <p className="text-xs text-gray-400">Upload PDF reports</p>
                      </div>
                    </div>
                  </div>

                  <div className="order-1 md:order-2">
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                      <div className="aspect-video bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg flex items-center justify-center mb-4">
                        <Activity className="h-24 w-24 text-blue-400 opacity-50" />
                      </div>
                      <div className="space-y-2 text-sm text-gray-400">
                        <p className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          One-click OAuth connection for major platforms
                        </p>
                        <p className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          Automatic data synchronization every 15 minutes
                        </p>
                        <p className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          Manual upload for lab reports and medical documents
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="analyze" className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                  <h2 className="text-3xl font-bold text-white">AI Analyzes Your Data</h2>
                </div>

                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 mb-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Brain className="h-6 w-6 text-purple-400" />
                        Primary AI Model
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Our primary AI engine processes your health data using advanced machine learning algorithms
                        trained on millions of health records.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          Pattern recognition across all your health metrics
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          Correlation analysis between different biomarkers
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          Trend prediction based on your historical data
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-pink-400" />
                        Secondary AI Model
                      </h3>
                      <p className="text-gray-300 mb-4">
                        A completely independent AI model provides a "second opinion" on your health data,
                        ensuring comprehensive analysis.
                      </p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
                          Validates findings from the primary model
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
                          Identifies insights the first model might miss
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
                          Provides alternative perspectives on your health
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                    <p className="text-sm text-blue-300 flex items-start gap-2">
                      <Zap className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Real-Time Processing:</strong> Analysis happens automatically as new data arrives.
                        You'll receive instant notifications for any significant findings or anomalies.
                      </span>
                    </p>
                  </div>
                </div>
              </section>

              <section id="reports" className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    4
                  </div>
                  <h2 className="text-3xl font-bold text-white">Receive Comprehensive Reports</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                    <FileText className="h-12 w-12 text-green-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Daily Insights</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Quick overview of your key health metrics, trends, and daily recommendations
                    </p>
                    <div className="text-xs text-gray-500">
                      ✓ Key metrics summary<br />
                      ✓ Daily goals tracking<br />
                      ✓ Quick action items
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                    <TrendingUp className="h-12 w-12 text-blue-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Weekly Analysis</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Detailed analysis of trends, patterns, and progress toward your health goals
                    </p>
                    <div className="text-xs text-gray-500">
                      ✓ Trend visualization<br />
                      ✓ Pattern recognition<br />
                      ✓ Goal progress review
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                    <Brain className="h-12 w-12 text-purple-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Monthly Deep Dive</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Comprehensive health assessment with AI-generated insights and recommendations
                    </p>
                    <div className="text-xs text-gray-500">
                      ✓ Full health assessment<br />
                      ✓ AI recommendations<br />
                      ✓ Second opinion analysis
                    </div>
                  </div>
                </div>
              </section>

              <section id="action" className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    5
                  </div>
                  <h2 className="text-3xl font-bold text-white">Take Action on Insights</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                      <Target className="h-10 w-10 text-yellow-400 mb-3" />
                      <h3 className="text-lg font-bold text-white mb-2">Set Goals</h3>
                      <p className="text-gray-400 text-sm mb-3">
                        Based on your AI insights, set personalized health goals and track your progress
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                      <Zap className="h-10 w-10 text-green-400 mb-3" />
                      <h3 className="text-lg font-bold text-white mb-2">Follow Recommendations</h3>
                      <p className="text-gray-400 text-sm mb-3">
                        Get actionable, personalized recommendations you can implement immediately
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                      <Users className="h-10 w-10 text-blue-400 mb-3" />
                      <h3 className="text-lg font-bold text-white mb-2">Share with Healthcare Team</h3>
                      <p className="text-gray-400 text-sm mb-3">
                        Export reports to share with your doctors, nutritionists, or personal trainers
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                      <TrendingUp className="h-10 w-10 text-purple-400 mb-3" />
                      <h3 className="text-lg font-bold text-white mb-2">Track Progress</h3>
                      <p className="text-gray-400 text-sm mb-3">
                        Monitor your improvements over time with detailed progress tracking
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="black-box" className="scroll-mt-20">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <Box className="h-8 w-8 text-orange-400" />
                    Health Black Box: Your Personal Health Vault
                  </h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    A secure, encrypted repository that stores all your health data in one place
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 mb-8">
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Box className="h-6 w-6 text-orange-400" />
                        What is the Health Black Box?
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Like an aircraft's black box, your Health Black Box securely records and stores every piece
                        of your health data - from device readings to lab results, medications to symptoms.
                      </p>
                      <ul className="space-y-3 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span><strong className="text-white">Comprehensive Storage:</strong> All your health data in one encrypted vault</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span><strong className="text-white">Automatic Sync:</strong> Real-time updates from all connected devices</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span><strong className="text-white">Historical Records:</strong> Complete timeline of your health journey</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span><strong className="text-white">Emergency Access:</strong> Share with healthcare providers instantly</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Shield className="h-6 w-6 text-blue-400" />
                        Data Categories in Your Black Box
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                          <Activity className="h-5 w-5 text-blue-400 mb-2" />
                          <p className="text-white font-medium text-sm">Vital Signs & Metrics</p>
                          <p className="text-xs text-gray-400">Heart rate, BP, oxygen levels, temperature</p>
                        </div>
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                          <FileText className="h-5 w-5 text-green-400 mb-2" />
                          <p className="text-white font-medium text-sm">Medical Records</p>
                          <p className="text-xs text-gray-400">Lab results, prescriptions, diagnoses</p>
                        </div>
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                          <Heart className="h-5 w-5 text-red-400 mb-2" />
                          <p className="text-white font-medium text-sm">Lifestyle Data</p>
                          <p className="text-xs text-gray-400">Exercise, sleep, nutrition, stress levels</p>
                        </div>
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                          <Brain className="h-5 w-5 text-purple-400 mb-2" />
                          <p className="text-white font-medium text-sm">AI Insights</p>
                          <p className="text-xs text-gray-400">Analysis results, predictions, recommendations</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-900/20 border border-orange-600/30 rounded-lg">
                    <p className="text-sm text-orange-300 flex items-start gap-2">
                      <Box className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Your Data, Your Control:</strong> You own your Health Black Box. Export all data anytime,
                        delete it permanently, or share specific parts with healthcare providers. No lock-in, ever.
                      </span>
                    </p>
                  </div>
                </div>
              </section>

              <section id="dual-ai" className="scroll-mt-20">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <Sparkles className="h-8 w-8 text-purple-400" />
                    Why Dual AI System?
                  </h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    Two independent AI models provide more accurate, comprehensive, and reliable health insights
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-600/30 rounded-xl p-8">
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-white mb-2">Higher Accuracy</h3>
                      <p className="text-sm text-gray-400">
                        Cross-validation between models reduces errors and false positives
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Brain className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-white mb-2">Comprehensive View</h3>
                      <p className="text-sm text-gray-400">
                        Different AI approaches catch insights that others might miss
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-white mb-2">Confidence Scoring</h3>
                      <p className="text-sm text-gray-400">
                        Agreement between models indicates higher confidence in findings
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <p className="text-sm text-gray-300 text-center">
                      <strong className="text-white">Learn More:</strong> Visit our{' '}
                      <button
                        onClick={() => onNavigate && onNavigate('why-two-models')}
                        className="text-purple-400 hover:text-purple-300 underline"
                      >
                        Why Two Models
                      </button>{' '}
                      page for an in-depth explanation of our dual AI system
                    </p>
                  </div>
                </div>
              </section>

              <section id="categories" className="scroll-mt-20">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <Layers className="h-8 w-8 text-cyan-400" />
                    Health Categories We Track
                  </h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    Comprehensive tracking across all major health domains for complete wellness monitoring
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-600/30 rounded-xl p-6">
                    <Heart className="h-12 w-12 text-red-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Cardiovascular Health</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Heart rate, blood pressure, ECG, arterial health, circulation metrics
                    </p>
                    <div className="text-xs text-gray-500">
                      ✓ Resting heart rate<br />
                      ✓ Blood pressure trends<br />
                      ✓ Heart rate variability<br />
                      ✓ Cardiac risk factors
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-600/30 rounded-xl p-6">
                    <Activity className="h-12 w-12 text-blue-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Physical Activity</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Steps, exercise, calories, movement patterns, fitness levels
                    </p>
                    <div className="text-xs text-gray-500">
                      ✓ Daily activity levels<br />
                      ✓ Exercise duration/intensity<br />
                      ✓ Calorie expenditure<br />
                      ✓ Fitness progress
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-600/30 rounded-xl p-6">
                    <Brain className="h-12 w-12 text-purple-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Sleep & Recovery</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Sleep quality, duration, stages, recovery metrics, circadian rhythm
                    </p>
                    <div className="text-xs text-gray-500">
                      ✓ Sleep duration/quality<br />
                      ✓ REM & deep sleep<br />
                      ✓ Sleep consistency<br />
                      ✓ Recovery scores
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-600/30 rounded-xl p-6">
                    <Zap className="h-12 w-12 text-green-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Metabolic Health</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Blood glucose, weight, body composition, metabolic markers
                    </p>
                    <div className="text-xs text-gray-500">
                      ✓ Glucose levels<br />
                      ✓ Weight trends<br />
                      ✓ Body fat percentage<br />
                      ✓ Metabolic rate
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-600/30 rounded-xl p-6">
                    <Target className="h-12 w-12 text-yellow-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Mental Wellness</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Stress levels, mood tracking, mental health indicators, mindfulness
                    </p>
                    <div className="text-xs text-gray-500">
                      ✓ Stress markers<br />
                      ✓ Mood patterns<br />
                      ✓ Mental resilience<br />
                      ✓ Emotional balance
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border border-orange-600/30 rounded-xl p-6">
                    <FileText className="h-12 w-12 text-orange-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Clinical Markers</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      Lab results, biomarkers, medical tests, health screenings
                    </p>
                    <div className="text-xs text-gray-500">
                      ✓ Blood test results<br />
                      ✓ Cholesterol levels<br />
                      ✓ Hormone markers<br />
                      ✓ Vitamin levels
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-900/20 border border-cyan-600/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 text-center">And Many More Categories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                    <div>✓ Nutrition & Diet</div>
                    <div>✓ Hydration Levels</div>
                    <div>✓ Respiratory Health</div>
                    <div>✓ Women's Health</div>
                    <div>✓ Pain & Symptoms</div>
                    <div>✓ Medications</div>
                    <div>✓ Allergies</div>
                    <div>✓ Environmental Factors</div>
                  </div>
                </div>
              </section>

              <section id="learning" className="scroll-mt-20">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <BookOpen className="h-8 w-8 text-green-400" />
                    Learning Center
                  </h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    Expand your health knowledge with our comprehensive educational resources
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                    <BookOpen className="h-10 w-10 text-green-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Health Education Hub</h3>
                    <p className="text-gray-300 mb-4">
                      Access hundreds of articles, guides, and tutorials about health topics relevant to your data
                    </p>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Understanding your biomarkers and what they mean
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Evidence-based health improvement strategies
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Disease prevention and early detection
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                        Lifestyle optimization techniques
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                    <Brain className="h-10 w-10 text-purple-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">Personalized Recommendations</h3>
                    <p className="text-gray-300 mb-4">
                      Our AI suggests relevant learning materials based on your health data and goals
                    </p>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        Articles tailored to your health conditions
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        Videos and tutorials for your fitness level
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        Recipes and meal plans for your goals
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        Expert interviews and research summaries
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-600/30 rounded-xl p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Visit Our Learning Center</h3>
                      <p className="text-sm text-gray-400">Explore our full library of health education resources</p>
                    </div>
                    <button
                      onClick={() => onNavigate && onNavigate('learning-center')}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <BookOpen className="h-5 w-5" />
                      Go to Learning Center
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </section>

              <section id="faq" className="scroll-mt-20">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <HelpCircle className="h-8 w-8 text-yellow-400" />
                    Frequently Asked Questions
                  </h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    Quick answers to common questions about how BioMath Core works
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-2">
                      <span className="text-yellow-400">Q:</span>
                      How long does it take to see my first insights?
                    </h3>
                    <p className="text-gray-300 pl-6">
                      You'll receive initial insights within 24 hours of connecting your first device. More comprehensive
                      analysis becomes available as we collect more data points over the first week.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-2">
                      <span className="text-yellow-400">Q:</span>
                      Do I need special devices or can I use what I already have?
                    </h3>
                    <p className="text-gray-300 pl-6">
                      BioMath Core works with most popular health devices and apps. If you have an Apple Watch, Fitbit,
                      Garmin, or similar devices, you can connect them immediately. You can also manually enter data
                      or upload lab results.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-2">
                      <span className="text-yellow-400">Q:</span>
                      Is my health data really secure?
                    </h3>
                    <p className="text-gray-300 pl-6">
                      Yes. We use bank-level AES-256 encryption, are HIPAA compliant, and undergo regular security audits.
                      Your data is encrypted both in transit and at rest. We never sell or share your personal health
                      information with third parties.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-2">
                      <span className="text-yellow-400">Q:</span>
                      Can I share my reports with my doctor?
                    </h3>
                    <p className="text-gray-300 pl-6">
                      Absolutely! You can export any report as a PDF or share a secure link with your healthcare providers.
                      They'll see professional, easy-to-understand visualizations of your health data and AI insights.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-2">
                      <span className="text-yellow-400">Q:</span>
                      What makes the dual AI system better than a single AI?
                    </h3>
                    <p className="text-gray-300 pl-6">
                      Two independent AI models working together provide cross-validation, reducing errors and false positives.
                      Each model may catch insights the other misses, giving you a more comprehensive analysis. When both
                      models agree, you can be more confident in the findings.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-2">
                      <span className="text-yellow-400">Q:</span>
                      Can I cancel my subscription anytime?
                    </h3>
                    <p className="text-gray-300 pl-6">
                      Yes, you can cancel anytime with no penalties. You'll retain access to your account and data until
                      the end of your billing period. You can also export all your data before canceling.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Still Have Questions?</h3>
                      <p className="text-sm text-gray-400">Visit our complete FAQ page or contact our support team</p>
                    </div>
                    <button
                      onClick={() => onNavigate && onNavigate('faq')}
                      className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <HelpCircle className="h-5 w-5" />
                      View Full FAQ
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </section>

              <section id="security" className="scroll-mt-20">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    <Shield className="h-8 w-8 text-blue-400" />
                    Security & Privacy First
                  </h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    Your health data is protected with enterprise-grade security and HIPAA compliance
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-600/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Data Protection</h3>
                    <ul className="space-y-3 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>AES-256 encryption for all data at rest and in transit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>HIPAA-compliant infrastructure and processes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Regular security audits and penetration testing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Multi-factor authentication for account access</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-600/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Your Control</h3>
                    <ul className="space-y-3 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Complete control over who can access your data</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Export all your data anytime in standard formats</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Delete your account and all data permanently</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Transparent privacy policy with no hidden clauses</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => onNavigate && onNavigate('privacy-trust')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Shield className="h-5 w-5" />
                    Learn More About Our Privacy & Security
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </section>
            </div>

            <section className="mt-20 text-center">
              <div className="bg-gradient-to-br from-orange-900/30 to-pink-900/20 border border-orange-600/30 rounded-2xl p-12">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Health?</h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of users who are already leveraging AI to optimize their health and wellness
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => onNavigate && onNavigate('signup')}
                    className="px-8 py-4 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    Start Your Free Trial
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate('pricing')}
                    className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-lg font-semibold transition-all"
                  >
                    View Pricing Plans
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
