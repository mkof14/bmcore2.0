import { ShieldCheck } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface TrustSafetyProps {
  onNavigate: (page: string) => void;
}

export default function TrustSafety({ onNavigate }: TrustSafetyProps) {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
            <ShieldCheck className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Trust & Safety</h1>
          <p className="text-gray-700">Last updated: October 21, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <p className="text-gray-900 font-medium mb-0">
              BioMath Core is committed to maintaining a safe, trustworthy platform. This page outlines our trust and safety commitments.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Our Commitments</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Transparency:</strong> Clear communication about how we operate</li>
              <li><strong>Security:</strong> Industry-leading protection for your data</li>
              <li><strong>Privacy:</strong> Respect for your personal information</li>
              <li><strong>Accuracy:</strong> Evidence-based health information</li>
              <li><strong>Responsibility:</strong> Ethical use of AI and technology</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Platform Safety</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Secure Infrastructure:</strong> SOC 2 certified cloud providers</li>
              <li><strong>Data Encryption:</strong> 256-bit encryption for all data</li>
              <li><strong>Regular Audits:</strong> Third-party security assessments</li>
              <li><strong>Threat Monitoring:</strong> 24/7 security monitoring</li>
              <li><strong>Incident Response:</strong> Rapid response to security issues</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Content Safety</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Evidence-Based:</strong> All health information backed by research</li>
              <li><strong>Expert Review:</strong> Content reviewed by health professionals</li>
              <li><strong>Clear Disclaimers:</strong> Transparent about limitations</li>
              <li><strong>Regular Updates:</strong> Content kept current with medical science</li>
              <li><strong>Moderation:</strong> Monitoring for harmful content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. AI Safety and Ethics</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Explainable AI:</strong> Transparent about how AI works</li>
              <li><strong>Bias Detection:</strong> Regular testing for algorithmic bias</li>
              <li><strong>Human Oversight:</strong> AI recommendations reviewed</li>
              <li><strong>Limitations:</strong> Clear about what AI can and cannot do</li>
              <li><strong>Continuous Improvement:</strong> Ongoing AI model refinement</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Protection</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Account Security:</strong> MFA and strong password requirements</li>
              <li><strong>Privacy Controls:</strong> You control your data</li>
              <li><strong>Fraud Prevention:</strong> Monitoring for suspicious activity</li>
              <li><strong>Abuse Prevention:</strong> Zero tolerance for platform abuse</li>
              <li><strong>Support Access:</strong> 24/7 customer support available</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Community Guidelines</h2>
            <p className="text-gray-800 mb-3">All users must:</p>
            <ul className="text-gray-800 space-y-2">
              <li>Provide accurate information</li>
              <li>Use the platform responsibly</li>
              <li>Respect other users</li>
              <li>Follow all applicable laws</li>
              <li>Report safety concerns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Medical Safety</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <p className="text-gray-900 font-semibold mb-3">Important Reminder</p>
              <p className="text-gray-800 mb-0">
                BioMath Core is NOT a medical service. Always consult qualified healthcare professionals for medical decisions. In emergencies, call 911 immediately.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Integrity</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Validation:</strong> Input validation and sanitization</li>
              <li><strong>Accuracy:</strong> Quality checks on health data</li>
              <li><strong>Backup:</strong> Regular encrypted backups</li>
              <li><strong>Recovery:</strong> Disaster recovery procedures</li>
              <li><strong>Retention:</strong> Clear data retention policies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Safety</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Vendor Review:</strong> Security assessment of all partners</li>
              <li><strong>Contracts:</strong> Strong data protection agreements</li>
              <li><strong>Monitoring:</strong> Ongoing partner compliance checks</li>
              <li><strong>Standards:</strong> SOC 2 certified service providers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Reporting Concerns</h2>
            <p className="text-gray-800 mb-3">Report safety or trust concerns:</p>
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
              <p className="text-gray-800 mb-2">
                <strong>Trust & Safety Team</strong><br />
                BioMath Core
              </p>
              <p className="text-gray-800">
                <strong>Security Issues:</strong> security@biomathcore.com<br />
                <strong>Privacy Concerns:</strong> privacy@biomathcore.com<br />
                <strong>Platform Abuse:</strong> abuse@biomathcore.com<br />
                <strong>General Support:</strong> support@biomathcore.com
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Continuous Improvement</h2>
            <p className="text-gray-800 mb-3">We continuously enhance trust and safety through:</p>
            <ul className="text-gray-800 space-y-2">
              <li>Regular security audits and updates</li>
              <li>User feedback incorporation</li>
              <li>Industry best practice adoption</li>
              <li>Technology upgrades</li>
              <li>Team training and development</li>
            </ul>
          </section>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Safety is Our Priority</h3>
            <p className="text-gray-800 mb-3">
              We're committed to maintaining the highest standards of trust and safety. If you have concerns or questions, please contact us.
            </p>
            <button onClick={() => onNavigate('contact')} className="text-green-600 hover:text-green-700 font-medium">
              Contact Trust & Safety Team →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
