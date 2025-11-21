"use client";
import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function TrustedByUs() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const companies = [
    { name: "Webivus", logo: "Webivus" },
    { name: "Nexifinity", logo: "Nexifinity" },
    { name: "Near Zero", logo: "Near Zero" },
    { name: "Apna City", logo: "Apna City" },
    { name: "Grovyo", logo: "Grovyo" },
    { name: "SuperBlocks", logo: "SuperBlocks" },
    { name: "Willowave", logo: "Willowave" },
  ];

  // Duplicate companies for seamless infinite scroll
  const duplicatedCompanies = [
    ...companies,
    ...companies,
    ...companies,
    ...companies,
  ];

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      // Clear any existing timeout
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }

      // Pause auto-scroll when manually navigating
      setIsPaused(true);

      const scrollAmount = window.innerWidth < 768 ? 200 : 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      // Resume auto-scroll after a delay
      pauseTimeoutRef.current = setTimeout(() => {
        setIsPaused(false);
        pauseTimeoutRef.current = null;
      }, 3000);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!carouselRef.current || isPaused) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const maxScroll = scrollWidth - clientWidth;

        // If we've scrolled to the end, reset to the beginning seamlessly
        if (scrollLeft >= maxScroll - 10) {
          carouselRef.current.scrollTo({
            left: 0,
            behavior: "auto",
          });
        } else {
          carouselRef.current.scrollBy({
            left: 1,
            behavior: "auto",
          });
        }
      }
    }, 20);

    return () => {
      clearInterval(interval);
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [isPaused]);

  return (
    <div className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-10 md:mb-12 relative gap-6 md:gap-0">
          {/* Left Side - Text Content */}
          <div className="mb-0 md:mb-0 flex-1 w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-space-grotesk font-bold mb-3 sm:mb-4 leading-tight">
              <span className="text-black">Brands that have</span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="text-gray-500">trusted us</span>
            </h2>
            {/* <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl">
              Our growth hackers are experts in identifying and capitalizing on
              the most
            </p> */}
          </div>

          {/* Right Side - Navigation Arrows */}
          <div className="flex gap-2 sm:gap-3 items-center self-end md:self-auto">
            <button
              onClick={() => scrollCarousel("left")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Company Logos Carousel */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => {
              setTimeout(() => setIsPaused(false), 3000);
            }}
          >
            {duplicatedCompanies.map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center min-w-[120px] sm:min-w-[140px] md:min-w-[160px] lg:min-w-[180px]"
              >
                <div className="text-gray-400 text-base sm:text-lg md:text-xl lg:text-2xl font-space-grotesk font-medium hover:text-gray-600 transition-colors cursor-pointer">
                  {company.logo}
                </div>
              </div>
            ))}
          </div>

          {/* Gradient Overlays for fade effect on edges */}
          <div className="absolute left-0 top-0 bottom-4 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-4 w-12 sm:w-16 md:w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default TrustedByUs;
