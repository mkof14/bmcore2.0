import { AlertTriangle } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface DisclaimerProps {
  onNavigate: (page: string) => void;
}

export default function Disclaimer({ onNavigate }: DisclaimerProps) {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Medical Disclaimer</h1>
          <p className="text-gray-700">Last updated: October 21, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3 mt-0">IMPORTANT: READ CAREFULLY</h3>
            <p className="text-gray-900 font-medium mb-0">
              This disclaimer governs your use of BioMath Core. By using our platform, you acknowledge and agree to this disclaimer. If you do not agree, discontinue use immediately.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Not Medical Advice</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-4">
              <p className="text-gray-900 font-semibold mb-3">BioMath Core is NOT a medical service, healthcare provider, or covered entity under HIPAA.</p>
              <p className="text-gray-800 mb-3">The information, content, insights, and recommendations provided through BioMath Core are for:</p>
              <ul className="text-gray-800 space-y-2 mb-3">
                <li><strong>Educational purposes only</strong></li>
                <li><strong>Wellness optimization guidance</strong></li>
                <li><strong>General health information</strong></li>
                <li><strong>Personal research and knowledge</strong></li>
              </ul>
              <p className="text-gray-800 mb-0"><strong>Our Service does NOT:</strong></p>
              <ul className="text-gray-800 space-y-2 mt-2">
                <li>Provide medical advice, diagnosis, or treatment</li>
                <li>Replace consultation with qualified healthcare professionals</li>
                <li>Create doctor-patient relationships</li>
                <li>Prescribe medications, therapies, or medical treatments</li>
                <li>Provide emergency medical services</li>
                <li>Offer clinical medical opinions</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Consult Healthcare Professionals</h2>
            <p className="text-gray-800 mb-3"><strong>ALWAYS seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding:</strong></p>
            <ul className="text-gray-800 space-y-2 mb-4">
              <li>Medical conditions or symptoms</li>
              <li>Lab results or biomarker interpretations</li>
              <li>Treatment options or medications</li>
              <li>Dietary or lifestyle changes</li>
              <li>Exercise programs or physical activity</li>
              <li>Supplement use or dosages</li>
            </ul>
            <p className="text-gray-800"><strong>NEVER disregard professional medical advice or delay in seeking it because of something you have read or learned through BioMath Core.</strong></p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Emergency Situations</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-gray-900 font-bold mb-3">IF YOU THINK YOU MAY HAVE A MEDICAL EMERGENCY, CALL 911 OR YOUR LOCAL EMERGENCY NUMBER IMMEDIATELY.</p>
              <p className="text-gray-800 mb-3">BioMath Core is NOT an emergency service. Do not use our platform for emergency situations or time-sensitive medical questions.</p>
              <p className="text-gray-800 mb-0">Signs requiring immediate medical attention include but are not limited to: chest pain, difficulty breathing, severe bleeding, loss of consciousness, stroke symptoms, severe allergic reactions.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. No Professional Relationship</h2>
            <p className="text-gray-800 mb-3">
              Use of BioMath Core does NOT create a doctor-patient, therapist-patient, or any other healthcare professional relationship between you and BioMath Core, its employees, contractors, or partners.
            </p>
            <p className="text-gray-800">
              Any communication through the platform is for informational and educational purposes only and does not constitute professional medical advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. AI and Algorithm Limitations</h2>
            <p className="text-gray-800 mb-3">BioMath Core uses artificial intelligence and algorithms to analyze data and provide insights. However:</p>
            <ul className="text-gray-800 space-y-2">
              <li>AI can make errors and may not account for all individual factors</li>
              <li>Algorithms are not substitutes for professional medical judgment</li>
              <li>Technology has limitations and may not detect all health issues</li>
              <li>Results should be verified by qualified healthcare professionals</li>
              <li>AI insights are general and may not apply to your specific situation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Accuracy and Completeness</h2>
            <p className="text-gray-800 mb-3">
              While we strive for accuracy, BioMath Core makes no representations or warranties about:
            </p>
            <ul className="text-gray-800 space-y-2">
              <li>The accuracy, reliability, or completeness of any information</li>
              <li>The suitability of information for your individual circumstances</li>
              <li>The currentness of medical knowledge or recommendations</li>
              <li>The interpretation of wearable device data or biomarkers</li>
            </ul>
            <p className="text-gray-800 mt-3">Medical science evolves constantly. Information that is current today may be outdated tomorrow.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Individual Variability</h2>
            <p className="text-gray-800">
              Every individual is unique. What works for one person may not work for another. Health recommendations must be personalized by qualified healthcare professionals who understand your complete medical history, current conditions, and individual circumstances.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Content</h2>
            <p className="text-gray-800">
              BioMath Core may include content from third parties, links to external websites, or integration with third-party devices. We are not responsible for the accuracy, reliability, or content of such third-party information or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Assumption of Risk</h2>
            <p className="text-gray-800 mb-3">
              By using BioMath Core, you acknowledge and agree that:
            </p>
            <ul className="text-gray-800 space-y-2">
              <li>You use the Service at your own risk</li>
              <li>You are responsible for any decisions or actions you take based on the information provided</li>
              <li>You will consult healthcare professionals before making health-related decisions</li>
              <li>BioMath Core is not liable for any outcomes resulting from use of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Regulatory Status</h2>
            <p className="text-gray-800">
              BioMath Core is a wellness platform and is not regulated as a medical device by the FDA or other regulatory agencies. Our Service is not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Disclaimer</h2>
            <p className="text-gray-800">
              We may update this disclaimer at any time. Continued use of BioMath Core after changes constitutes acceptance of the updated disclaimer. Check this page regularly for updates.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
              <p className="text-gray-800">
                <strong>BioMath Core</strong><br />
                Legal Department<br />
                <strong>Email:</strong> legal@biomathcore.com
              </p>
            </div>
          </section>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">By using BioMath Core, you acknowledge that you have read, understood, and agree to this Medical Disclaimer.</h3>
            <p className="text-gray-800 mb-3">If you do not agree with any part of this disclaimer, you must discontinue use of the Service immediately.</p>
            <button onClick={() => onNavigate('contact')} className="text-red-600 hover:text-red-700 font-medium">Contact Us →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
