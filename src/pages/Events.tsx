import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import EventCard from "../components/Cards/EventCard";
import BannerCard from "../components/Cards/BannerCard";
import GalleryCard from "../components/Cards/GalleryCard";

import { getContentByFolder } from "../utils/firebaseUtils";
import { sortByDateTime } from "../utils/sortUtils";

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Parallax, Navigation, Pagination, Autoplay, Keyboard, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Swiper styles
import 'swiper/css';
// import 'swiper/css/effect-coverflow'; // Removed as we are using Parallax
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Gallery styles
import '../css/Gallery.css';

interface DateRange {
  start: string;
  end?: string;
}

interface TimeRange {
  start: string;
  end?: string;
}

interface EventData {
  id: string;
  heading?: string;
  date?: DateRange;
  time?: TimeRange;
  venue?: string;
  speaker?: string;
  theme?: string;
  content: string;
  image?: string;
  winner?: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [_swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);
  const [paginationEl, setPaginationEl] = useState<HTMLDivElement | null>(null);

  // Build gallery data from Firebase events that have an image
  const galleryData = events
    .filter((event) => event.image)
    .map((event) => ({
      id: event.id,
      img: event.image!,
      title: event.heading || 'Event',
      description: event.theme || event.content?.slice(0, 60) || '',
      date: event.date?.start || '',
    }));

  const title = "Know More About Our Recent Events";
  const description = "Here is a vibrant showcase of the different events we organize to promote gender equality and create a safe and inclusive environment for all. In the past, we have organized multiple workshops, seminars, awareness programs, and activities. Join us in our mission to foster understanding, support, and empowerment within the community.";
  const buttons = [
    { label: "Events details", sectionId: "section-event-gallery" },
    { label: "Gallery", sectionId: "gallery" }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      const eventData = await getContentByFolder('events');
      setEvents(sortByDateTime(eventData));
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      <BannerCard title={title} description={description} buttons={buttons} />

      <section className="py-16 md:py-20" id="section-event-gallery">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 font-heading text-primary">Recent Events</h1>
        <div className="page-container grid gap-8">
          {events.map((event) => (
            <EventCard
              key={event.id}
              heading={event.heading}
              date={event.date}
              time={event.time}
              venue={event.venue}
              speaker={event.speaker}
              theme={event.theme}
              content={event.content}
              image={event.image}
              winner={event.winner}
            />
          ))}
        </div>
      </section>

      <section className="gallery-section py-20 md:py-24 bg-base-100 relative" id="gallery" aria-label="Event Gallery">
        <div className="page-container relative z-10">
          <Fade triggerOnce>
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-3 font-heading text-primary">
                Event Gallery
              </h2>
              <p className="text-base md:text-lg text-neutral/80 max-w-2xl mx-auto leading-relaxed">
                Explore our vibrant collection of events celebrating gender equality and community engagement
              </p>
            </div>
          </Fade>

          {galleryData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral text-lg">No gallery items available at the moment.</p>
            </div>
          ) : (
            <>
              {/* Live region for screen reader announcements */}
              <div
                id="gallery-live-region"
                className="gallery-live-region"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              ></div>

              <div className="gallery-container relative">
                {/* Swiper Carousel with Parallax Effect */}
                <Swiper
                  modules={[Parallax, Navigation, Pagination, Autoplay, Keyboard, A11y]}
                  parallax={true}
                  speed={800}
                  grabCursor={true}
                  centeredSlides={true}
                  loop={true}
                  keyboard={{
                    enabled: true,
                  }}
                  a11y={{
                    prevSlideMessage: 'Previous slide',
                    nextSlideMessage: 'Next slide',
                  }}
                  breakpoints={{
                    320: {
                      slidesPerView: 1.2,
                      spaceBetween: 10,
                    },
                    640: {
                      slidesPerView: 1.5,
                      spaceBetween: 15,
                    },
                    1024: {
                      slidesPerView: 2.5,
                      spaceBetween: 20,
                    },
                  }}
                  navigation={{
                    prevEl,
                    nextEl,
                  }}
                  pagination={{
                    el: paginationEl,
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  onSwiper={setSwiperInstance}
                  onSlideChange={(swiper) => setSelectedIndex(swiper.realIndex)}
                  className="gallery-swiper !py-12 relative [&_.swiper-pagination-bullet]:w-2.5 [&_.swiper-pagination-bullet]:h-2.5 [&_.swiper-pagination-bullet]:bg-neutral-400/30 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:!bg-primary [&_.swiper-pagination-bullet-active]:!w-10 [&_.swiper-pagination-bullet-active]:rounded-full"
                >
                  {galleryData.map((item, index) => (
                    <SwiperSlide key={item.id} className="gallery-slide-swiper h-[350px] sm:h-[400px] md:h-[500px] w-auto">
                      <GalleryCard
                        image={item.img}
                        title={item.title}
                        description={item.description}
                        date={item.date}
                        isActive={index === selectedIndex}
                        data-swiper-parallax="-15%"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Navigation Buttons - Styled with Tailwind Glassmorphism */}
                <button
                  ref={setPrevEl}
                  className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-md border border-primary/20 text-primary shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white hover:shadow-primary/30 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Previous gallery item"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  ref={setNextEl}
                  className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-md border border-primary/20 text-primary shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary hover:text-white hover:shadow-primary/30 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Next gallery item"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Pagination Dots */}
                <div ref={setPaginationEl} className="flex justify-center items-center gap-2 mt-8 !relative"></div>
              </div>
            </>
          )}
        </div>
      </section>


    </div>
  );
};

export default EventsPage;
