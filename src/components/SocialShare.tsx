import { Facebook, Twitter, Linkedin, Share2, Youtube, Instagram, MessageCircle } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'rounded';
}

export default function SocialShare({
  url,
  title,
  description,
  image,
  showLabels = false,
  size = 'md',
  variant = 'default'
}: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
  };

  const handleShare = (platform: string, shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes');

    trackEvent('content_shared', {
      platform,
      url,
      title
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });

        trackEvent('content_shared', {
          platform: 'native',
          url,
          title
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonClass = `${sizeClasses[size]} flex items-center justify-center
    ${variant === 'rounded' ? 'rounded-full' : 'rounded-lg'}
    transition-all duration-200 hover:scale-110 active:scale-95`;

  return (
    <div className="flex items-center gap-3">
      {showLabels && (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Share:
        </span>
      )}

      <button
        onClick={() => handleShare('facebook', shareLinks.facebook)}
        className={`${buttonClass} bg-[#1877F2] hover:bg-[#0C63D4] text-white`}
        title="Share on Facebook"
      >
        <Facebook className={iconSizes[size]} />
      </button>

      <button
        onClick={() => handleShare('twitter', shareLinks.twitter)}
        className={`${buttonClass} bg-[#1DA1F2] hover:bg-[#0C8BD9] text-white`}
        title="Share on Twitter/X"
      >
        <Twitter className={iconSizes[size]} />
      </button>

      <button
        onClick={() => handleShare('linkedin', shareLinks.linkedin)}
        className={`${buttonClass} bg-[#0A66C2] hover:bg-[#004182] text-white`}
        title="Share on LinkedIn"
      >
        <Linkedin className={iconSizes[size]} />
      </button>

      <button
        onClick={() => handleShare('whatsapp', shareLinks.whatsapp)}
        className={`${buttonClass} bg-[#25D366] hover:bg-[#1EBE57] text-white`}
        title="Share on WhatsApp"
      >
        <MessageCircle className={iconSizes[size]} />
      </button>

      {navigator.share && (
        <button
          onClick={handleNativeShare}
          className={`${buttonClass} bg-gray-600 hover:bg-gray-700 text-white`}
          title="Share"
        >
          <Share2 className={iconSizes[size]} />
        </button>
      )}
    </div>
  );
}

interface VideoEmbedProps {
  platform: 'youtube' | 'vimeo';
  videoId: string;
  title?: string;
  autoplay?: boolean;
  className?: string;
}

export function VideoEmbed({
  platform,
  videoId,
  title,
  autoplay = false,
  className = ''
}: VideoEmbedProps) {
  const getEmbedUrl = () => {
    switch (platform) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoId}${autoplay ? '?autoplay=1' : ''}`;
      default:
        return '';
    }
  };

  return (
    <div className={`relative aspect-video ${className}`}>
      <iframe
        src={getEmbedUrl()}
        title={title || 'Video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-lg"
      />
    </div>
  );
}

interface SocialFeedProps {
  platform: 'instagram' | 'youtube';
  handle?: string;
  posts?: any[];
  className?: string;
}

export function SocialFeed({ platform, handle, posts, className = '' }: SocialFeedProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {platform === 'instagram' && <Instagram className="h-6 w-6 text-pink-600" />}
          {platform === 'youtube' && <Youtube className="h-6 w-6 text-red-600" />}
          <span className="font-semibold text-gray-900 dark:text-white">
            @{handle}
          </span>
        </div>
        <a
          href={platform === 'instagram'
            ? `https://instagram.com/${handle}`
            : `https://youtube.com/@${handle}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Follow
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {posts?.map((post, index) => (
          <a
            key={index}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square rounded-lg overflow-hidden hover:opacity-75 transition-opacity"
          >
            <img
              src={post.thumbnail}
              alt={post.caption || 'Post'}
              className="w-full h-full object-cover"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
