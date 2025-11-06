import { Shield, Lock, Eye, FileCheck, Server, UserCheck } from 'lucide-react';

interface NavigationProps {
  onNavigate: (page: string) => void;
}

export default function PrivacyTrust({ onNavigate }: NavigationProps) {
  const features = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Your health data is encrypted at rest and in transit using industry-standard AES-256 encryption."
    },
    {
      icon: Eye,
      title: "You Control Your Data",
      description: "You decide what data to share, who can access it, and can delete it at any time."
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Our platform meets all HIPAA requirements for protecting sensitive health information."
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Data stored in SOC 2 certified data centers with regular security audits."
    },
    {
      icon: FileCheck,
      title: "GDPR Compliant",
      description: "Full compliance with European data protection regulations and user rights."
    },
    {
      icon: UserCheck,
      title: "No Data Selling",
      description: "We never sell your data. Your privacy is our top priority, not a revenue stream."
    }
  ];

  const policies = [
    {
      title: "Privacy Policy",
      description: "Comprehensive details on how we collect, use, and protect your data",
      page: "privacy-policy"
    },
    {
      title: "HIPAA Notice",
      description: "Our commitment to HIPAA compliance and healthcare data protection",
      page: "hipaa-notice"
    },
    {
      title: "GDPR Compliance",
      description: "How we meet European data protection standards",
      page: "gdpr"
    },
    {
      title: "Security Practices",
      description: "Technical and organizational measures we take to protect your data",
      page: "security"
    },
    {
      title: "Data Privacy",
      description: "Your rights and our responsibilities regarding your personal data",
      page: "data-privacy"
    },
    {
      title: "Trust & Safety",
      description: "Our commitment to creating a safe and trustworthy platform",
      page: "trust-safety"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-6">
            <Shield className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy & Trust Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your health data is deeply personal. We take its protection seriously with industry-leading security measures and transparent practices.
          </p>
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Our Commitment to Your Privacy
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Transparency & Compliance
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy, index) => (
              <button
                key={index}
                onClick={() => onNavigate(policy.page)}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all text-left group"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {policy.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {policy.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Your Data, Your Control</h2>
            <p className="text-lg opacity-90 mb-8">
              We believe in complete transparency. You have the right to access, export, or delete your data at any time. No questions asked.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-sm">
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="opacity-90">Data Ownership</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">0</div>
                <div className="opacity-90">Data Sales</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="opacity-90">Security Monitoring</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Questions About Privacy?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our privacy team is here to help. If you have any questions about how we protect your data, please don't hesitate to reach out.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Contact Privacy Team
          </button>
        </div>
      </div>
    </div>
  );
}
