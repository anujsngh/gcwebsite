/**
 * Utility functions for ImageKit URL transformations
 */

export interface ImageKitTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'jpg' | 'png' | 'webp';
  blur?: number;
  progressive?: boolean;
}

/**
 * Adds transformation parameters to an ImageKit URL
 * @param url - The original ImageKit URL
 * @param options - Transformation options
 * @returns Transformed ImageKit URL
 */
export const transformImageKitUrl = (
  url: string,
  options: ImageKitTransformOptions
): string => {
  if (!url || typeof url !== 'string' || !url.includes('imagekit.io')) {
    return url || ''; // Return original URL or empty string if not an ImageKit URL
  }

  const transformations: string[] = [];

  if (options.width) transformations.push(`w-${options.width}`);
  if (options.height) transformations.push(`h-${options.height}`);
  if (options.quality) transformations.push(`q-${options.quality}`);
  if (options.format) transformations.push(`f-${options.format}`);
  if (options.blur) transformations.push(`bl-${options.blur}`);
  if (options.progressive) transformations.push('pr-true');

  if (transformations.length === 0) {
    return url;
  }

  const transformString = `tr=${transformations.join(',')}`;

  // Check if URL already has query parameters
  const separator = url.includes('?') ? '&' : '?';

  return `${url}${separator}${transformString}`;
};

/**
 * Generates a Low Quality Image Placeholder (LQIP) URL for progressive loading
 * @param url - The original ImageKit URL
 * @returns LQIP URL with blur effect
 */
export const getLQIPUrl = (url: string): string => {
  return transformImageKitUrl(url, {
    width: 50,
    quality: 20,
    blur: 10,
    format: 'auto'
  });
};

/**
 * Optimizes event card images for the Events page
 * Provides responsive, high-quality images at appropriate sizes
 * @param url - The original ImageKit URL
 * @returns Optimized ImageKit URL
 */
export const getOptimizedEventCardImage = (url: string): string => {
  return transformImageKitUrl(url, {
    width: 600,        // Suitable for 1/3 card width on desktop
    height: 400,       // Maintains good aspect ratio
    quality: 80,       // Good balance between quality and file size
    format: 'auto',    // Let ImageKit choose best format (WebP for modern browsers)
    progressive: true  // Enable progressive loading
  });
};

/**
 * Creates a srcset for responsive images
 * @param url - The original ImageKit URL
 * @returns Object with srcset and sizes attributes
 */
export const getResponsiveImageProps = (url: string) => {
  const sizes = [400, 600, 800, 1200];

  const srcset = sizes
    .map(size => {
      const transformedUrl = transformImageKitUrl(url, {
        width: size,
        quality: 80,
        format: 'auto',
        progressive: true
      });
      return `${transformedUrl} ${size}w`;
    })
    .join(', ');

  return {
    srcset,
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    src: getOptimizedEventCardImage(url)
  };
};
