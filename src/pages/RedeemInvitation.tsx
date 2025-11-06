import { useState, useEffect } from 'react';
import { Gift, Check, AlertCircle, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSession } from '../hooks/useSession';

export default function RedeemInvitation() {
  const session = useSession();
  const [code, setCode] = useState('');
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const urlCode = params.get('code');
    if (urlCode) {
      setCode(urlCode);
      checkInvitation(urlCode);
    }
  }, []);

  const checkInvitation = async (invitationCode: string) => {
    if (!invitationCode) return;

    setChecking(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('code', invitationCode.toUpperCase())
        .eq('status', 'pending')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setError('Invalid or expired invitation code');
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setError('This invitation has expired');
        return;
      }

      setInvitation(data);
      if (!session) {
        setSignUpData({ ...signUpData, email: data.email });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check invitation');
    } finally {
      setChecking(false);
    }
  };

  const handleCheckCode = (e: React.FormEvent) => {
    e.preventDefault();
    checkInvitation(code);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signUpData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.fullName,
          },
        },
      });

      if (error) throw error;

      await redeemInvitation();
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  const redeemInvitation = async () => {
    setRedeeming(true);
    setError('');

    try {
      const { data, error } = await supabase.rpc('accept_invitation', {
        invitation_code: code.toUpperCase(),
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to redeem invitation');
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.hash = '#/member-zone';
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to redeem invitation');
    } finally {
      setRedeeming(false);
      setLoading(false);
    }
  };

  const getPlanName = (planType: string) => {
    const plans: Record<string, string> = {
      core: 'Core Plan',
      daily: 'Daily Plan',
      max: 'Max Plan',
    };
    return plans[planType] || planType;
  };

  const getPlanPrice = (planType: string) => {
    const prices: Record<string, string> = {
      core: '$19/month',
      daily: '$39/month',
      max: '$99/month',
    };
    return prices[planType] || '';
  };

  const getDurationText = (months: number) => {
    if (months === 0) return 'Forever';
    if (months === 1) return '1 month';
    if (months === 12) return '1 year';
    return `${months} months`;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-600/30 rounded-xl p-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to BioMath Core!</h2>
            <p className="text-gray-300 mb-4">
              Your invitation has been successfully redeemed. You now have free access to {invitation && getPlanName(invitation.plan_type)} for {invitation && getDurationText(invitation.duration_months)}.
            </p>
            <p className="text-sm text-gray-400">Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Redeem Your Invitation</h1>
          <p className="text-gray-400">
            Enter your invitation code to activate your free access
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg text-red-400 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!invitation ? (
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
            <form onSubmit={handleCheckCode}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Invitation Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter 8-character code"
                maxLength={8}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-center text-xl font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase"
                required
              />
              <button
                type="submit"
                disabled={checking || code.length !== 8}
                className="w-full mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checking ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>Check Code</>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-600/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Your Invitation Details</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Plan</span>
                  <span className="text-white font-semibold">{getPlanName(invitation.plan_type)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Regular Price</span>
                  <span className="text-white line-through">{getPlanPrice(invitation.plan_type)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Your Price</span>
                  <span className="text-green-400 font-bold text-lg">FREE</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-semibold">{getDurationText(invitation.duration_months)}</span>
                </div>
              </div>

              {invitation.expires_at && (
                <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                  <p className="text-sm text-yellow-400">
                    This invitation expires on {new Date(invitation.expires_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {session ? (
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
                <p className="text-gray-300 mb-4">
                  You're signed in as <span className="text-white font-semibold">{session.email}</span>
                </p>
                <button
                  onClick={redeemInvitation}
                  disabled={redeeming}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {redeeming ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      Activate Free Access
                    </>
                  )}
                </button>
              </div>
            ) : showSignUp ? (
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Create Your Account</h3>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Lock className="h-4 w-4 inline mr-1" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                        minLength={6}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Min 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Confirm password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>Create Account & Activate</>
                    )}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowSignUp(false)}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Already have an account? Sign in instead
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6">
                <p className="text-gray-300 mb-4 text-center">
                  To redeem this invitation, you need an account
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => (window.location.hash = '#/signin')}
                    className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Sign In to Existing Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
