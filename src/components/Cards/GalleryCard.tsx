import React, { useState, useCallback, useEffect } from 'react';
import { getOptimizedEventCardImage, getLQIPUrl } from '../../utils/imagekitUtils';

interface GalleryCardProps {
    image: string;
    title: string;
    description?: string;
    date?: string;
    isActive?: boolean;
    "data-swiper-parallax"?: string;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
    image,
    title,
    description,
    date,
    isActive = false,
    "data-swiper-parallax": parallaxValue,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [showLQIP, setShowLQIP] = useState(true);

    // Handle image load with proper cleanup
    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
        setImageError(false);
        // Hide LQIP after fade-in completes
        const timer = setTimeout(() => setShowLQIP(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Handle image load errors
    const handleImageError = useCallback(() => {
        setImageError(true);
        setImageLoaded(false);
        setShowLQIP(false);
    }, []);

    // Announce active state changes to screen readers
    useEffect(() => {
        if (isActive) {
            const announcement = `${title} slide is now active. ${description || ''} ${date || ''}`;
            // Create a live region announcement
            const liveRegion = document.getElementById('gallery-live-region');
            if (liveRegion) {
                liveRegion.textContent = announcement;
            }
        }
    }, [isActive, title, description, date]);

    const showText = isActive;

    return (
        <article
            className={`gallery-card relative w-full h-full rounded-[32px] overflow-hidden bg-white transition-all duration-500 ease-out`}
            aria-label={`${title} gallery item`}
            role="group"
            aria-current={isActive ? 'true' : undefined}

        >
            {/* Image Container - Parallax applied here for background movement. High scale to cover parallax gaps. */}
            <div
                className={`relative w-full h-full transform transition-transform duration-1000 ease-out will-change-transform ${isActive ? 'scale-110 grayscale-0' : 'scale-135 grayscale'}`}
                data-swiper-parallax={parallaxValue}
            >
                {/* Low Quality Image Placeholder (LQIP) for blur-up effect */}
                {showLQIP && !imageError && (
                    <img
                        src={getLQIPUrl(image)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover blur-sm"
                        aria-hidden="true"
                    />
                )}

                {/* Optimized high-quality image */}
                {!imageError && (
                    <img
                        src={getOptimizedEventCardImage(image)}
                        alt={`${title}${description ? `: ${description}` : ''}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        loading="lazy"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                    />
                )}

                {/* Error state */}
                {imageError && (
                    <div className="absolute inset-0 w-full h-full bg-base-200 flex flex-col items-center justify-center text-center p-4">
                        <svg
                            className="w-16 h-16 text-base-300 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-sm text-base-content/60">Image unavailable</p>
                    </div>
                )}

                {/* Loading skeleton */}
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-base-200 via-base-300 to-base-200 animate-pulse" />
                )}

                {/* Gradient overlay for better text readability - DARK SCROME for White Text */}
                <div className={`absolute bottom-0 left-0 right-0 h-1/4 transition-opacity duration-500 ${showText ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent"></div>
                </div>

                {/* Title Overlay - Slides up on hover/active */}
                <div
                    className={`absolute left-0 right-0 transition-all duration-500 ease-out ${showText
                        ? 'bottom-0 opacity-100 translate-y-0'
                        : '-bottom-8 opacity-0 translate-y-4'
                        }`}
                >
                    <div className="p-6 space-y-2">
                        <h3
                            className={`font-heading font-bold transition-all duration-400 line-clamp-2 text-white drop-shadow-md ${showText ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
                                }`}
                        >
                            {title}
                        </h3>

                        {description && (
                            <p className={`text-neutral-200 text-base md:text-lg transition-all duration-500 line-clamp-2 font-medium ${showText ? 'opacity-100 translate-y-0 delay-75' : 'opacity-0 translate-y-2'
                                }`}>
                                {description}
                            </p>
                        )}

                        {date && (
                            <p className={`text-secondary font-semibold text-sm md:text-base transition-all duration-500 flex items-center gap-2 ${showText ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-2'
                                }`}>
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <time dateTime={date}>{date}</time>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default GalleryCard;
