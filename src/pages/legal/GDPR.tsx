import { Globe } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface GDPRProps {
  onNavigate: (page: string) => void;
}

export default function GDPR({ onNavigate }: GDPRProps) {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GDPR Compliance</h1>
          <p className="text-gray-700">Last updated: October 21, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <p className="text-gray-900 font-medium mb-0">
              BioMath Core complies with the European Union's General Data Protection Regulation (GDPR). This page explains your rights and how we protect your data.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. GDPR Overview</h2>
            <p className="text-gray-800 mb-3">
              The GDPR is a comprehensive data protection law that applies to organizations processing personal data of EU/EEA residents. BioMath Core respects your privacy rights under GDPR.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Your GDPR Rights</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Right to Access</h3>
            <p className="text-gray-800 mb-4">You can request a copy of all personal data we hold about you. We'll provide this in a structured, commonly used, machine-readable format.</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Right to Rectification</h3>
            <p className="text-gray-800 mb-4">You can correct inaccurate or incomplete personal data.</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Right to Erasure ("Right to be Forgotten")</h3>
            <p className="text-gray-800 mb-4">You can request deletion of your personal data, subject to legal retention requirements.</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Right to Restriction of Processing</h3>
            <p className="text-gray-800 mb-4">You can request that we limit how we use your data.</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Right to Data Portability</h3>
            <p className="text-gray-800 mb-4">You can receive your data in a portable format and transmit it to another service.</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Right to Object</h3>
            <p className="text-gray-800 mb-4">You can object to processing of your data for marketing or other purposes.</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Right to Withdraw Consent</h3>
            <p className="text-gray-800 mb-4">You can withdraw consent for data processing at any time.</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Right to Lodge a Complaint</h3>
            <p className="text-gray-800">You can file a complaint with your local data protection authority.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Legal Basis for Processing</h2>
            <p className="text-gray-800 mb-3">We process your data based on:</p>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Consent:</strong> You've given explicit consent for processing</li>
              <li><strong>Contract:</strong> Processing is necessary to fulfill our service agreement</li>
              <li><strong>Legitimate Interests:</strong> For service improvement and security</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Transfers</h2>
            <p className="text-gray-800 mb-3">
              BioMath Core is based in the United States. When we transfer your data outside the EU/EEA:
            </p>
            <ul className="text-gray-800 space-y-2">
              <li>We use Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>We ensure adequate data protection measures</li>
              <li>We comply with GDPR requirements for international transfers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
            <p className="text-gray-800 mb-3">We retain your data only as long as necessary:</p>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Active accounts:</strong> While your account is active</li>
              <li><strong>Deleted accounts:</strong> Most data deleted within 90 days</li>
              <li><strong>Legal requirements:</strong> Some data retained for compliance (e.g., financial records: 7 years)</li>
              <li><strong>Anonymized data:</strong> May be retained indefinitely for research</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Protection Officer</h2>
            <p className="text-gray-800 mb-3">For GDPR-related questions or to exercise your rights:</p>
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
              <p className="text-gray-800">
                <strong>Data Protection Officer</strong><br />
                BioMath Core<br />
                <strong>Email:</strong> dpo@biomathcore.com<br />
                <strong>Privacy Email:</strong> privacy@biomathcore.com
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Exercising Your Rights</h2>
            <p className="text-gray-800 mb-3">To exercise any GDPR rights:</p>
            <ul className="text-gray-800 space-y-2">
              <li>Email dpo@biomathcore.com or privacy@biomathcore.com</li>
              <li>We'll verify your identity to protect your data</li>
              <li>We'll respond within 30 days (extendable to 90 days for complex requests)</li>
              <li>We'll provide requested information free of charge</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Supervisory Authority</h2>
            <p className="text-gray-800 mb-3">You have the right to lodge a complaint with your local supervisory authority if you believe we've violated GDPR:</p>
            <p className="text-gray-800">
              Find your local data protection authority at: <strong>https://edpb.europa.eu/about-edpb/board/members_en</strong>
            </p>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions About GDPR?</h3>
            <p className="text-gray-800 mb-3">Contact our Data Protection Officer for assistance.</p>
            <button onClick={() => onNavigate('contact')} className="text-blue-600 hover:text-blue-700 font-medium">
              Contact DPO →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
