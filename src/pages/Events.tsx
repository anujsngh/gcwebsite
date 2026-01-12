import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import EventCard from "../components/Cards/EventCard";
import BannerCard from "../components/Cards/BannerCard";
import GalleryCard from "../components/Cards/GalleryCard";

import { getContentByFolder } from "../utils/firebaseUtils";

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
import '../css/Gallery.css';// Import images for gallery
import hall1 from "../assets/images_events/hall1.jpg";
import hall2 from "../assets/images_events/hall2.jpg";
import lapata1 from "../assets/images_events/lapata1.png";
import runwalk2 from "../assets/images_events/run_walk2.png";
import runwalk3 from "../assets/images_events/run_walk3.png";
import lapata2 from "../assets/images_events/lapata2.png";
import barbie1 from "../assets/images_events/barbie1.png";
import barbie2 from "../assets/images_events/barbie2.png";

interface EventData {
  id: string;
  heading?: string;
  datetime?: string;
  venue?: string;
  speaker?: string;
  theme?: string;
  content: string;
  image?: string;
}

interface GalleryItem {
  id: number;
  img: string;
  title: string;
  description: string;
  date: string;
}

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);
  const [paginationEl, setPaginationEl] = useState<HTMLDivElement | null>(null);

  const galleryData: GalleryItem[] = [
    {
      id: 1,
      img: hall1,
      title: "Hall Event 2024",
      description: "Annual gathering celebration",
      date: "March 2024"
    },
    {
      id: 2,
      img: hall2,
      title: "Community Workshop",
      description: "Gender sensitization seminar",
      date: "March 2024"
    },
    {
      id: 3,
      img: lapata1,
      title: "Lapata Ladies Screening",
      description: "Movie screening and discussion",
      date: "February 2024"
    },
    {
      id: 4,
      img: runwalk2,
      title: "Run for Equality",
      description: "Awareness run/walk event",
      date: "January 2024"
    },
    {
      id: 5,
      img: runwalk3,
      title: "Community Run 2024",
      description: "Annual campus run event",
      date: "January 2024"
    },
    {
      id: 6,
      img: lapata2,
      title: "Film Discussion Session",
      description: "Interactive movie discussion",
      date: "February 2024"
    },
    {
      id: 7,
      img: barbie1,
      title: "Barbie Movie Screening",
      description: "Special screening event",
      date: "December 2023"
    },
    {
      id: 8,
      img: barbie2,
      title: "Barbie Celebration",
      description: "Themed celebration event",
      date: "December 2023"
    },
  ];

  const title = "Know More About Our Recent Events";
  const description = "Here is a vibrant showcase of the different events we organize to promote gender equality and create a safe and inclusive environment for all. In the past, we have organized multiple workshops, seminars, awareness programs, and activities. Join us in our mission to foster understanding, support, and empowerment within the community.";
  const buttons = [
    { label: "Events details", sectionId: "section-event-gallery" },
    { label: "Gallery", sectionId: "gallery" }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      const eventData = await getContentByFolder('event');
      setEvents(eventData.reverse());
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
              datetime={event.datetime}
              venue={event.venue}
              speaker={event.speaker}
              theme={event.theme}
              content={event.content}
              image={event.image}
            />
          ))}
        </div>
      </section>

      <section className="gallery-section py-20 md:py-24 bg-base-100 relative" id="gallery" aria-label="Event Gallery">
        {/* Decorative Floating Particles */}
        <div className="gallery-particle gallery-particle-1" aria-hidden="true"></div>
        <div className="gallery-particle gallery-particle-2" aria-hidden="true"></div>
        <div className="gallery-particle gallery-particle-3" aria-hidden="true"></div>

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
