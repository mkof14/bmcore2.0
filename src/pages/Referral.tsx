import { Copy, Mail, Share2, Users, DollarSign, Check } from 'lucide-react';
import { useState } from 'react';
import BackButton from '../components/BackButton';

interface ReferralProps {
  onNavigate: (page: string) => void;
}

export default function Referral({ onNavigate }: ReferralProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const referralCode = 'BIOMATH-USER123';
  const referralLink = `https://biomathcore.com/signup?ref=${referralCode}`;

  const stats = {
    totalReferred: 8,
    creditsEarned: 80,
    activeReferrals: 6
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setEmail('');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const shareToSocial = (platform: string) => {
    const text = encodeURIComponent('Discover BioMath Core - a gentle wellness platform that helps you understand your body. Join me and get $5 off!');
    const url = encodeURIComponent(referralLink);

    const urls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton onNavigate={onNavigate} />

        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 border border-orange-600/30 rounded-xl mb-6 shadow-lg shadow-orange-600/10">
            <Users className="h-10 w-10 text-orange-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Share Health, Earn Rewards
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Invite friends to BioMath Core and earn credits with every successful referral
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Total Referred</h3>
              <Users className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalReferred}</p>
          </div>

          <div className="relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Credits Earned</h3>
              <DollarSign className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-white">${stats.creditsEarned}</p>
          </div>

          <div className="relative bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/40 rounded-xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Active Referrals</h3>
              <Check className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.activeReferrals}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-10 mb-12 text-white">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Share your unique code</p>
                    <p className="text-sm text-gray-400">Send it to friends via email or social media</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Friend gets $5 discount</p>
                    <p className="text-sm text-gray-400">Applied instantly at signup</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">You earn $10 credit</p>
                    <p className="text-sm text-gray-400">Added instantly after confirmed signup</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Reward Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>You earn per referral:</span>
                  <span className="font-bold">$10</span>
                </div>
                <div className="flex justify-between">
                  <span>Friend gets discount:</span>
                  <span className="font-bold">$5</span>
                </div>
                <div className="border-t border-white/20 pt-3 mt-3">
                  <p className="text-gray-400">• No limits on referrals</p>
                  <p className="text-gray-400">• Credits never expire</p>
                  <p className="text-gray-400">• Use for subscriptions & upgrades</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Referral Code</h2>

          <div className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Your permanent code:</p>
                <p className="text-2xl font-mono font-bold text-white">{referralCode}</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Share link:</p>
              <p className="text-sm text-white font-mono break-all">{referralLink}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Send Invitation via Email</h3>
            <form onSubmit={handleSendInvite} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Friend's email address"
                required
                className="flex-1 px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20"
              >
                <Mail className="h-5 w-5" />
                <span>Send</span>
              </button>
            </form>
            {showSuccess && (
              <p className="mt-3 text-sm text-green-400 flex items-center space-x-2">
                <Check className="h-4 w-4" />
                <span>Invitation sent successfully!</span>
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Share on Social Media</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => shareToSocial('twitter')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:border-orange-600/50 transition-all duration-300"
              >
                <Share2 className="h-5 w-5" />
                <span>X</span>
              </button>
              <button
                onClick={() => shareToSocial('facebook')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:border-orange-600/50 transition-all duration-300"
              >
                <Share2 className="h-5 w-5" />
                <span>Facebook</span>
              </button>
              <button
                onClick={() => shareToSocial('linkedin')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:border-orange-600/50 transition-all duration-300"
              >
                <Share2 className="h-5 w-5" />
                <span>LinkedIn</span>
              </button>
              <button
                onClick={() => shareToSocial('whatsapp')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:border-orange-600/50 transition-all duration-300"
              >
                <Share2 className="h-5 w-5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Program Details</h2>
          <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-400">
            <div>
              <h3 className="font-semibold text-white mb-3">Eligibility</h3>
              <ul className="space-y-1">
                <li>• Friend must be a new user</li>
                <li>• Code must be entered during signup</li>
                <li>• Only one referral code per account</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Fraud Protection</h3>
              <ul className="space-y-1">
                <li>• No self-referrals allowed</li>
                <li>• No duplicate accounts</li>
                <li>• Abusive behavior voids rewards</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              <span className="font-medium text-white">Refer 10+ friends?</span> You may qualify for our{' '}
              <button
                onClick={() => onNavigate('ambassador')}
                className="text-orange-500 hover:text-orange-400 hover:underline font-medium transition-colors"
              >
                Ambassador Program
              </button>
              {' '}with enhanced rewards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
