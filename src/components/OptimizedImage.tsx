import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
  blurDataURL?: string;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  width,
  height,
  blurDataURL
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(blurDataURL || src);

  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');

  useEffect(() => {
    if (loading === 'eager' || !blurDataURL) {
      setCurrentSrc(src);
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setHasError(true);
    };
  }, [src, loading, blurDataURL]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError && !blurDataURL) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        onLoad={handleLoad}
      />
    );
  }

  return (
    <div className="relative overflow-hidden">
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover blur-xl scale-110 ${className}`}
          aria-hidden="true"
        />
      )}
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={currentSrc}
          alt={alt}
          className={`${className} ${!isLoaded && blurDataURL ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 relative z-10`}
          loading={loading}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
        />
      </picture>
    </div>
  );
}
