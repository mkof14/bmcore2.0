import { supabase } from './supabase';
import { trackEvent } from './analytics';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: Record<string, any>;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  badge: Badge;
}

export interface Streak {
  current_streak: number;
  longest_streak: number;
  last_active_date: string;
}

class GamificationSystem {
  async checkAndAwardBadges(userId: string): Promise<Badge[]> {
    try {
      const { data: badges } = await supabase
        .from('gamification_badges')
        .select('*')
        .eq('active', true);

      if (!badges) return [];

      const { data: earnedBadges } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', userId);

      const earnedIds = new Set(earnedBadges?.map(b => b.badge_id) || []);
      const newBadges: Badge[] = [];

      for (const badge of badges) {
        if (earnedIds.has(badge.id)) continue;

        const meetsRequirements = await this.checkBadgeCriteria(userId, badge.criteria);

        if (meetsRequirements) {
          await this.awardBadge(userId, badge.id);
          newBadges.push(badge);
        }
      }

      return newBadges;
    } catch (error) {
      console.error('Failed to check badges:', error);
      return [];
    }
  }

  private async checkBadgeCriteria(userId: string, criteria: Record<string, any>): Promise<boolean> {
    try {
      if (criteria.type === 'login_streak') {
        const { data } = await supabase
          .from('user_streaks')
          .select('current_streak')
          .eq('user_id', userId)
          .maybeSingle();

        return (data?.current_streak || 0) >= criteria.days;
      }

      if (criteria.type === 'reports_generated') {
        const { count } = await supabase
          .from('generated_reports')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        return (count || 0) >= criteria.count;
      }

      if (criteria.type === 'devices_connected') {
        const { count } = await supabase
          .from('wearable_integrations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('active', true);

        return (count || 0) >= criteria.count;
      }

      if (criteria.type === 'referrals_made') {
        const { count } = await supabase
          .from('referral_rewards')
          .select('*', { count: 'exact', head: true })
          .eq('referrer_id', userId)
          .eq('status', 'awarded');

        return (count || 0) >= criteria.count;
      }

      return false;
    } catch (error) {
      console.error('Failed to check badge criteria:', error);
      return false;
    }
  }

  private async awardBadge(userId: string, badgeId: string): Promise<void> {
    try {
      await supabase.from('user_badges').insert({
        user_id: userId,
        badge_id: badgeId,
        earned_at: new Date().toISOString()
      });

      trackEvent('badge_earned', {
        userId,
        badgeId
      });
    } catch (error) {
      console.error('Failed to award badge:', error);
    }
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:gamification_badges(*)
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get user badges:', error);
      return [];
    }
  }

  async updateStreak(userId: string): Promise<Streak> {
    try {
      const { data: existing } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const today = new Date().toISOString().split('T')[0];

      if (!existing) {
        const { data } = await supabase
          .from('user_streaks')
          .insert({
            user_id: userId,
            current_streak: 1,
            longest_streak: 1,
            last_active_date: today
          })
          .select()
          .single();

        return data;
      }

      const lastActive = new Date(existing.last_active_date);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

      let currentStreak = existing.current_streak;
      let longestStreak = existing.longest_streak;

      if (daysDiff === 0) {
        return existing;
      } else if (daysDiff === 1) {
        currentStreak += 1;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }

      const { data } = await supabase
        .from('user_streaks')
        .update({
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_active_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      trackEvent('streak_updated', {
        userId,
        currentStreak,
        longestStreak
      });

      return data;
    } catch (error) {
      console.error('Failed to update streak:', error);
      throw error;
    }
  }

  async getUserStreak(userId: string): Promise<Streak | null> {
    try {
      const { data } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      return data;
    } catch (error) {
      console.error('Failed to get user streak:', error);
      return null;
    }
  }

  async getLeaderboard(limit = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select(`
          user_id,
          current_streak,
          longest_streak,
          profiles!inner(full_name, avatar_url)
        `)
        .order('current_streak', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      return [];
    }
  }
}

export const gamification = new GamificationSystem();

export async function checkAndAwardBadges(userId: string): Promise<Badge[]> {
  return gamification.checkAndAwardBadges(userId);
}

export async function updateUserStreak(userId: string): Promise<Streak> {
  return gamification.updateStreak(userId);
}

export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  return gamification.getUserBadges(userId);
}

export async function getUserStreak(userId: string): Promise<Streak | null> {
  return gamification.getUserStreak(userId);
}

export async function getStreakLeaderboard(limit?: number): Promise<any[]> {
  return gamification.getLeaderboard(limit);
}
