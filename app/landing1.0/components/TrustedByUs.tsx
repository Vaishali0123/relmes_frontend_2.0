"use client";
import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function TrustedByUs() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const companies = [
    { name: "Webivus", logo: "CIRCUS" },
    { name: "Nexifinity", logo: "Mercury" },
    { name: "Near Zero", logo: "Remote Miro" },
    { name: "Apna City", logo: "BB" },
    { name: "Grovyo", logo: "Databricks" },
    { name: "SuperBlocks", logo: "Linear" },
    // { name: "CIRCLE", logo: "CIRCLE" },
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

      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      // Resume auto-scroll after a delay
      pauseTimeoutRef.current = setTimeout(() => {
        setIsPaused(false);
        pauseTimeoutRef.current = null;
      }, 3000); // Resume after 3 seconds
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
            behavior: "auto", // Instant reset for seamless loop
          });
        } else {
          carouselRef.current.scrollBy({
            left: 1,
            behavior: "auto", // Smooth continuous scroll
          });
        }
      }
    }, 20); // Scroll every 20ms for smooth movement

    return () => {
      clearInterval(interval);
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [isPaused]);

  return (
    <div className="w-full py-16 px-8 md:px-16 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative">
          {/* Left Side - Text Content */}
          <div className="mb-8 md:mb-0 flex-1">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-black">Brands that have</span>
              <span className="text-gray-500"> trusted us</span>
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl">
              Our growth hackers are experts in identifying and capitalizing on
              the most
            </p>
          </div>

          {/* Right Side - Navigation Arrows */}
          <div className="flex gap-3 items-center">
            <button
              onClick={() => scrollCarousel("left")}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Company Logos Carousel */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedCompanies.map((company, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center min-w-[150px] md:min-w-[180px]"
              >
                <div className="text-gray-400 text-xl md:text-2xl font-medium hover:text-gray-600 transition-colors">
                  {company.logo}
                </div>
              </div>
            ))}
          </div>
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
