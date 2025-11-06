import { useState } from 'react';
import { Shield, ChevronDown, Check, Zap, Users } from 'lucide-react';
import BackButton from '../components/BackButton';
import PaymentConfirmationModal from '../components/PaymentConfirmationModal';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

interface ServicesProps {
  onNavigate: (page: string) => void;
}

export default function Services({ onNavigate }: ServicesProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: 'core',
      name: 'Core',
      description: 'Essential health analytics for individuals',
      monthlyPrice: 19,
      yearlyPrice: 190,
      categories: '3 Categories',
      features: [
        'Basic health dashboard',
        '3 service categories access',
        '10 GB Model Archive storage',
        'Monthly health reports',
        'Email support',
        'Data encryption',
        'Device connectivity (up to 2 devices)'
      ]
    },
    {
      id: 'daily',
      name: 'Daily',
      description: 'Daily insights and comprehensive tracking',
      monthlyPrice: 39,
      yearlyPrice: 390,
      categories: '10 Categories',
      popular: true,
      features: [
        'Everything in Core',
        '10 Categories',
        '50 GB Model Archive storage',
        'Daily health reports',
        'AI Assistant access',
        'Priority email support',
        'Device connectivity (up to 5 devices)',
        'Lab results integration',
        'Genetic data analysis'
      ]
    },
    {
      id: 'max',
      name: 'Max',
      description: 'Complete health intelligence platform',
      monthlyPrice: 79,
      yearlyPrice: 790,
      categories: '20 Categories',
      features: [
        'Everything in Daily',
        'All 20 service categories',
        '200 GB Model Archive storage',
        'Real-time AI insights',
        '24/7 priority support',
        'Unlimited device connectivity',
        'Advanced predictive analytics',
        'Custom report generation',
        'Family accounts (up to 5 members)',
        'API access for developers'
      ]
    }
  ];

  const comparisonFeatures = [
    { name: 'Health dashboard', core: 'Basic', daily: 'Advanced', max: 'Advanced' },
    { name: 'Service categories', core: '3', daily: '10 Categories', max: 'All 20' },
    { name: 'Model Archive storage', core: '10 GB', daily: '50 GB', max: '200 GB' },
    { name: 'Health reports', core: 'Monthly', daily: 'Daily', max: 'Real-time' },
    { name: 'Support', core: 'Email', daily: 'Priority email', max: '24/7 priority' },
    { name: 'Data encryption', core: true, daily: true, max: true },
    { name: 'Device connectivity', core: 'Up to 2', daily: 'Up to 5', max: 'Unlimited' },
    { name: 'AI Assistant', core: false, daily: true, max: true },
    { name: 'Lab results integration', core: false, daily: true, max: true },
    { name: 'Genetic data analysis', core: false, daily: true, max: true },
    { name: 'Predictive analytics', core: false, daily: false, max: true },
    { name: 'Custom report generation', core: false, daily: false, max: true },
    { name: 'Family accounts', core: false, daily: false, max: 'Up to 5' },
    { name: 'API access', core: false, daily: false, max: true }
  ];

  const testimonials = [
    {
      quote: "Perfect for tracking my basic health metrics. Simple and effective.",
      author: "Sarah M.",
      plan: "Core"
    },
    {
      quote: "The AI Assistant has transformed how I understand my health data. Worth every penny.",
      author: "Michael R.",
      plan: "Daily"
    },
    {
      quote: "As a healthcare professional, the comprehensive analytics and family accounts are invaluable.",
      author: "Dr. Emily Chen",
      plan: "Max"
    }
  ];

  const faqs = [
    {
      question: 'Can I switch plans at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the cost accordingly.'
    },
    {
      question: 'What happens after the 5-day trial?',
      answer: 'After your 5-day trial ends, you\'ll be automatically charged based on your selected plan and billing period. You can cancel anytime during the trial without being charged.'
    },
    {
      question: 'Is my health data secure?',
      answer: 'Absolutely. All plans include enterprise-grade encryption, secure data storage, and compliance with HIPAA regulations. Your health data is never shared with third parties without your explicit consent.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes! Annual billing saves you approximately 17% compared to monthly payments. You\'ll see the discounted price when you select yearly billing above.'
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getPlanBadgeColor = (planName: string) => {
    switch(planName.toLowerCase()) {
      case 'core': return 'text-orange-500';
      case 'daily': return 'text-orange-500';
      case 'max': return 'text-orange-500';
      default: return 'text-orange-500';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0e1a] text-gray-900 dark:text-white transition-colors">
      <SEO
        title="Services & Pricing - Health Analytics Plans"
        description="Choose from Core, Daily, or Max plans for AI-powered health analytics. 5-day free trial, 200+ services across 20 health categories. From $19/month. Secure, HIPAA-compliant."
        keywords={['health analytics pricing', 'subscription plans', 'health monitoring service', 'wellness plans', 'AI health tracking cost', 'personalized health service']}
        url="/services"
      />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton onNavigate={onNavigate} />

          <section className="text-center mb-16 mt-12">
            <p className="text-orange-500 text-sm font-semibold tracking-wider mb-4">PRICING PLANS</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Choose Your <span className="text-blue-400">Plan</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Each plan expands the Human Data Model. More categories = deeper insights.
            </p>

            <div className="inline-flex items-center bg-gray-800 rounded-full p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-gray-900'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  billingPeriod === 'yearly'
                    ? 'bg-white text-gray-900'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly
              </button>
            </div>
          </section>

          <section className="mb-20">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const price = getPrice(plan);
                const isPopular = plan.popular;

                return (
                  <div
                    key={plan.id}
                    className={`relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-8 ${
                      isPopular ? 'border-2 border-blue-500' : 'border border-gray-800'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-orange-500 text-white px-6 py-1 rounded-full text-xs font-bold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold">${price}</span>
                        <span className="text-gray-400">/{billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                      </div>
                    </div>

                    <div className="mb-6 relative h-40 rounded-xl overflow-hidden bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 flex items-center justify-center">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
                      }}></div>
                      <span className="relative text-2xl font-bold z-10">{plan.categories}</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-orange-500 mt-1">●</span>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        isPopular
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                      }`}
                    >
                      Get Started
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12">Compare All Features</h2>

            <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-5 px-6 font-semibold text-white">Feature</th>
                      <th className="text-center py-5 px-6 font-semibold text-white">Core</th>
                      <th className="text-center py-5 px-6 font-semibold text-white">Daily</th>
                      <th className="text-center py-5 px-6 font-semibold text-white">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={index} className="border-b border-gray-800/50 last:border-0">
                        <td className="py-4 px-6 text-white">{feature.name}</td>
                        <td className="py-4 px-6 text-center">
                          {typeof feature.core === 'boolean' ? (
                            feature.core ? (
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            ) : (
                              <span className="text-gray-600">—</span>
                            )
                          ) : (
                            <span className="text-gray-300">{feature.core}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {typeof feature.daily === 'boolean' ? (
                            feature.daily ? (
                              <span className="inline-block w-2 h-2 bg-orange-500 rounded-full"></span>
                            ) : (
                              <span className="text-gray-600">—</span>
                            )
                          ) : (
                            <span className="text-gray-300">{feature.daily}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {typeof feature.max === 'boolean' ? (
                            feature.max ? (
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            ) : (
                              <span className="text-gray-600">—</span>
                            )
                          ) : (
                            <span className="text-gray-300">{feature.max}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl p-8 border border-gray-800"
                >
                  <p className="text-gray-300 italic mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{testimonial.author}</span>
                    <span className={`text-sm font-semibold ${getPlanBadgeColor(testimonial.plan)}`}>
                      {testimonial.plan}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <Shield className="w-16 h-16 text-orange-500 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl border border-gray-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full px-8 py-5 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
                  >
                    <span className="font-semibold text-white text-lg">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        openFAQ === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFAQ === index && (
                    <div className="px-8 pb-6 text-gray-400">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-12 text-center">
              <p className="text-xl text-gray-300 mb-4">
                All plans include a <span className="font-bold text-white">5-day trial</span> with payment details required upfront.
              </p>
              <button
                onClick={() => onNavigate('about')}
                className="text-orange-500 hover:text-orange-400 font-semibold inline-flex items-center gap-2 transition-colors"
              >
                Learn more about our platform →
              </button>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12">Why Choose BioMath Core?</h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl p-8 border border-gray-800">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Real-Time Insights</h3>
                <p className="text-gray-400">
                  Get instant feedback on your health data with AI-powered analysis that learns from your patterns.
                </p>
              </div>

              <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl p-8 border border-gray-800">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">HIPAA Compliant</h3>
                <p className="text-gray-400">
                  Your health data is protected with enterprise-grade security and full HIPAA compliance.
                </p>
              </div>

              <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl p-8 border border-gray-800">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Expert Support</h3>
                <p className="text-gray-400">
                  Access to health data specialists and priority support to help you understand your insights.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-500/10 to-blue-500/10 border border-orange-500/30 rounded-2xl p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Health?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of users who are taking control of their health with data-driven insights.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleSelectPlan(plans[1])}
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all"
                >
                  Start Your Free Trial
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all border border-gray-700"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {selectedPlan && (
        <PaymentConfirmationModal
          isOpen={showConfirmation}
          onClose={() => {
            setShowConfirmation(false);
            setSelectedPlan(null);
          }}
          onConfirm={handleConfirmPayment}
          plan={{
            name: selectedPlan.name,
            price: billingPeriod === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice,
            billingPeriod,
            categories: selectedPlan.categories,
            features: selectedPlan.features
          }}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );

  async function handleSelectPlan(plan: any) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      onNavigate('signin');
      return;
    }

    setSelectedPlan(plan);
    setShowConfirmation(true);
    setError(null);
  }

  async function handleConfirmPayment() {
    if (!selectedPlan) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const result = await createSubscription(
        user.id,
        selectedPlan.id,
        billingPeriod
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to create subscription');
      }

      setShowConfirmation(false);
      setSelectedPlan(null);

      onNavigate('member-zone');
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }
}
