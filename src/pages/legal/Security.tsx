import { Lock } from 'lucide-react';
import BackButton from '../../components/BackButton';

interface SecurityProps {
  onNavigate: (page: string) => void;
}

export default function Security({ onNavigate }: SecurityProps) {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
            <Lock className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Security</h1>
          <p className="text-gray-700">Last updated: October 21, 2025</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <p className="text-gray-900 font-medium mb-0">
              BioMath Core takes security seriously. This page explains the technical and organizational measures we use to protect your data.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Data Encryption</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Data at Rest:</strong> 256-bit AES encryption for all stored data</li>
              <li><strong>Data in Transit:</strong> TLS 1.3 encryption for all data transmissions</li>
              <li><strong>Database Encryption:</strong> Full database encryption with rotating keys</li>
              <li><strong>Password Protection:</strong> Bcrypt hashing with salt for all passwords</li>
              <li><strong>Backups:</strong> Encrypted backups stored in secure locations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Access Controls</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Role-Based Access Control (RBAC):</strong> Strict permission systems</li>
              <li><strong>Multi-Factor Authentication (MFA):</strong> Required for admin access</li>
              <li><strong>Least Privilege Principle:</strong> Employees have minimum necessary access</li>
              <li><strong>Regular Audits:</strong> Quarterly access reviews and revocations</li>
              <li><strong>Session Management:</strong> Automatic timeout after inactivity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Infrastructure Security</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Cloud Providers:</strong> SOC 2 Type II certified (Supabase, AWS, Google Cloud)</li>
              <li><strong>Network Security:</strong> Firewalls, intrusion detection/prevention systems</li>
              <li><strong>DDoS Protection:</strong> Enterprise-grade protection against attacks</li>
              <li><strong>Load Balancing:</strong> Distributed infrastructure for reliability</li>
              <li><strong>Redundancy:</strong> Multi-region backups and failover systems</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Application Security</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Secure Development:</strong> Security best practices in code</li>
              <li><strong>Input Validation:</strong> All user inputs sanitized and validated</li>
              <li><strong>SQL Injection Prevention:</strong> Parameterized queries only</li>
              <li><strong>XSS Protection:</strong> Content Security Policy (CSP) headers</li>
              <li><strong>CSRF Protection:</strong> Token-based request validation</li>
              <li><strong>API Security:</strong> Rate limiting, authentication required</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Monitoring and Detection</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>24/7 Monitoring:</strong> Real-time security monitoring</li>
              <li><strong>Intrusion Detection:</strong> Automated threat detection systems</li>
              <li><strong>Log Management:</strong> Comprehensive logging and analysis</li>
              <li><strong>Anomaly Detection:</strong> AI-powered unusual activity detection</li>
              <li><strong>Incident Response:</strong> Dedicated security incident team</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Testing and Audits</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Penetration Testing:</strong> Annual third-party security audits</li>
              <li><strong>Vulnerability Scanning:</strong> Continuous automated scanning</li>
              <li><strong>Code Reviews:</strong> Security-focused code review process</li>
              <li><strong>Dependency Monitoring:</strong> Automated vulnerability tracking</li>
              <li><strong>Compliance Audits:</strong> Regular compliance assessments</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Employee Security</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Background Checks:</strong> Required for all employees</li>
              <li><strong>Security Training:</strong> Mandatory annual security training</li>
              <li><strong>Confidentiality Agreements:</strong> All employees sign NDAs</li>
              <li><strong>Device Security:</strong> Encrypted devices, security software required</li>
              <li><strong>Termination Procedures:</strong> Immediate access revocation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Backup and Recovery</h2>
            <ul className="text-gray-800 space-y-2">
              <li><strong>Regular Backups:</strong> Automated daily encrypted backups</li>
              <li><strong>Off-Site Storage:</strong> Geographically distributed backup locations</li>
              <li><strong>Disaster Recovery:</strong> Tested recovery procedures</li>
              <li><strong>Business Continuity:</strong> Plans for service continuity</li>
              <li><strong>Data Retention:</strong> Secure deletion after retention period</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Incident Response</h2>
            <p className="text-gray-800 mb-3">In the event of a security incident:</p>
            <ul className="text-gray-800 space-y-2">
              <li>Immediate containment and investigation</li>
              <li>Notification to affected users within 72 hours</li>
              <li>Coordination with law enforcement if necessary</li>
              <li>Post-incident analysis and improvements</li>
              <li>Transparent communication about the incident</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Your Security Responsibilities</h2>
            <p className="text-gray-800 mb-3">Help us keep your account secure:</p>
            <ul className="text-gray-800 space-y-2">
              <li>Use a strong, unique password</li>
              <li>Enable two-factor authentication</li>
              <li>Keep your devices secure and updated</li>
              <li>Never share your password</li>
              <li>Report suspicious activity immediately</li>
              <li>Log out from shared or public devices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Security Certifications and Compliance</h2>
            <ul className="text-gray-800 space-y-2">
              <li>Infrastructure hosted on SOC 2 Type II certified providers</li>
              <li>GDPR compliant data processing</li>
              <li>CCPA compliant for California users</li>
              <li>Regular security audits and assessments</li>
              <li>Industry-standard security practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Reporting Security Issues</h2>
            <p className="text-gray-800 mb-3">If you discover a security vulnerability:</p>
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-6">
              <p className="text-gray-800 mb-2">
                <strong>Security Team</strong><br />
                <strong>Email:</strong> security@biomathcore.com<br />
                <strong>Response Time:</strong> Within 24 hours
              </p>
              <p className="text-gray-800 mb-0 mt-3">
                We appreciate responsible disclosure and will work with security researchers to address issues promptly.
              </p>
            </div>
          </section>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions About Security?</h3>
            <p className="text-gray-800 mb-3">Our security team is here to help.</p>
            <button onClick={() => onNavigate('contact')} className="text-green-600 hover:text-green-700 font-medium">
              Contact Security Team →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
