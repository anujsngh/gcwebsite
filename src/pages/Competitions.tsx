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

interface CompetitionData {
    id: string;
    heading?: string;
    date?: DateRange;
    time?: TimeRange;
    venue?: string;
    theme?: string;
    content: string;
    image?: string;
    winner?: string;
}

const Competitions: React.FC = () => {
    const [competitions, setCompetitions] = useState<CompetitionData[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [_swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
    const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);
    const [paginationEl, setPaginationEl] = useState<HTMLDivElement | null>(null);

    // Build gallery data from Firebase competitions that have an image
    const galleryData = competitions
        .filter((comp) => comp.image)
        .map((comp) => ({
            id: comp.id,
            img: comp.image!,
            title: comp.heading || 'Competition',
            description: comp.theme || comp.content?.slice(0, 60) || '',
            date: comp.date?.start || '',
        }));

    const title = "Competitions";
    const description = "Participate in our exciting competitions designed to challenge your skills, foster creativity, and promote awareness. From debates and quizzes to creative writing and art contests, there's something for everyone. Join us to showcase your talents and win amazing prizes!";
    const buttons = [
        { label: "Competitions details", sectionId: "section-competitions-list" },
        { label: "Gallery", sectionId: "gallery" },
    ];

    useEffect(() => {
        const fetchCompetitions = async () => {
            const data = await getContentByFolder('competitions');
            setCompetitions(sortByDateTime(data));
        };

        fetchCompetitions();
    }, []);

    return (
        <div className="min-h-screen bg-base-100">
            <BannerCard title={title} description={description} buttons={buttons} />

            <section className="py-16 md:py-20" id="section-competitions-list">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 font-heading text-primary">Upcoming & Recent Competitions</h2>
                <div className="page-container grid gap-8">
                    {competitions.length > 0 ? (
                        competitions.map((comp) => (
                            <EventCard
                                key={comp.id}
                                heading={comp.heading}
                                date={comp.date}
                                time={comp.time}
                                venue={comp.venue}
                                theme={comp.theme}
                                content={comp.content}
                                image={comp.image}
                                winner={comp.winner}
                            />
                        ))
                    ) : (
                        <div className="text-center text-lg text-base-content/70">
                            <p>No competitions found at the moment. Please check back later!</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="gallery-section py-20 md:py-24 bg-base-100 relative" id="gallery" aria-label="Competition Gallery">
                <div className="page-container relative z-10">
                    <Fade triggerOnce>
                        <div className="text-center mb-8 md:mb-10">
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-3 font-heading text-primary">
                                Competition Gallery
                            </h2>
                            <p className="text-base md:text-lg text-neutral/80 max-w-2xl mx-auto leading-relaxed">
                                Highlights from our competitions celebrating talent, creativity, and community spirit
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

                                <div ref={setPaginationEl} className="flex justify-center items-center gap-2 mt-8 !relative"></div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Competitions;
