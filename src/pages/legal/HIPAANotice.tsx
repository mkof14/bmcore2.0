import { Shield } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface HIPAANoticeProps {
  onNavigate: (page: string) => void;
}

export default function HIPAANotice({ onNavigate }: HIPAANoticeProps) {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">HIPAA Notice</h1>
          <p className="text-gray-700">Last updated: October 21, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3 mt-0">Important HIPAA Information</h3>
            <p className="text-gray-900 font-medium mb-0">
              This notice explains BioMath Core's relationship with the Health Insurance Portability and Accountability Act (HIPAA) and how it affects your use of our platform.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. BioMath Core is NOT a HIPAA Covered Entity</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-4">
              <p className="text-gray-900 font-semibold mb-3">IMPORTANT NOTICE</p>
              <p className="text-gray-800 mb-3">
                BioMath Core is NOT a healthcare provider, health plan, or healthcare clearinghouse. Therefore, we are NOT a "Covered Entity" under HIPAA regulations.
              </p>
              <p className="text-gray-800 mb-0">
                The health information you provide to BioMath Core is NOT protected by HIPAA. Instead, your information is protected by our Privacy Policy and applicable data protection laws.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. What is HIPAA?</h2>
            <p className="text-gray-800 mb-3">
              The Health Insurance Portability and Accountability Act (HIPAA) is a federal law that protects the privacy and security of health information held by:
            </p>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Healthcare Providers:</strong> Doctors, hospitals, clinics, pharmacies</li>
              <li><strong>Health Plans:</strong> Insurance companies, HMOs, Medicare, Medicaid</li>
              <li><strong>Healthcare Clearinghouses:</strong> Entities processing health information</li>
            </ul>
            <p className="text-gray-800 mt-3">BioMath Core does not fall into any of these categories.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How Your Information is Protected</h2>
            <p className="text-gray-800 mb-3">
              While HIPAA does not apply to BioMath Core, we take data protection seriously. Your information is protected by:
            </p>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li><strong>Our Privacy Policy:</strong> Governs collection, use, and disclosure of your data</li>
              <li><strong>Strong Security Measures:</strong> 256-bit encryption, secure servers, access controls</li>
              <li><strong>Limited Data Sharing:</strong> We do NOT sell your personal data</li>
              <li><strong>User Control:</strong> You can access, export, and delete your data</li>
              <li><strong>Applicable Laws:</strong> We comply with GDPR, CCPA, and other privacy laws</li>
            </ul>
            <p className="text-gray-800">For details, see our Privacy Policy and Security documentation.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Voluntary Data Submission</h2>
            <p className="text-gray-800 mb-3">
              All health information you provide to BioMath Core is <strong>voluntary</strong>. By using our Service:
            </p>
            <ul className="text-gray-800 space-y-2">
              <li>You choose what information to share</li>
              <li>You consent to our use of your data as described in our Privacy Policy</li>
              <li>You understand that HIPAA protections do not apply</li>
              <li>You accept the terms of our data protection practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Healthcare Provider Integration</h2>
            <p className="text-gray-800 mb-3">
              If you choose to share data with your healthcare provider through BioMath Core:
            </p>
            <ul className="text-gray-800 space-y-2">
              <li>Your healthcare provider IS a HIPAA Covered Entity</li>
              <li>Once shared, that data becomes part of your medical record</li>
              <li>HIPAA protections apply to data held by your healthcare provider</li>
              <li>Your provider's HIPAA Notice governs that data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data from HIPAA Covered Entities</h2>
            <p className="text-gray-800 mb-3">
              If you upload health data from HIPAA Covered Entities (such as lab results from your doctor):
            </p>
            <ul className="text-gray-800 space-y-2">
              <li>You are voluntarily sharing that data with BioMath Core</li>
              <li>HIPAA protections apply only while data is with the Covered Entity</li>
              <li>Once you upload to BioMath Core, our Privacy Policy applies</li>
              <li>We handle this data with the same high security standards as all data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. No Business Associate Agreement</h2>
            <p className="text-gray-800">
              BioMath Core does not enter into Business Associate Agreements (BAAs) with healthcare providers unless specifically contracted for enterprise services. For individual users, no BAA exists, and HIPAA regulations do not apply to our relationship.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights</h2>
            <p className="text-gray-800 mb-3">Under our Privacy Policy, you have rights similar to HIPAA rights:</p>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Access:</strong> Request a copy of your data</li>
              <li><strong>Correction:</strong> Update inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Export your data in machine-readable format</li>
              <li><strong>Restriction:</strong> Limit certain data processing</li>
            </ul>
            <p className="text-gray-800 mt-3">Contact privacy@biomathcore.com to exercise these rights.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. State Privacy Laws</h2>
            <p className="text-gray-800">
              Depending on your location, additional privacy laws may apply (such as CCPA in California, GDPR in Europe). BioMath Core complies with applicable state and international privacy regulations. See our Privacy Policy for details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Questions and Contact</h2>
            <p className="text-gray-800 mb-3">For questions about HIPAA, data protection, or privacy:</p>
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
              <p className="text-gray-800">
                <strong>BioMath Core</strong><br />
                Privacy Officer<br />
                <strong>Email:</strong> privacy@biomathcore.com<br />
                <strong>Support:</strong> support@biomathcore.com
              </p>
            </div>
          </section>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
            <p className="text-gray-800 mb-3">
              BioMath Core is NOT covered by HIPAA, but we protect your health information through strong security measures, transparent privacy practices, and compliance with applicable data protection laws.
            </p>
            <button onClick={() => onNavigate('privacy-policy')} className="text-blue-600 hover:text-blue-700 font-medium">
              Read Our Privacy Policy →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
