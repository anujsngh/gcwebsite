import React, { useEffect, useRef, useState } from 'react';
import './imageslider.css';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ImageSliderProps {
  images: string[];
  textHeight?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [counter, setCounter] = useState<number>(0);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const goNext = () => {
    setCounter((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const goPrev = () => {
    setCounter((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  // Skip auto-advance when user prefers reduced motion
  useEffect(() => {
    if (shouldReduceMotion) return;

    intervalId.current = setInterval(goNext, 5000);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [shouldReduceMotion]);

  return (
    <div className="event-gallery" role="region" aria-label="Image gallery">
      <div
        className="event-gallery-images"
        style={{
          transform: `translateX(-${counter * 100}%)`,
          transition: shouldReduceMotion ? 'none' : undefined,
        }}
      >
        {images.map((image, index) => (
          <img
            src={image}
            className="slide"
            key={index}
            alt={`Gallery image ${index + 1} of ${images.length}`}
            style={{ height: '100%', width: 'auto' }}
          />
        ))}
      </div>
      <div className="nav">
        <button
          onClick={goPrev}
          className="nav-button nav-button-prev"
          aria-label="Previous image"
        />
        <button
          onClick={goNext}
          className="nav-button nav-button-next"
          aria-label="Next image"
        />
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Image {counter + 1} of {images.length}
      </div>
    </div>
  );
};

export default ImageSlider;
