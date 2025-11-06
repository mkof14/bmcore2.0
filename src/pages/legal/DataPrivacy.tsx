import { Database } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface DataPrivacyProps {
  onNavigate: (page: string) => void;
}

export default function DataPrivacy({ onNavigate }: DataPrivacyProps) {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
            <Database className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Privacy</h1>
          <p className="text-gray-700">Last updated: October 21, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
            <p className="text-gray-900 font-medium mb-0">
              Your privacy is fundamental to BioMath Core. This page explains our commitment to protecting your personal and health data.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Data Minimization</h2>
            <p className="text-gray-800 mb-3">We collect only data necessary to provide our services:</p>
            <ul className="text-gray-800 space-y-2">
              <li>Essential account information (email, name)</li>
              <li>Health data you voluntarily provide</li>
              <li>Technical data for service operation</li>
              <li>No unnecessary or excessive data collection</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data You Control</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Access:</strong> View all data we have about you</li>
              <li><strong>Export:</strong> Download your data in portable formats</li>
              <li><strong>Correct:</strong> Update inaccurate information</li>
              <li><strong>Delete:</strong> Request permanent deletion</li>
              <li><strong>Restrict:</strong> Limit how we use your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Protect Your Data</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Encryption:</strong> 256-bit encryption at rest and TLS 1.3 in transit</li>
              <li><strong>Access Control:</strong> Strict role-based access limitations</li>
              <li><strong>Secure Infrastructure:</strong> SOC 2 Type II certified providers</li>
              <li><strong>Regular Audits:</strong> Security testing and vulnerability assessments</li>
              <li><strong>Employee Training:</strong> Regular privacy and security training</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. We Do NOT Sell Your Data</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <p className="text-gray-900 font-semibold mb-3">Clear Promise</p>
              <p className="text-gray-800 mb-0">
                BioMath Core does NOT sell, rent, or trade your personal or health information. Your data is yours, and we respect that.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limited Data Sharing</h2>
            <p className="text-gray-800 mb-3">We share data only when:</p>
            <ul className="text-gray-800 space-y-2">
              <li><strong>You consent:</strong> Explicit authorization required</li>
              <li><strong>Service providers:</strong> Trusted partners under strict contracts</li>
              <li><strong>Legal requirements:</strong> Valid legal process only</li>
              <li><strong>Anonymized research:</strong> Only aggregate, non-identifiable data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Anonymization and Aggregation</h2>
            <p className="text-gray-800 mb-3">
              For research and improvement, we may use anonymized, aggregated data that cannot identify you:
            </p>
            <ul className="text-gray-800 space-y-2">
              <li>All personal identifiers removed</li>
              <li>Combined with data from many users</li>
              <li>Cannot be re-identified</li>
              <li>Used to improve health insights for everyone</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Transparency</h2>
            <p className="text-gray-800 mb-3">We believe in clear, honest communication:</p>
            <ul className="text-gray-800 space-y-2">
              <li>Plain language privacy policy</li>
              <li>Clear explanations of data use</li>
              <li>Notification of any changes</li>
              <li>Open communication channels</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-800">
              BioMath Core is not intended for anyone under 18. We do not knowingly collect data from children. If we learn a child has provided information, we delete it immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Your Privacy Rights by Location</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>EU/EEA:</strong> GDPR rights (see GDPR page)</li>
              <li><strong>California:</strong> CCPA/CPRA rights</li>
              <li><strong>Other States:</strong> Rights under applicable state laws</li>
              <li><strong>International:</strong> Compliance with local privacy laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy by Design</h2>
            <p className="text-gray-800 mb-3">Privacy is built into everything we do:</p>
            <ul className="text-gray-800 space-y-2">
              <li>Privacy considerations in all product decisions</li>
              <li>Default privacy-protective settings</li>
              <li>Minimal data collection by design</li>
              <li>Regular privacy impact assessments</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Our Privacy Team</h2>
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
              <p className="text-gray-800">
                <strong>Privacy Officer</strong><br />
                BioMath Core<br />
                <strong>Email:</strong> privacy@biomathcore.com<br />
                <strong>DPO:</strong> dpo@biomathcore.com
              </p>
            </div>
          </section>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions About Your Privacy?</h3>
            <p className="text-gray-800 mb-3">We're here to help. Contact our privacy team anytime.</p>
            <button onClick={() => onNavigate('privacy-policy')} className="text-purple-600 hover:text-purple-700 font-medium">
              Read Full Privacy Policy →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
