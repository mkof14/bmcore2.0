import { Award, TrendingUp, Users, Gift, CheckCircle, Star } from 'lucide-react';
import { useState } from 'react';
import BackButton from '../components/BackButton';

interface AmbassadorProps {
  onNavigate: (page: string) => void;
}

export default function Ambassador({ onNavigate }: AmbassadorProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    country: '',
    audienceType: '',
    hasReferrals: '',
    motivation: '',
    socialLink: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        country: '',
        audienceType: '',
        hasReferrals: '',
        motivation: '',
        socialLink: ''
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-600/30 rounded-xl mb-6 shadow-lg shadow-orange-600/10">
            <Award className="h-10 w-10 text-orange-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ambassador Program
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Become a wellness multiplier. Share BioMath Core authentically and earn enhanced rewards while helping others discover calm, supportive guidance.
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-10 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">What Makes an Ambassador?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative bg-gray-800/50 border border-gray-700/30 rounded-xl p-6 overflow-hidden">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="h-6 w-6 text-orange-500" />
                <h3 className="text-lg font-semibold">Organic Growth</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Loyal users who refer 10+ friends become eligible for automatic Ambassador upgrade with enhanced benefits.
              </p>
            </div>

            <div className="relative bg-gray-800/50 border border-gray-700/30 rounded-xl p-6 overflow-hidden">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-orange-500" />
                <h3 className="text-lg font-semibold">Direct Application</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Wellness coaches, health educators, content creators, and community leaders can apply directly through our form below.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 text-center hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 border border-orange-600/20 rounded-lg mx-auto mb-4 group-hover:border-orange-500/40 transition-all">
                <Gift className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Higher Rewards</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Earn $20 per referral (2x standard rate) with tier-based scaling opportunities
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 text-center hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 border border-orange-600/20 rounded-lg mx-auto mb-4 group-hover:border-orange-500/40 transition-all">
                <Star className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Priority Access</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Early feature testing, priority support, and exclusive Ambassador dashboard
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 text-center hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 border border-orange-600/20 rounded-lg mx-auto mb-4 group-hover:border-orange-500/40 transition-all">
                <CheckCircle className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Co-Branded Tools</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Dedicated materials, social assets, optional landing page, and sharing toolkit
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Ambassador Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Enhanced Rewards</h4>
                  <p className="text-sm text-gray-400">Double the standard referral rate with scaling tiers</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Dedicated Dashboard</h4>
                  <p className="text-sm text-gray-400">Track cohort, lifetime rewards, and ambassador tier level</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Co-Branded Materials</h4>
                  <p className="text-sm text-gray-400">Professional social assets and sharing toolkit</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Priority Support</h4>
                  <p className="text-sm text-gray-400">Direct access to platform team for questions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Early Features</h4>
                  <p className="text-sm text-gray-400">Beta testing and preview access to new platform capabilities</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Revenue-Sharing Growth</h4>
                  <p className="text-sm text-gray-400">Eligibility for advanced partnership models</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">Ambassador Responsibilities</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            As an ambassador, we ask that you share authentically and maintain our wellness-first values:
          </p>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Share the platform authentically based on personal experience</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Use wellness-first language that is supportive, not prescriptive</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Never make medical or diagnostic claims</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Avoid spam, misleading advertising, or incentive manipulation</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Apply to Become an Ambassador</h2>

          {submitted ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 border border-orange-600/30 rounded-xl mb-4">
                <CheckCircle className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Application Submitted!</h3>
              <p className="text-gray-400 mb-4">
                Thank you for your interest in becoming a BioMath Core Ambassador.
              </p>
              <p className="text-sm text-gray-500">
                Our team will review your application and reach out within 3-5 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Country/Region *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Audience Type *
                  </label>
                  <select
                    name="audienceType"
                    value={formData.audienceType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select type...</option>
                    <option value="users">General Users</option>
                    <option value="clients">Coaching Clients</option>
                    <option value="followers">Social Followers</option>
                    <option value="community">Community Members</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Do you currently use our referral program? *
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="hasReferrals"
                      value="yes"
                      checked={formData.hasReferrals === 'yes'}
                      onChange={handleChange}
                      required
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-white">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="hasReferrals"
                      value="no"
                      checked={formData.hasReferrals === 'no'}
                      onChange={handleChange}
                      required
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-white">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Why do you want to become an ambassador? *
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Share your motivation and how you'd like to contribute..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Website or Social Link (Optional)
                </label>
                <input
                  type="url"
                  name="socialLink"
                  value={formData.socialLink}
                  onChange={handleChange}
                  placeholder="https://"
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30"
              >
                Submit Application
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 bg-gray-800/30 border border-gray-700/30 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400">
            <span className="font-medium text-white">Already have 10+ referrals?</span> Check your{' '}
            <button
              onClick={() => onNavigate('member')}
              className="text-orange-500 hover:text-orange-400 hover:underline font-medium transition-colors"
            >
              Member Zone
            </button>
            {' '}for automatic upgrade eligibility
          </p>
        </div>
      </div>
    </div>
  );
}
