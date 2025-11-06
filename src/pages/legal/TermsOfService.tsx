import { FileText } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface TermsOfServiceProps {
  onNavigate: (page: string) => void;
}

export default function TermsOfService({ onNavigate }: TermsOfServiceProps) {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-700">Last updated: October 21, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <p className="text-gray-900 font-medium mb-0">
              Please read these Terms of Service carefully before using BioMath Core. By accessing or using our platform, you agree to be bound by these terms.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-800 mb-3">
              By creating an account, accessing, or using BioMath Core, you agree to comply with and be legally bound by these Terms of Service. If you do not agree to these Terms, you must not access or use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
            <p className="text-gray-800 mb-3">BioMath Core is a wellness intelligence platform that provides AI-powered health insights, biomarker analysis, wearable device data integration, and health tracking.</p>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-gray-900 font-semibold mb-2">IMPORTANT: NOT MEDICAL ADVICE</p>
              <p className="text-gray-800 mb-0">BioMath Core is NOT a healthcare provider. Our Service does NOT provide medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical decisions.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Eligibility and Account</h2>
            <p className="text-gray-800 mb-3">You must be at least 18 years old to use BioMath Core. By creating an account, you agree to:</p>
            <ul className="text-gray-800 space-y-2">
              <li>Provide accurate information</li>
              <li>Maintain account security</li>
              <li>Accept responsibility for all account activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct</h2>
            <p className="text-gray-800 mb-3">You agree NOT to:</p>
            <ul className="text-gray-800 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Upload false or fraudulent information</li>
              <li>Attempt unauthorized access</li>
              <li>Use automated systems without authorization</li>
              <li>Harass or harm other users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Subscription and Payment</h2>
            <ul className="text-gray-800 space-y-2">
              <li>Subscriptions renew automatically unless cancelled</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>You may cancel anytime; cancellation takes effect at period end</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-800">The Service and all content is owned by BioMath Core and protected by intellectual property laws. We grant you a limited license for personal, non-commercial use.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Medical Disclaimer</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-gray-800 mb-3"><strong>BioMath Core is NOT a medical service.</strong> We do NOT provide medical advice, diagnosis, or treatment. Always seek qualified healthcare providers for medical questions. Never disregard professional medical advice because of BioMath Core information. In emergencies, call 911 immediately.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers</h2>
            <p className="text-gray-800">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. We do not warrant uninterrupted, error-free, or secure service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-800">BioMath Core shall not be liable for indirect, incidental, or consequential damages. Our total liability shall not exceed the amount you paid in the preceding 12 months.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
            <p className="text-gray-800">These Terms are governed by the laws of North Carolina, USA. Disputes shall be resolved through binding arbitration.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact</h2>
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
              <p className="text-gray-800"><strong>BioMath Core</strong><br /><strong>Email:</strong> legal@biomathcore.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
