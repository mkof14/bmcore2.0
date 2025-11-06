import { Building2, Microscope, Heart, Handshake, TrendingUp, Globe, Users, Award, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import BackButton from '../components/BackButton';

interface PartnershipProps {
  onNavigate: (page: string) => void;
}

export default function Partnership({ onNavigate }: PartnershipProps) {
  const [formData, setFormData] = useState({
    partnershipType: '',
    contactName: '',
    organization: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Partnership inquiry:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton onNavigate={onNavigate} />

          <section className="py-16 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Partner With Us
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              Join forces with BioMath Core to revolutionize healthcare through AI innovation
            </p>
          </section>

          <section className="mb-20">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-600/30 rounded-xl flex items-center justify-center mb-6 group-hover:border-orange-500 group-hover:shadow-lg group-hover:shadow-orange-600/20 transition-all duration-300">
                    <Building2 className="w-10 h-10 text-orange-500 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-50 transition-colors">Business Development</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Strategic partnerships, distribution, and market expansion opportunities
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:text-orange-500 transition-colors" />
                      <span>Revenue sharing models</span>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:text-orange-500 transition-colors" />
                      <span>Co-marketing initiatives</span>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:text-orange-500 transition-colors" />
                      <span>Market access</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-600/30 rounded-xl flex items-center justify-center mb-6 group-hover:border-orange-500 group-hover:shadow-lg group-hover:shadow-orange-600/20 transition-all duration-300">
                    <Microscope className="w-10 h-10 text-orange-500 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-50 transition-colors">Scientists & Researchers</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Collaborate on cutting-edge AI health research and clinical validation
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:text-orange-500 transition-colors" />
                      <span>Data access</span>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:text-orange-500 transition-colors" />
                      <span>Publication opportunities</span>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:text-orange-500 transition-colors" />
                      <span>Collaborative research</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 hover:border-orange-600/50 transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-600/30 rounded-xl flex items-center justify-center mb-6 group-hover:border-orange-500 group-hover:shadow-lg group-hover:shadow-orange-600/20 transition-all duration-300">
                    <Heart className="w-10 h-10 text-orange-500 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-50 transition-colors">Healthcare Professionals</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Integrate our platform into your practice and improve patient outcomes
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:text-orange-500 transition-colors" />
                      <span>Practice integration</span>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:text-orange-500 transition-colors" />
                      <span>Training & support</span>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 group-hover/item:text-orange-500 transition-colors" />
                      <span>Patient monitoring tools</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Why Partner With BioMath Core?</h2>
              <p className="text-xl text-gray-400">Join a growing ecosystem of health innovation leaders</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 text-center hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-900 border border-orange-600/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:border-orange-500/40 group-hover:shadow-lg group-hover:shadow-orange-600/10 transition-all">
                    <TrendingUp className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-white font-bold mb-2 text-lg">Growing Market</h3>
                  <p className="text-sm text-gray-400">$350B+ digital health market opportunity</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 text-center hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-900 border border-orange-600/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:border-orange-500/40 group-hover:shadow-lg group-hover:shadow-orange-600/10 transition-all">
                    <Globe className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-white font-bold mb-2 text-lg">Global Reach</h3>
                  <p className="text-sm text-gray-400">Expand your impact worldwide</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 text-center hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-900 border border-orange-600/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:border-orange-500/40 group-hover:shadow-lg group-hover:shadow-orange-600/10 transition-all">
                    <Users className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-white font-bold mb-2 text-lg">User Base</h3>
                  <p className="text-sm text-gray-400">Access to engaged health-conscious users</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 text-center hover:border-orange-600/40 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/0 to-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-900 border border-orange-600/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:border-orange-500/40 group-hover:shadow-lg group-hover:shadow-orange-600/10 transition-all">
                    <Award className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-white font-bold mb-2 text-lg">Innovation Leader</h3>
                  <p className="text-sm text-gray-400">Cutting-edge AI health technology</p>
                </div>
              </div>
            </div>
          </section>


          <section className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Contact Us</h2>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="mb-6">
                <label className="block text-white mb-3 font-medium">Partnership Type</label>
                <select
                  value={formData.partnershipType}
                  onChange={(e) => setFormData({...formData, partnershipType: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Select partnership type</option>
                  <option value="business">Business Development</option>
                  <option value="research">Research & Science</option>
                  <option value="healthcare">Healthcare Professional</option>
                  <option value="technology">Technology Integration</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white mb-3 font-medium">Contact Name</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-3 font-medium">Company/Organization</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white mb-3 font-medium">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-3 font-medium">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-white mb-3 font-medium">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-[1.02]"
              >
                Submit Inquiry
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-gray-800 text-center">
              <p className="text-gray-400 mb-2">Or reach us directly</p>
              <p className="text-white font-medium">partnerships@biomathcore.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
