import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { generateFAQSchema, injectStructuredData } from '../lib/structuredData';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
      >
        <span className="font-semibold text-gray-900 dark:text-white pr-8">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}

interface FAQProps {
  onNavigate: (page: string) => void;
}

export default function FAQ({ onNavigate }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };

  const faqSections = [
    {
      title: "Understanding Our Approach",
      items: [
        {
          id: "what-makes-different",
          question: "What makes BioMath Core different from other wellness apps?",
          answer: "Rather than tracking numbers, we convert your body's signals into meaning, then into clear, gentle, personalized guidance. We focus on understanding, not overwhelm. Reassurance, not urgency. Interpretation, not diagnosis."
        },
        {
          id: "is-this-medical",
          question: "Is this a medical diagnosis tool?",
          answer: "No. BioMath Core is a wellness intelligence platform focused on interpretation, education, and preventive wellness. We help you understand how your body is responding day-to-day, but we never diagnose medical conditions. When something needs professional attention, we guide you clearly."
        },
        {
          id: "ux-tone",
          question: "What can I expect from the guidance?",
          answer: "Our guidance is supportive, not directive. Simple, not technical. We use no fear-based language. You never \"fail\" — you are learning. Every insight is designed to increase your confidence and reduce stress, not create anxiety."
        }
      ]
    },
    {
      title: "Getting Started",
      items: [
        {
          id: "what-is",
          question: "What is BioMath Core?",
          answer: "BioMath Core is a wellness intelligence platform that helps you understand how your body is responding day-to-day and guides you with clear, gentle, personalized actions. It improves clarity, emotional safety, and proactive self-care without clinical pressure."
        },
        {
          id: "who-for",
          question: "Who is this platform for?",
          answer: "For people who want clarity, calm explanations, and step-by-step improvement — not medical jargon or dashboards full of numbers. The platform works for beginners, busy professionals, wellness users, and anyone improving long-term health."
        },
        {
          id: "need-medical",
          question: "Do I need medical knowledge to use it?",
          answer: "No. Everything is explained in simple language. Reports, goals, and guidance are written as if you are talking to a human coach — not a clinician."
        },
        {
          id: "is-medical",
          question: "Is this a medical service?",
          answer: "No. BioMath Core is a wellness platform, not a medical provider. It does not diagnose or treat medical conditions."
        },
        {
          id: "need-devices",
          question: "Do I need devices to start?",
          answer: "No. You can begin with questionnaires only. Devices make reports more accurate, but they are optional."
        }
      ]
    },
    {
      title: "Subscriptions & Payment",
      items: [
        {
          id: "purchase",
          question: "How can I purchase a subscription?",
          answer: "You can subscribe directly on the Pricing page. After checkout you will unlock advanced features inside the Member Zone."
        },
        {
          id: "plans",
          question: "What is included in each plan?",
          answer: "Basic: standard reports, core assistant, devices, and dashboards.\nPro: second opinion, deeper insights, PDF export, and smart nudges.\nEnterprise: team-level features, analytics, and dedicated onboarding."
        },
        {
          id: "free-start",
          question: "Can I start for free?",
          answer: "Yes. Free onboarding is available before upgrading."
        },
        {
          id: "change-plan",
          question: "How do I upgrade or downgrade?",
          answer: "You can change plans any time from your Account settings."
        },
        {
          id: "cancel",
          question: "How can I cancel a subscription?",
          answer: "You can cancel in 1 click inside your billing settings. Your access remains active until the end of the billing cycle."
        }
      ]
    },
    {
      title: "Onboarding & Questionnaires",
      items: [
        {
          id: "why-questionnaires",
          question: "Why do I need to answer questionnaires?",
          answer: "They allow the system to understand your baseline and provide personalized context instead of generic tips."
        },
        {
          id: "onboarding-time",
          question: "How long does onboarding take?",
          answer: "Usually 3–5 minutes."
        },
        {
          id: "skip-questions",
          question: "Can I skip some questions?",
          answer: "Yes. You can skip and complete them later."
        },
        {
          id: "update-answers",
          question: "Can I update answers later?",
          answer: "Yes, at any time from the Member Zone."
        },
        {
          id: "refresh-frequency",
          question: "How often should I refresh my answers?",
          answer: "Whenever your health routines, sleep pattern, workload, or lifestyle change."
        }
      ]
    },
    {
      title: "Categories & Services",
      items: [
        {
          id: "categories-org",
          question: "How are categories organized?",
          answer: "Services are grouped by real-life needs: sleep, energy, nutrition, stress, hormones, prevention, performance, etc."
        },
        {
          id: "use-all",
          question: "Do I need to use all categories?",
          answer: "No. You only use what is relevant — nothing is forced."
        },
        {
          id: "add-services",
          question: "Can I add more services later?",
          answer: "Yes. You can activate new ones anytime."
        },
        {
          id: "which-service",
          question: "How do I know which service fits me?",
          answer: "The platform guides you based on your snapshot of the day and most recent report."
        },
        {
          id: "adaptive",
          question: "Are services static or adaptive?",
          answer: "They are adaptive — content evolves with your data and progress."
        }
      ]
    },
    {
      title: "Member Zone",
      items: [
        {
          id: "what-member-zone",
          question: "What is the Member Zone?",
          answer: "It is your personal interactive dashboard where all features live: reports, goals, snapshots, devices, second opinion, and chat."
        },
        {
          id: "dashboard-features",
          question: "What can I do on the dashboard?",
          answer: "You see your current state, your trend, your goals for today, recent progress, and one gentle step to take."
        },
        {
          id: "daily-snapshot",
          question: "What is the Daily Snapshot?",
          answer: "A short explanation of \"how your system is today\" plus one soft recommendation."
        },
        {
          id: "goals-habits",
          question: "How do goals and habits work?",
          answer: "You choose small actions tied to your physiology. The platform adapts difficulty automatically."
        },
        {
          id: "nudges",
          question: "What are nudges?",
          answer: "Short supportive prompts based on your state — not on timers."
        },
        {
          id: "download-reports",
          question: "Can I download my reports?",
          answer: "Yes. PDF export is available in Pro."
        },
        {
          id: "devices-connect",
          question: "Can I connect and disconnect devices?",
          answer: "Yes, anytime."
        }
      ]
    },
    {
      title: "AI Health Advisor",
      items: [
        {
          id: "assistant-features",
          question: "What can the assistant do?",
          answer: "It explains your state, helps with reports, answers health-related questions in plain language, and converts insights into actions."
        },
        {
          id: "text-voice",
          question: "Is it text only or also voice?",
          answer: "Supports both text and (in Pro) voice interaction."
        },
        {
          id: "vs-chatbots",
          question: "How is this different from chatbots?",
          answer: "It uses your personal context and state, not generic answers."
        },
        {
          id: "step-by-step",
          question: "Can it guide me step-by-step?",
          answer: "Yes. It can walk you through a report, plan, or routine like a human guide."
        },
        {
          id: "learning",
          question: "Does the assistant learn over time?",
          answer: "Yes — it remembers style preferences (simple vs deep explanations)."
        }
      ]
    },
    {
      title: "Second Opinion",
      items: [
        {
          id: "second-opinion-what",
          question: "What is \"Second Opinion\" in BioMath Core?",
          answer: "It is a feature where you see two interpretations from two AI models — physiology view vs behavioral view."
        },
        {
          id: "why-two-models",
          question: "Why two models?",
          answer: "Because health has more than one dimension — body response and lifestyle influence."
        },
        {
          id: "when-use-second",
          question: "When should I use Second Opinion?",
          answer: "Whenever you want extra depth, reassurance, or a second explanation style."
        },
        {
          id: "compare-merge",
          question: "Can I compare or merge them?",
          answer: "Yes. You can compare side-by-side and merge into a final summary."
        },
        {
          id: "replace-doctor",
          question: "Does second opinion replace a doctor?",
          answer: "No. It complements human care — it does not replace medical professionals."
        }
      ]
    },
    {
      title: "Devices & Monitoring",
      items: [
        {
          id: "supported-devices",
          question: "Which devices are supported?",
          answer: "Apple Watch, Samsung, Fitbit, Amazon Halo, Oura, continuous glucose monitors, and other certified devices."
        },
        {
          id: "connect-device",
          question: "How do I connect a device?",
          answer: "Through a guided step-by-step connection flow in the Member Zone."
        },
        {
          id: "store-data",
          question: "Do you store raw health data?",
          answer: "No. We interpret metrics — we do not need to store raw streams."
        },
        {
          id: "syncing-stops",
          question: "What if syncing stops?",
          answer: "You'll see a reminder and can reconnect in one click."
        },
        {
          id: "disable-sharing",
          question: "Can I disable data sharing?",
          answer: "Yes — instantly from settings."
        }
      ]
    },
    {
      title: "Privacy & Security",
      items: [
        {
          id: "data-protection",
          question: "How is my data protected?",
          answer: "We use encryption, separation of personally identifiable data, and anonymization layers."
        },
        {
          id: "sell-data",
          question: "Do you sell or trade data?",
          answer: "No. We never sell, license, or monetize personal health data."
        },
        {
          id: "request-deletion",
          question: "Can I request deletion?",
          answer: "Yes. Data deletion is available on demand."
        },
        {
          id: "export-data",
          question: "Can I export my data?",
          answer: "Yes, as PDF or raw JSON summary."
        },
        {
          id: "data-storage",
          question: "Where is data stored?",
          answer: "In secure data centers compliant with modern privacy standards."
        }
      ]
    },
    {
      title: "Wellness vs Medical",
      items: [
        {
          id: "diagnostic-tool",
          question: "Is this a diagnostic tool?",
          answer: "No. It is an insight and guidance platform, not a diagnostic system."
        },
        {
          id: "emergency",
          question: "What should I do in a medical emergency?",
          answer: "Contact emergency services or a physician. The platform is not for urgent care."
        },
        {
          id: "replace-doctor-medical",
          question: "Can this replace my doctor?",
          answer: "No — it complements professional care."
        },
        {
          id: "share-with-doctor",
          question: "Can I share results with my doctor?",
          answer: "Yes. You can export or show reports anytime."
        }
      ]
    }
  ];

  useEffect(() => {
    const allFaqs = faqSections.flatMap(section =>
      section.items.map(item => ({
        question: item.question,
        answer: item.answer
      }))
    );
    const faqSchema = generateFAQSchema(allFaqs);
    injectStructuredData(faqSchema);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <SEO
        title="FAQ - Frequently Asked Questions"
        description="Find answers to common questions about BioMath Core: services, pricing, data security, reports, and more. Get quick answers to your health analytics questions."
        keywords={['biomath core faq', 'health platform questions', 'wellness service help', 'health analytics faq', 'common questions']}
        url="/faq"
      />
      <Header onNavigate={onNavigate} />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about BioMath Core
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-12">
            {faqSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <FAQItem
                      key={item.id}
                      question={item.question}
                      answer={item.answer}
                      isOpen={openItems.has(item.id)}
                      onToggle={() => toggleItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 text-center border border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're here to help. Reach out to our support team.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
