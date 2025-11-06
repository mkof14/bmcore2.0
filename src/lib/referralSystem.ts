import { supabase } from './supabase';
import { trackEvent } from './analytics';

export interface ReferralCode {
  id: string;
  user_id: string;
  code: string;
  uses: number;
  max_uses: number;
  active: boolean;
  created_at: string;
  expires_at?: string;
}

export interface ReferralReward {
  id: string;
  referrer_id: string;
  referred_id: string;
  reward_type: string;
  reward_value: number;
  status: 'pending' | 'awarded' | 'cancelled';
  created_at: string;
  awarded_at?: string;
}

class ReferralSystem {
  async generateReferralCode(userId: string): Promise<ReferralCode | null> {
    try {
      const { data: existing } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true)
        .maybeSingle();

      if (existing) {
        return existing;
      }

      const code = this.generateCode();

      const { data, error } = await supabase
        .from('referral_codes')
        .insert({
          user_id: userId,
          code,
          uses: 0,
          max_uses: 100,
          active: true
        })
        .select()
        .single();

      if (error) throw error;

      trackEvent('referral_code_generated', {
        userId,
        code
      });

      return data;
    } catch (error) {
      console.error('Failed to generate referral code:', error);
      return null;
    }
  }

  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async validateReferralCode(code: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .maybeSingle();

      if (!data) return false;

      if (data.uses >= data.max_uses) return false;

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to validate referral code:', error);
      return false;
    }
  }

  async applyReferralCode(code: string, newUserId: string): Promise<boolean> {
    try {
      const { data: referralCode } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .maybeSingle();

      if (!referralCode) return false;

      if (referralCode.user_id === newUserId) {
        return false;
      }

      await supabase
        .from('referral_codes')
        .update({ uses: referralCode.uses + 1 })
        .eq('id', referralCode.id);

      await supabase.from('referral_rewards').insert({
        referrer_id: referralCode.user_id,
        referred_id: newUserId,
        code_id: referralCode.id,
        reward_type: 'monthly_discount',
        reward_value: 20,
        status: 'pending'
      });

      await supabase.from('referral_rewards').insert({
        referrer_id: referralCode.user_id,
        referred_id: newUserId,
        code_id: referralCode.id,
        reward_type: 'referrer_credit',
        reward_value: 10,
        status: 'pending'
      });

      trackEvent('referral_code_applied', {
        referrerId: referralCode.user_id,
        referredId: newUserId,
        code
      });

      return true;
    } catch (error) {
      console.error('Failed to apply referral code:', error);
      return false;
    }
  }

  async getReferralStats(userId: string): Promise<any> {
    try {
      const { data: code } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true)
        .maybeSingle();

      const { data: rewards } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('referrer_id', userId);

      const { count: totalReferrals } = await supabase
        .from('referral_rewards')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', userId);

      const { count: activeReferrals } = await supabase
        .from('referral_rewards')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', userId)
        .eq('status', 'awarded');

      const totalEarned = rewards
        ?.filter(r => r.status === 'awarded' && r.reward_type === 'referrer_credit')
        .reduce((sum, r) => sum + (r.reward_value || 0), 0) || 0;

      return {
        code: code?.code || null,
        totalReferrals: totalReferrals || 0,
        activeReferrals: activeReferrals || 0,
        totalEarned,
        rewards: rewards || []
      };
    } catch (error) {
      console.error('Failed to get referral stats:', error);
      return null;
    }
  }

  async getReferralLink(userId: string): Promise<string> {
    const code = await this.generateReferralCode(userId);
    if (!code) return '';

    const baseUrl = window.location.origin;
    return `${baseUrl}/sign-up?ref=${code.code}`;
  }
}

export const referralSystem = new ReferralSystem();

export async function generateReferralCode(userId: string): Promise<ReferralCode | null> {
  return referralSystem.generateReferralCode(userId);
}

export async function validateReferralCode(code: string): Promise<boolean> {
  return referralSystem.validateReferralCode(code);
}

export async function applyReferralCode(code: string, newUserId: string): Promise<boolean> {
  return referralSystem.applyReferralCode(code, newUserId);
}

export async function getReferralStats(userId: string): Promise<any> {
  return referralSystem.getReferralStats(userId);
}

export async function getReferralLink(userId: string): Promise<string> {
  return referralSystem.getReferralLink(userId);
}
