import { Shield } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface PrivacyPolicyProps {
  onNavigate: (page: string) => void;
}

export default function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-700">Last updated: October 21, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
            <p className="text-gray-900 font-medium mb-0">
              BioMath Core ("we," "us," or "our") is committed to protecting your privacy and ensuring the security of your personal and health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our wellness intelligence platform.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3 mt-0">Important Notice</h3>
            <p className="text-gray-800 mb-0">
              BioMath Core is a wellness platform that provides educational information and personalized insights. We are NOT a medical service provider, healthcare provider, or covered entity under HIPAA. We do NOT diagnose, treat, or provide medical advice. Our platform is designed for wellness optimization and preventive health support only.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1 Personal Information</h3>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li><strong>Account Information:</strong> Name, email address, username, password (encrypted)</li>
              <li><strong>Contact Details:</strong> Phone number, mailing address (optional)</li>
              <li><strong>Billing Information:</strong> Payment card details (processed securely through third-party payment processors), billing address</li>
              <li><strong>Profile Information:</strong> Date of birth, gender, time zone, preferences</li>
              <li><strong>Communication Records:</strong> Support tickets, feedback, survey responses</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.2 Health and Wellness Data</h3>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li><strong>Self-Reported Data:</strong> Health questionnaire responses, wellness goals, lifestyle information</li>
              <li><strong>Biomarker Data:</strong> Lab results you choose to upload (blood work, metabolic panels, etc.)</li>
              <li><strong>Wearable Device Data:</strong> Activity, sleep, heart rate, and other metrics from connected devices (Fitbit, Apple Watch, etc.)</li>
              <li><strong>Health Assessments:</strong> Symptom tracking, mood logs, energy levels</li>
              <li><strong>AI Interaction Data:</strong> Queries, conversations with our AI health assistant</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.3 Technical Information</h3>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent, click patterns</li>
              <li><strong>Cookies and Tracking:</strong> Session cookies, preference cookies, analytics cookies</li>
              <li><strong>Location Data:</strong> Approximate location based on IP address (not precise GPS)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-800 mb-3">We use your information for the following purposes:</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Service Provision</h3>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li>Generate personalized health insights and wellness recommendations</li>
              <li>Create AI-powered health reports and trend analysis</li>
              <li>Process and display data from connected devices</li>
              <li>Provide second opinion analysis services</li>
              <li>Enable goal tracking and progress monitoring</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Platform Improvement</h3>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li>Train and improve our AI models and algorithms</li>
              <li>Conduct research on wellness patterns (using aggregated, anonymized data)</li>
              <li>Test new features and services</li>
              <li>Analyze usage patterns to enhance user experience</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Communication</h3>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li>Send service updates and important notifications</li>
              <li>Respond to support requests and inquiries</li>
              <li>Deliver educational content and wellness tips</li>
              <li>Send marketing communications (with your consent, opt-out available)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4 Legal and Security</h3>
            <ul className="text-gray-800 space-y-2">
              <li>Comply with legal obligations and regulatory requirements</li>
              <li>Prevent fraud, abuse, and security threats</li>
              <li>Enforce our Terms of Service</li>
              <li>Protect the rights and safety of our users and BioMath Core</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Sharing and Disclosure</h2>
            <p className="text-gray-800 mb-3">
              <strong>We do NOT sell your personal data.</strong> We may share your information only in the following circumstances:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 With Your Consent</h3>
            <p className="text-gray-800 mb-4">We will share your information when you explicitly authorize us to do so, such as:</p>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li>Sharing data with healthcare providers you designate</li>
              <li>Exporting your data to third-party health apps</li>
              <li>Participating in research studies (opt-in only)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Service Providers</h3>
            <p className="text-gray-800 mb-4">We engage trusted third-party service providers who assist us in operating our platform:</p>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li><strong>Cloud Infrastructure:</strong> Supabase, AWS, Google Cloud (secure data hosting)</li>
              <li><strong>Payment Processing:</strong> Stripe (we do not store full credit card details)</li>
              <li><strong>Analytics:</strong> Google Analytics (anonymized data only)</li>
              <li><strong>Customer Support:</strong> Support ticketing systems</li>
              <li><strong>Email Services:</strong> Transactional email providers</li>
            </ul>
            <p className="text-gray-800">All service providers are contractually bound to maintain confidentiality and security standards.</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Legal Requirements</h3>
            <p className="text-gray-800 mb-4">We may disclose your information if required by law or in response to:</p>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li>Valid legal process (subpoena, court order)</li>
              <li>Government or regulatory requests</li>
              <li>Investigations of fraud or illegal activity</li>
              <li>Emergencies involving potential harm to individuals</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.4 Business Transfers</h3>
            <p className="text-gray-800">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you via email and prominent notice on our platform before any such transfer occurs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-800 mb-3">We implement comprehensive security measures to protect your information:</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Safeguards</h3>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li><strong>Encryption:</strong> 256-bit AES encryption for data at rest; TLS 1.3 for data in transit</li>
              <li><strong>Access Controls:</strong> Role-based access control (RBAC), multi-factor authentication (MFA)</li>
              <li><strong>Infrastructure:</strong> SOC 2 Type II certified cloud providers</li>
              <li><strong>Monitoring:</strong> 24/7 security monitoring, intrusion detection systems</li>
              <li><strong>Testing:</strong> Regular penetration testing and vulnerability assessments</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Organizational Safeguards</h3>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li>Employee background checks and confidentiality agreements</li>
              <li>Least-privilege access policies</li>
              <li>Regular security training for staff</li>
              <li>Incident response and breach notification procedures</li>
            </ul>

            <p className="text-gray-800">
              While we employ industry-leading security practices, no system is 100% secure. We cannot guarantee absolute security but are committed to protecting your data to the best of our ability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Privacy Rights</h2>
            <p className="text-gray-800 mb-3">You have the following rights regarding your personal information:</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Access and Portability</h3>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li>Request a copy of all personal data we hold about you</li>
              <li>Export your data in a machine-readable format (JSON, CSV)</li>
              <li>View and download your health reports and insights</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Correction and Update</h3>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li>Correct inaccurate or incomplete information</li>
              <li>Update your profile and preferences at any time</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Deletion</h3>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li>Request deletion of your account and associated data</li>
              <li>Delete specific data points or entries</li>
              <li>Note: Some data may be retained for legal compliance (billing records, etc.)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.4 Restrict or Object</h3>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li>Restrict processing of certain data</li>
              <li>Object to automated decision-making</li>
              <li>Opt-out of marketing communications</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">5.5 Withdraw Consent</h3>
            <p className="text-gray-800">
              Where we process data based on consent, you may withdraw consent at any time. This will not affect the lawfulness of processing before withdrawal.
            </p>

            <p className="text-gray-800 mt-4">
              To exercise any of these rights, contact us at <strong>privacy@biomathcore.com</strong>. We will respond within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-800 mb-3">We retain your information for as long as necessary to provide services and comply with legal obligations:</p>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Active Accounts:</strong> Data retained while account is active</li>
              <li><strong>Deleted Accounts:</strong> Most data deleted within 90 days; some data retained for legal compliance (financial records: 7 years)</li>
              <li><strong>Anonymized Data:</strong> Aggregated, anonymized data may be retained indefinitely for research</li>
              <li><strong>Backups:</strong> Backup copies deleted within 90 days of account deletion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-800 mb-3">We use cookies and similar technologies:</p>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li><strong>Essential Cookies:</strong> Required for platform functionality (authentication, security)</li>
              <li><strong>Functional Cookies:</strong> Remember preferences and settings</li>
              <li><strong>Analytics Cookies:</strong> Understand usage patterns (opt-out available)</li>
              <li><strong>Marketing Cookies:</strong> Deliver relevant content (opt-out available)</li>
            </ul>
            <p className="text-gray-800">You can manage cookie preferences through your browser settings or our cookie banner.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-800">
              BioMath Core is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will delete it immediately. If you believe a child has provided information, contact us at privacy@biomathcore.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-800 mb-3">
              BioMath Core is based in the United States. If you access our services from outside the U.S., your information will be transferred to and processed in the U.S. By using our services, you consent to this transfer.
            </p>
            <p className="text-gray-800">
              For users in the European Economic Area (EEA), we comply with GDPR requirements and use Standard Contractual Clauses (SCCs) for data transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-800 mb-3">
              We may update this Privacy Policy from time to time. Changes will be effective upon posting. Material changes will be communicated via:
            </p>
            <ul className="text-gray-800 space-y-2">
              <li>Email notification to registered users</li>
              <li>Prominent notice on our platform</li>
              <li>Updated "Last modified" date at the top of this policy</li>
            </ul>
            <p className="text-gray-800 mt-3">
              Your continued use of BioMath Core after changes indicates acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-800 mb-3">
              For questions, concerns, or requests regarding this Privacy Policy or your personal information:
            </p>
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
              <p className="text-gray-800 mb-2">
                <strong>BioMath Core</strong><br />
                Privacy Officer
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Email:</strong> privacy@biomathcore.com<br />
                <strong>Support:</strong> support@biomathcore.com
              </p>
            </div>
          </section>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions About Privacy?</h3>
            <p className="text-gray-800 mb-3">
              Our Privacy Officer is here to help. Contact us at privacy@biomathcore.com
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Contact Us →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
