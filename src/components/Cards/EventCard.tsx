import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { getOptimizedEventCardImage, getLQIPUrl } from '../../utils/imagekitUtils';

interface EventCardProps {
    heading?: string;
    content: string;
    image?: string;
    date?: string;
    time?: string;
    venue?: string;
    speaker?: string;
    theme?: string;
}

const EventCard: React.FC<EventCardProps> = ({
    heading,
    content,
    image,
    date,
    time,
    venue,
    speaker,
    theme,
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const controls = useAnimation();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showLQIP, setShowLQIP] = useState(true);

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [isInView, controls]);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
            }}
            className="card lg:card-side bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 my-8 mx-4 overflow-hidden border border-base-200"
        >
            <div className="card-body lg:w-2/3">
                {heading && <h2 className="card-title text-2xl font-bold mb-4">{heading}</h2>}
                <div className="space-y-2 text-sm text-base-content/80">
                    {date && <p><span className="font-semibold">Date:</span> {date}</p>}
                    {time && <p><span className="font-semibold">Time:</span> {time}</p>}
                    {venue && <p><span className="font-semibold">Venue:</span> {venue}</p>}
                    {speaker && <p><span className="font-semibold">Speaker:</span> {speaker}</p>}
                    {theme && <p><span className="font-semibold">Theme:</span> {theme}</p>}
                </div>
                <div
                    className="mt-4 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
            {image && (
                <figure className="lg:w-1/3 h-64 lg:h-auto relative bg-base-200">
                    {/* Low Quality Image Placeholder (LQIP) for blur-up effect */}
                    {showLQIP && (
                        <img
                            src={getLQIPUrl(image)}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover blur-sm"
                            aria-hidden="true"
                        />
                    )}
                    {/* Optimized high-quality image */}
                    <img
                        src={getOptimizedEventCardImage(image)}
                        alt={heading || "Event image"}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        loading="lazy"
                        onLoad={() => {
                            setImageLoaded(true);
                            setTimeout(() => setShowLQIP(false), 500);
                        }}
                    />
                    {/* Loading skeleton */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-base-200 via-base-300 to-base-200 animate-pulse" />
                    )}
                </figure>
            )}
        </motion.div>
    );
};

export default EventCard;
