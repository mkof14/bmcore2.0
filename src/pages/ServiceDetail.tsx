import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Lock, Copy, Printer, Share2, Download, FileDown, ChevronDown, ChevronUp, BookOpen, Sparkles, Send, Brain, Cpu, Bot, GitCompare, Zap } from 'lucide-react';
import { serviceCategories } from '../data/services';
import { supabase } from '../lib/supabase';

const categoryColors: Record<string, string> = {
  'critical-health': 'text-orange-400',
  'everyday-wellness': 'text-green-400',
  'longevity': 'text-pink-400',
  'mental-wellness': 'text-cyan-400',
  'fitness-performance': 'text-yellow-400',
  'womens-health': 'text-pink-400',
  'mens-health': 'text-blue-400',
  'beauty-skincare': 'text-pink-400',
  'nutrition-diet': 'text-green-400',
  'sleep-recovery': 'text-indigo-400',
  'environmental-health': 'text-teal-400',
  'family-health': 'text-orange-400',
  'preventive-medicine': 'text-cyan-400',
  'biohacking': 'text-blue-400',
  'senior-care': 'text-slate-300',
  'eye-health': 'text-blue-400',
  'digital-therapeutics': 'text-indigo-400',
  'general-sexual': 'text-red-400',
  'mens-sexual-health': 'text-blue-400',
  'womens-sexual-health': 'text-pink-400',
};

interface ServiceDetailProps {
  onNavigate: (page: string, param?: string) => void;
  serviceId?: string;
}

const serviceFAQDatabase: Record<string, Array<{ question: string; answer: string }>> = {
  'blood-glucose': [
    { question: 'What does blood glucose monitoring tell me?', answer: 'Blood glucose patterns reveal how your body processes energy, responds to food, and regulates insulin. This insight helps optimize diet timing and prevent energy crashes.' },
    { question: 'Why track glucose if I\'m not diabetic?', answer: 'Even in healthy individuals, glucose stability affects energy, focus, mood, and long-term metabolic health. Early awareness prevents future issues.' },
    { question: 'When should I check my glucose?', answer: 'Morning fasting, before/after meals, and during energy dips give the most insight. Continuous monitors provide 24/7 data automatically.' },
    { question: 'How often should I review trends?', answer: 'Weekly reviews help identify patterns. Daily checks are useful during diet changes or new routines.' },
    { question: 'Can this replace medical testing?', answer: 'No. This is educational wellness tracking. Medical diabetes testing requires clinical lab work and professional interpretation.' },
    { question: 'What improves glucose stability?', answer: 'Consistent meal timing, balanced macros, regular movement, quality sleep, and stress management all support stable glucose levels.' }
  ],
  'heart-rate': [
    { question: 'What does heart rate variability reveal?', answer: 'HRV shows your nervous system balance between stress and recovery. Higher HRV typically indicates better resilience and adaptation.' },
    { question: 'Why track resting heart rate?', answer: 'Resting HR trends reveal fitness improvements, stress accumulation, illness onset, and recovery quality over time.' },
    { question: 'When is the best time to measure?', answer: 'Morning, right after waking, before getting out of bed provides the most consistent baseline measurement.' },
    { question: 'How often should I check?', answer: 'Daily morning checks create reliable trends. Wearables provide continuous monitoring automatically.' },
    { question: 'Does this replace medical monitoring?', answer: 'No. For heart conditions or arrhythmia concerns, always consult a cardiologist. This is wellness tracking, not medical diagnosis.' },
    { question: 'What improves heart metrics?', answer: 'Regular aerobic exercise, quality sleep, stress management, hydration, and avoiding excessive caffeine all support healthy heart patterns.' }
  ],
  'sleep': [
    { question: 'What does sleep analysis measure?', answer: 'Sleep tracking reveals duration, quality, sleep stages, wake frequency, and consistency patterns that affect recovery and daytime function.' },
    { question: 'Why analyze sleep stages?', answer: 'Deep sleep supports physical recovery, REM sleep aids memory and emotional processing. Balanced stages indicate restorative sleep.' },
    { question: 'When should I review my sleep data?', answer: 'Weekly reviews show patterns. Daily checks help during routine changes or if you notice daytime fatigue.' },
    { question: 'How much data is needed?', answer: 'One week provides initial patterns. 2-4 weeks reveal meaningful trends and cycle variations.' },
    { question: 'Can this diagnose sleep disorders?', answer: 'No. Sleep apnea, insomnia, or other disorders require medical sleep studies. This tracks general wellness patterns.' },
    { question: 'What improves sleep quality?', answer: 'Consistent bedtime, cool dark room, limited screens before bed, regular exercise, and stress management all enhance sleep.' }
  ],
  'stress': [
    { question: 'How is stress measured biologically?', answer: 'Physiological stress shows through heart rate variability, cortisol patterns, sleep disruption, and nervous system markers.' },
    { question: 'Why track stress objectively?', answer: 'Subjective stress perception doesn\'t always match biological impact. Objective data reveals hidden stress accumulation before burnout.' },
    { question: 'When should I check stress levels?', answer: 'During high-demand periods, life changes, or when noticing fatigue, mood shifts, or sleep issues.' },
    { question: 'How often is tracking useful?', answer: 'Daily during stressful periods helps identify triggers. Weekly checks maintain awareness during normal times.' },
    { question: 'Does this replace mental health care?', answer: 'No. For anxiety, depression, or chronic stress, professional therapy and medical support are essential. This supports self-awareness.' },
    { question: 'What reduces biological stress?', answer: 'Regular movement, breathing exercises, quality sleep, social connection, nature time, and mindfulness practices all lower stress markers.' }
  ],
  'nutrition': [
    { question: 'What does nutritional analysis assess?', answer: 'Nutrition tracking evaluates macro balance, micronutrient intake, meal timing, hydration, and how food choices affect energy and biomarkers.' },
    { question: 'Why analyze nutrition patterns?', answer: 'Most people have hidden deficiencies or imbalances. Data-driven nutrition optimizes energy, immunity, recovery, and long-term health.' },
    { question: 'When should I track nutrition?', answer: 'During diet changes, unexplained fatigue, training programs, or when optimizing health goals.' },
    { question: 'How long should I track?', answer: '2-4 weeks reveals true patterns. Shorter periods miss weekly variation and eating cycles.' },
    { question: 'Can this replace a dietitian?', answer: 'No. Complex medical nutrition therapy needs professional guidance. This provides educational awareness and general optimization.' },
    { question: 'What improves nutritional status?', answer: 'Whole food diversity, consistent meal timing, adequate protein, colorful vegetables, hydration, and mindful eating all enhance nutrition.' }
  ],
  'recovery': [
    { question: 'What does recovery tracking measure?', answer: 'Recovery analysis combines sleep quality, HRV, resting heart rate, muscle soreness, and readiness scores to assess your body\'s restoration status.' },
    { question: 'Why monitor recovery?', answer: 'Training without adequate recovery leads to overtraining, injury, and diminished results. Recovery data guides smart training intensity.' },
    { question: 'When should I check recovery?', answer: 'Every morning before training helps adjust daily intensity. Post-workout tracking guides rest periods.' },
    { question: 'How does recovery guide training?', answer: 'High recovery = train hard. Low recovery = rest or light activity. This prevents overtraining and optimizes adaptation.' },
    { question: 'Is this medical recovery tracking?', answer: 'No. Post-surgery or injury recovery requires medical supervision. This is athletic and wellness recovery optimization.' },
    { question: 'What enhances recovery?', answer: 'Quality sleep, protein intake, hydration, active rest, stretching, stress management, and strategic training intensity all improve recovery.' }
  ]
};

export default function ServiceDetail({ onNavigate, serviceId }: ServiceDetailProps) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [showSecondOpinion, setShowSecondOpinion] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAI, setSelectedAI] = useState<'ai1' | 'ai2' | 'both'>('ai1');
  const [userQuestion, setUserQuestion] = useState('');
  const [firstOpinion, setFirstOpinion] = useState('');
  const [secondOpinion, setSecondOpinion] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsSignedIn(!!user);
  };

  if (!serviceId) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-16 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Service not found</p>
      </div>
    );
  }

  const [categoryId, sId] = serviceId.split('/');
  const category = serviceCategories.find(c => c.id === categoryId);
  const service = category?.services.find(s => s.id === sId);

  if (!category || !service) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Service not found</p>
          <button
            onClick={() => onNavigate('services-catalog')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const serviceFAQs = serviceFAQDatabase[sId] || [
    { question: 'What does this service analyze?', answer: `This service examines ${service.name.toLowerCase()} patterns to provide personalized wellness insights.` },
    { question: 'Why is this helpful?', answer: 'Understanding these patterns helps you make informed decisions about your health routines.' },
    { question: 'When should I use it?', answer: 'Use this whenever you want clarity about this aspect of your health.' },
    { question: 'How often is enough?', answer: 'Find a rhythm that feels supportive - weekly or monthly checks work for most people.' },
    { question: 'Does this replace a doctor?', answer: 'No. This is educational wellness support. Medical concerns require professional consultation.' },
    { question: 'What improves results?', answer: 'Consistent data, honest responses, and regular tracking all create more accurate insights.' }
  ];

  const handleGenerateReport = async () => {
    if (!isSignedIn) {
      onNavigate('signin');
      return;
    }

    if (!userQuestion.trim()) {
      alert('Please enter your health question or concern');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const ai1Opinion = `AI-1 Analysis: Based on your question about ${service.name.toLowerCase()} and your health profile:\n\nYour patterns show positive trends with stable regulation. The data suggests balanced responses and healthy adaptation in this area.\n\n${userQuestion}\n\nConsidering your specific concern, the indicators point toward a supportive baseline. Small lifestyle adjustments can enhance these results further.\n\nThis is educational guidance, not medical diagnosis.`;

      const ai2Opinion = `AI-2 Perspective: Looking at your ${service.name.toLowerCase()} question from another analytical angle:\n\n${userQuestion}\n\nThe patterns confirm stability with room for optimization. Your body's signals indicate positive trajectory. Consider this insight complementary to the first opinion.\n\nBoth views suggest you're on a good path with opportunities for gentle improvement through consistent habits.\n\nRemember: wellness is a journey, and you're making progress.`;

      if (selectedAI === 'both') {
        setFirstOpinion(ai1Opinion);
        setSecondOpinion(ai2Opinion);
        setShowSecondOpinion(true);
      } else if (selectedAI === 'ai1') {
        setFirstOpinion(ai1Opinion);
      } else {
        setFirstOpinion(ai2Opinion);
      }

      setReportGenerated(true);
      setIsGenerating(false);
    }, 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(firstOpinion + '\n\n' + (showSecondOpinion ? secondOpinion : ''));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.name,
        text: firstOpinion
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors pt-16">
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/20 to-transparent"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <button
            onClick={() => onNavigate('services-catalog', categoryId)}
            className="flex items-center space-x-2 text-orange-500 hover:text-orange-400 mb-6 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to {category.name}</span>
          </button>

          {/* Header */}
          <div className="mb-6">
            <h1 className={`text-4xl font-bold mb-3 ${categoryColors[categoryId] || 'text-white'}`}>
              {service.name}
            </h1>
            <p className="text-lg text-gray-300">
              {service.description}
            </p>
          </div>

          {/* Access Gate */}
          {!isSignedIn && (
            <div className="mb-6 bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">
                    Sign in to Member Zone to unlock full functionality and generate real reports
                  </h3>
                  <button
                    onClick={() => onNavigate('signin')}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Ask Your Health Question */}
          <div className="mb-6 bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <span>Ask Your Health Question</span>
            </h3>
            <textarea
              value={userQuestion}
              onChange={(e) => {
                setUserQuestion(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              placeholder={`Example: "I've been feeling tired in the afternoons. What could my ${service.name.toLowerCase()} data reveal about this?"`}
              rows={2}
              className="w-full px-4 py-3 text-sm border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none mb-3 resize-none overflow-hidden"
              style={{ minHeight: '48px', maxHeight: '300px' }}
            />

            {/* AI Model Selector - Compact Inline Style */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-400 mb-2 block">
                AI Model:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedAI('ai1')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedAI === 'ai1'
                      ? 'bg-orange-500 text-white shadow-md scale-105'
                      : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-orange-500'
                  }`}
                >
                  <Bot className="h-3.5 w-3.5" />
                  <span>AI-1</span>
                  <span className="opacity-70">Supportive</span>
                </button>
                <button
                  onClick={() => setSelectedAI('ai2')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedAI === 'ai2'
                      ? 'bg-green-500 text-white shadow-md scale-105'
                      : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-green-500'
                  }`}
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span>AI-2</span>
                  <span className="opacity-70">Analytical</span>
                </button>
                <button
                  onClick={() => setSelectedAI('both')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedAI === 'both'
                      ? 'bg-purple-500 text-white shadow-md scale-105'
                      : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-purple-500'
                  }`}
                >
                  <GitCompare className="h-3.5 w-3.5" />
                  <span>Both</span>
                  <span className="opacity-70">Dual</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={isGenerating || !userQuestion.trim()}
              className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Zap className="h-4 w-4" />
              <span>{isGenerating ? 'Generating Report...' : 'Generate Report'}</span>
            </button>
          </div>

          {/* Report Result */}
          {reportGenerated && (
            <div className="mb-6 space-y-4">
              <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-bold rounded">
                    {selectedAI === 'ai1' ? 'AI-1' : selectedAI === 'ai2' ? 'AI-2' : 'AI-1'}
                  </span>
                  <span>First Opinion</span>
                </h3>
                <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                  {firstOpinion}
                </p>
              </div>

              {selectedAI !== 'both' && secondOpinion === '' && (
                <div className="text-center">
                  <button
                    onClick={() => {
                      setSecondOpinion(`AI-${selectedAI === 'ai1' ? '2' : '1'} Perspective: Looking at your ${service.name.toLowerCase()} question from another analytical angle:\n\n${userQuestion}\n\nThe patterns confirm stability with room for optimization. Your body's signals indicate positive trajectory.\n\nThis complementary view suggests you're on a good path.`);
                      setShowSecondOpinion(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <span>Get Second Opinion</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-gray-400 mt-1.5">Need more clarity?</p>
                </div>
              )}

              {(showSecondOpinion || selectedAI === 'both') && secondOpinion && (
                <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded">
                      {selectedAI === 'ai1' ? 'AI-2' : 'AI-1'}
                    </span>
                    <span>Second Opinion</span>
                  </h3>
                  <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                    {secondOpinion}
                  </p>
                </div>
              )}

              {/* Tools Bar */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:border-orange-500 text-gray-300 hover:text-white text-xs rounded-lg transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:border-orange-500 text-gray-300 hover:text-white text-xs rounded-lg transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:border-orange-500 text-gray-300 hover:text-white text-xs rounded-lg transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share</span>
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 hover:border-orange-500 text-gray-300 hover:text-white text-xs rounded-lg transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg transition-colors"
                >
                  <FileDown className="h-3.5 w-3.5" />
                  <span>PDF Export</span>
                </button>
              </div>
            </div>
          )}

          {/* Learning Center Link */}
          <div className="mb-6">
            <button
              onClick={() => onNavigate('learning-center', `topic-${sId}`)}
              className="w-full px-4 py-3 bg-gray-900/50 backdrop-blur border border-gray-800 hover:border-orange-500 text-orange-400 hover:text-orange-300 text-sm font-medium rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Learn more about {service.name}</span>
            </button>
          </div>

          {/* Service-Level FAQ */}
          <div className="mb-6 max-w-3xl">
            <h3 className="text-lg font-bold text-white mb-4">
              FAQ
            </h3>
            <div className="space-y-3">
              {serviceFAQs.map((faq, index) => (
                <div key={index} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur">
                  <button
                    onClick={() => setOpenFAQ(openFAQ === `faq-${index}` ? null : `faq-${index}`)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
                  >
                    <span className="text-sm font-medium text-white">{faq.question}</span>
                    {openFAQ === `faq-${index}` ? (
                      <ChevronUp className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFAQ === `faq-${index}` && (
                    <div className="px-4 py-3 border-t border-gray-800">
                      <p className="text-sm text-gray-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Related Services */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-white mb-4">
              You may also find helpful
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              {category.services.filter(s => s.id !== sId).slice(0, 3).map((relatedService) => (
                <button
                  key={relatedService.id}
                  onClick={() => onNavigate('service-detail', `${categoryId}/${relatedService.id}`)}
                  className="p-4 bg-gray-900/50 backdrop-blur border border-gray-800 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/20 rounded-xl transition-all text-left group"
                >
                  <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors flex items-center">
                    {relatedService.name}
                    <ChevronLeft className="h-3 w-3 ml-auto transform rotate-180" />
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {relatedService.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Understanding Block - Moved to Bottom */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Understanding This Insight
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>What it means:</strong> This service helps you understand patterns in your {service.name.toLowerCase()}
                and how they relate to your daily wellbeing.
              </p>
              <p>
                <strong>Why it matters:</strong> Your body constantly sends signals. Understanding these signals
                helps you make choices that support your health journey without clinical pressure.
              </p>
              <p>
                <strong>How it supports you:</strong> This insight provides educational context and gentle guidance.
                It's designed to increase clarity and reduce stress, not create urgency.
              </p>
              <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-md border border-green-200 dark:border-green-800">
                <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">💡 Tip</p>
                <p className="text-xs">
                  Consistency matters more than perfection. Small, regular check-ins help you understand
                  trends over time, which is more valuable than any single data point.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
