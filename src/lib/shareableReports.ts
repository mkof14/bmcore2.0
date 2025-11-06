import { supabase } from './supabase';
import { trackEvent } from './analytics';

export interface ShareableReport {
  id: string;
  user_id: string;
  report_id?: string;
  share_token: string;
  title: string;
  description?: string;
  report_data: any;
  privacy_level: 'public' | 'unlisted' | 'private';
  password_hash?: string;
  views: number;
  expires_at?: string;
  created_at: string;
  last_viewed_at?: string;
}

class ShareableReportsService {
  async createShareableReport(params: {
    reportId?: string;
    title: string;
    description?: string;
    reportData: any;
    privacyLevel?: 'public' | 'unlisted' | 'private';
    password?: string;
    expiresInDays?: number;
  }): Promise<ShareableReport | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const shareToken = this.generateToken();

      const expiresAt = params.expiresInDays
        ? new Date(Date.now() + params.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const passwordHash = params.password
        ? await this.hashPassword(params.password)
        : null;

      const { data, error } = await supabase
        .from('shareable_reports')
        .insert({
          user_id: user.id,
          report_id: params.reportId,
          share_token: shareToken,
          title: params.title,
          description: params.description,
          report_data: params.reportData,
          privacy_level: params.privacyLevel || 'unlisted',
          password_hash: passwordHash,
          expires_at: expiresAt,
          views: 0
        })
        .select()
        .single();

      if (error) throw error;

      trackEvent('shareable_report_created', {
        reportId: data.id,
        privacyLevel: params.privacyLevel,
        hasPassword: !!params.password,
        expiresInDays: params.expiresInDays
      });

      return data;
    } catch (error) {
      console.error('Failed to create shareable report:', error);
      return null;
    }
  }

  async getShareableReport(shareToken: string, password?: string): Promise<ShareableReport | null> {
    try {
      const { data, error } = await supabase
        .from('shareable_reports')
        .select('*')
        .eq('share_token', shareToken)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return null;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return null;
      }

      if (data.password_hash && password) {
        const isValid = await this.verifyPassword(password, data.password_hash);
        if (!isValid) {
          throw new Error('Invalid password');
        }
      } else if (data.password_hash && !password) {
        throw new Error('Password required');
      }

      await supabase.rpc('increment_shareable_report_views', {
        report_token: shareToken
      });

      trackEvent('shareable_report_viewed', {
        reportId: data.id,
        shareToken
      });

      return data;
    } catch (error) {
      console.error('Failed to get shareable report:', error);
      throw error;
    }
  }

  async getUserShareableReports(userId: string): Promise<ShareableReport[]> {
    try {
      const { data, error } = await supabase
        .from('shareable_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to get user shareable reports:', error);
      return [];
    }
  }

  async deleteShareableReport(reportId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shareable_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      trackEvent('shareable_report_deleted', {
        reportId
      });

      return true;
    } catch (error) {
      console.error('Failed to delete shareable report:', error);
      return false;
    }
  }

  async updateShareableReport(
    reportId: string,
    updates: {
      title?: string;
      description?: string;
      privacy_level?: 'public' | 'unlisted' | 'private';
      expires_at?: string | null;
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('shareable_reports')
        .update(updates)
        .eq('id', reportId);

      if (error) throw error;

      trackEvent('shareable_report_updated', {
        reportId,
        updates: Object.keys(updates)
      });

      return true;
    } catch (error) {
      console.error('Failed to update shareable report:', error);
      return false;
    }
  }

  getShareableUrl(shareToken: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/share/${shareToken}`;
  }

  private generateToken(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let token = '';
    for (let i = 0; i < 12; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }
}

export const shareableReports = new ShareableReportsService();

export async function createShareableReport(params: {
  reportId?: string;
  title: string;
  description?: string;
  reportData: any;
  privacyLevel?: 'public' | 'unlisted' | 'private';
  password?: string;
  expiresInDays?: number;
}): Promise<ShareableReport | null> {
  return shareableReports.createShareableReport(params);
}

export async function getShareableReport(
  shareToken: string,
  password?: string
): Promise<ShareableReport | null> {
  return shareableReports.getShareableReport(shareToken, password);
}

export async function getUserShareableReports(userId: string): Promise<ShareableReport[]> {
  return shareableReports.getUserShareableReports(userId);
}

export function getShareableUrl(shareToken: string): string {
  return shareableReports.getShareableUrl(shareToken);
}
