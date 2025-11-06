import { supabase } from './supabase';
import { trackEvent } from './analytics';

export type SocialProvider = 'google' | 'facebook' | 'twitter' | 'github' | 'linkedin';

export interface SocialAuthConfig {
  provider: SocialProvider;
  redirectTo?: string;
  scopes?: string[];
}

class SocialAuthService {
  async signInWithSocial(config: SocialAuthConfig): Promise<void> {
    const { provider, redirectTo, scopes } = config;

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: redirectTo || `${window.location.origin}/member-zone`,
          scopes: scopes?.join(' ')
        }
      });

      if (error) throw error;

      trackEvent('social_login_initiated', {
        provider,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Failed to sign in with ${provider}:`, error);
      throw error;
    }
  }

  async linkSocialAccount(provider: SocialProvider): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase.auth.linkIdentity({
        provider: provider as any
      });

      if (error) throw error;

      await this.saveSocialConnection(user.id, provider);

      trackEvent('social_account_linked', {
        provider,
        userId: user.id
      });
    } catch (error) {
      console.error(`Failed to link ${provider}:`, error);
      throw error;
    }
  }

  async unlinkSocialAccount(provider: SocialProvider): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const identity = user.identities?.find(i => i.provider === provider);

      if (!identity) {
        throw new Error(`No ${provider} account linked`);
      }

      const { error } = await supabase.auth.unlinkIdentity(identity);

      if (error) throw error;

      await this.removeSocialConnection(user.id, provider);

      trackEvent('social_account_unlinked', {
        provider,
        userId: user.id
      });
    } catch (error) {
      console.error(`Failed to unlink ${provider}:`, error);
      throw error;
    }
  }

  async getSocialConnections(userId: string): Promise<SocialProvider[]> {
    try {
      const { data, error } = await supabase
        .from('social_connections')
        .select('provider')
        .eq('user_id', userId)
        .eq('active', true);

      if (error) throw error;

      return data?.map(c => c.provider) || [];
    } catch (error) {
      console.error('Failed to get social connections:', error);
      return [];
    }
  }

  private async saveSocialConnection(userId: string, provider: SocialProvider): Promise<void> {
    try {
      await supabase.from('social_connections').upsert({
        user_id: userId,
        provider,
        connected_at: new Date().toISOString(),
        active: true
      });
    } catch (error) {
      console.error('Failed to save social connection:', error);
    }
  }

  private async removeSocialConnection(userId: string, provider: SocialProvider): Promise<void> {
    try {
      await supabase
        .from('social_connections')
        .update({ active: false })
        .eq('user_id', userId)
        .eq('provider', provider);
    } catch (error) {
      console.error('Failed to remove social connection:', error);
    }
  }

  async shareToSocial(
    provider: SocialProvider,
    content: {
      title: string;
      description?: string;
      url: string;
      image?: string;
    }
  ): Promise<void> {
    const { title, description, url, image } = content;

    let shareUrl = '';

    switch (provider) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;

      case 'twitter':
        const text = `${title}${description ? ' - ' + description : ''}`;
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;

      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;

      default:
        throw new Error(`Sharing to ${provider} not supported`);
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');

    trackEvent('content_shared', {
      provider,
      title,
      url
    });
  }
}

export const socialAuth = new SocialAuthService();

export async function signInWithGoogle(): Promise<void> {
  return socialAuth.signInWithSocial({
    provider: 'google',
    scopes: ['email', 'profile']
  });
}

export async function signInWithFacebook(): Promise<void> {
  return socialAuth.signInWithSocial({
    provider: 'facebook',
    scopes: ['email', 'public_profile']
  });
}

export async function signInWithTwitter(): Promise<void> {
  return socialAuth.signInWithSocial({
    provider: 'twitter'
  });
}

export async function linkSocialAccount(provider: SocialProvider): Promise<void> {
  return socialAuth.linkSocialAccount(provider);
}

export async function shareToSocial(
  provider: SocialProvider,
  content: {
    title: string;
    description?: string;
    url: string;
    image?: string;
  }
): Promise<void> {
  return socialAuth.shareToSocial(provider, content);
}
