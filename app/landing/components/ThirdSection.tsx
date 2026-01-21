"use client";
import React, { useState, useRef, useEffect } from "react";

function ThirdSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // If scrolling UP (top > 0), hide to trigger reverse animation next time
          if (entry.boundingClientRect.top > 0) {
            setIsVisible(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const carouselItems = [
    {
      id: 0,
      bgColor: "bg-orange-500",
      gradient: "from-orange-400 to-orange-600",
    },
    { id: 1, bgColor: "bg-blue-500", gradient: "from-blue-400 to-blue-600" },
    {
      id: 2,
      bgColor: "bg-purple-500",
      gradient: "from-purple-400 to-purple-600",
    },
    { id: 3, bgColor: "bg-pink-500", gradient: "from-pink-400 to-pink-600" },
    { id: 4, bgColor: "bg-green-500", gradient: "from-green-400 to-green-600" },
  ];

  const totalItems = carouselItems.length;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalItems - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalItems - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div
      ref={sectionRef}
      className="w-full  min-h-screen py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24"
    >
      <style jsx>{`
        @keyframes flyIn {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes flyOut {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px);
            opacity: 0;
          }
        }
        .animate-fly-in {
          animation: flyIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-fly-out {
          animation: flyOut 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
        }
      `}</style>
      {/* Top Section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 gap-6 md:gap-0 ">
        {/* Left Side - Heading */}
        <div className="mb-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-space-grotesk font-bold text-black leading-tight">
            Relmes isn't just
            <br />
            another platform.
          </h2>
        </div>

        {/* Right Side - Speech Bubble */}
        {/* <div className="bg-black rounded-xl sm:rounded-2xl px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 relative">
          <div className="text-white font-space-grotesk text-base sm:text-lg md:text-xl font-medium">
            @for you
          </div>
     
          <div className="absolute -bottom-1.5 sm:-bottom-2 left-6 sm:left-8 w-3 h-3 sm:w-4 sm:h-4 bg-black transform rotate-45"></div>
        </div> */}
      </div>

      {/* Main Content Area */}
      <div className="w-full flex justify-center">
        <div
          className={`w-full max-w-full sm:max-w-[95%] md:max-w-[90%] rounded-2xl sm:rounded-3xl relative ${isVisible ? "animate-fly-in" : "animate-fly-out opacity-0"
            }`}
        >
          {/* Carousel Container */}
          <div className="w-full h-[400px]  sm:h-[450px] md:h-[500px] lg:h-[300px] rounded-xl sm:rounded-2xl relative">
            {/* Carousel Items */}
            {carouselItems.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 bg-white rounded-xl sm:rounded-2xl transition-opacity duration-500 ease-in-out ${index === currentIndex ? "opacity-100 z-0" : "opacity-0 z-0"
                  }`}
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${item.gradient} rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center`}
                >
                  {/* Placeholder for portrait - replace with actual image */}
                  <div className="w-48 h-60 sm:w-56 sm:h-72 md:w-64 md:h-80 lg:w-full scale-90 p-4 lg:h-96 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white text-xl sm:text-2xl font-bold">
                      It’s a new layer of the digital world — one that belongs
                      to you. A realm where work, creativity, and play coexist. 
                      Where every puzzle you add builds something greater. 
                      Where your world isn’t hosted by someone else —  it’s
                      crafted by you.
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Top-Right: Carousel Indicators */}
            <div className="absolute -top-0.5 sm:-top-1 bg-white rounded-bl-2xl sm:rounded-bl-3xl p-4 sm:p-6 md:p-8 lg:p-10 -right-0.5 sm:-right-1 flex gap-1.5 sm:gap-2 z-10">
              {carouselItems.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-[#f0f0f0] w-4 sm:w-6"
                      : "bg-[#d2d2d2] w-1.5 sm:w-2"
                  }`}
                ></div>
              ))}
          </div>

            {/* Bottom-Left: Watch Button */}
      <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 z-10">
              <button className="bg-white text-black px-6 py-2 sm:px-8 sm:py-2.5 md:px-10 md:py-3 rounded-tr-2xl sm:rounded-tr-3xl text-sm sm:text-base font-semibold hover:bg-gray-100 active:bg-gray-200 transition-colors">
          {/* Watch */}
         </button>
      </div>

        {/* Bottom -Right: Navigation Arrows */}
            <div className="absolute -bottom-1 sm:-bottom-2 bg-white right-6 sm:right-8 md:right-10 rounded-t-2xl sm:rounded-t-3xl px-2 py-1 sm:px-3 sm:py-1.5 flex gap-2 sm:gap-3 z-10">
              <button
                onClick={goToPrevious}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Previous"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Next"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThirdSection;
