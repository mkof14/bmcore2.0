import { useState, useEffect } from 'react';
import { Users, Copy, Mail, Share2, TrendingUp, Gift, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ReferralSection() {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    earnings: 0
  });

  useEffect(() => {
    loadReferrals();
    generateReferralCode();
  }, []);

  const generateReferralCode = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (user.user) {
      setReferralCode(`BMC-${user.user.id.substring(0, 8).toUpperCase()}`);
    }
  };

  const loadReferrals = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('referral_activities')
        .select('*')
        .eq('referrer_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const referralData = data || [];
      setReferrals(referralData);

      setStats({
        total: referralData.length,
        pending: referralData.filter(r => r.status === 'pending').length,
        completed: referralData.filter(r => r.status === 'completed').length,
        earnings: referralData.reduce((sum, r) => sum + (r.reward_credited ? r.reward_amount : 0), 0)
      });
    } catch (error) {
      console.error('Error loading referrals:', error);
    }
  };

  const copyReferralLink = () => {
    const link = `https://biomathcore.com/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    alert('Referral link copied to clipboard!');
  };

  const shareViaEmail = () => {
    const subject = 'Join BiomathCore - Get $20 Credit';
    const body = `I'm inviting you to join BiomathCore! Use my referral code ${referralCode} to get $20 credit on signup. https://biomathcore.com/signup?ref=${referralCode}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Users className="h-8 w-8 text-orange-500" />
          Referral Program
        </h1>
        <p className="text-gray-400">Invite friends and earn rewards for each successful referral</p>
      </div>

      <div className="mb-6 grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-900 border border-blue-600/30 rounded-xl p-4">
          <Users className="h-6 w-6 text-blue-400 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-gray-400">Total Referrals</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/30 via-yellow-800/20 to-gray-900 border border-yellow-600/30 rounded-xl p-4">
          <TrendingUp className="h-6 w-6 text-yellow-400 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.pending}</p>
          <p className="text-xs text-gray-400">Pending</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 via-green-800/20 to-gray-900 border border-green-600/30 rounded-xl p-4">
          <Gift className="h-6 w-6 text-green-400 mb-2" />
          <p className="text-2xl font-bold text-white">{stats.completed}</p>
          <p className="text-xs text-gray-400">Completed</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900/30 via-orange-800/20 to-gray-900 border border-orange-600/30 rounded-xl p-4">
          <DollarSign className="h-6 w-6 text-orange-400 mb-2" />
          <p className="text-2xl font-bold text-white">${stats.earnings}</p>
          <p className="text-xs text-gray-400">Total Earned</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">Your Referral Code</h3>
        <div className="flex gap-3">
          <div className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg font-mono text-xl text-orange-500 font-bold text-center">
            {referralCode || 'Loading...'}
          </div>
          <button
            onClick={copyReferralLink}
            className="px-6 py-3 bg-blue-900/30 border border-blue-600/30 text-blue-400 rounded-lg hover:bg-blue-900/50 transition-colors flex items-center gap-2"
          >
            <Copy className="h-5 w-5" />
            Copy Link
          </button>
          <button
            onClick={shareViaEmail}
            className="px-6 py-3 bg-green-900/30 border border-green-600/30 text-green-400 rounded-lg hover:bg-green-900/50 transition-colors flex items-center gap-2"
          >
            <Mail className="h-5 w-5" />
            Email
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-4">
          Share your code with friends. When they sign up and make their first purchase, you both get $20 credit!
        </p>
      </div>

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Referral History</h3>
        {referrals.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No referrals yet</p>
            <p className="text-sm text-gray-500">Start inviting friends to earn rewards!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Reward</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-sm text-white">{ref.referred_email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ref.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                        ref.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-gray-700/30 text-gray-400'
                      }`}>
                        {ref.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-semibold">
                      ${ref.reward_amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(ref.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
