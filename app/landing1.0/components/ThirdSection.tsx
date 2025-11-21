"use client";
import React, { useState } from "react";

function ThirdSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array of 5 different carousel items
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
    <div className="w-full min-h-screen py-16 px-8 md:px-16 lg:px-24">
      {/* Top Section */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mb-12 md:mb-16">
        {/* Left Side - Heading */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-4xl font-space-grotesk md:text-5xl lg:text-5xl font-bold text-black leading-tight">
            Gateway to
            <br />
            artist people.
          </h2>
        </div>

        {/* Right Side - Speech Bubble */}
        <div className="bg-black rounded-2xl px-6 py-3 md:px-8 md:py-4 relative">
          <div className="text-white text-lg md:text-xl font-medium">
            @reatha
          </div>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 left-8 w-4 h-4 bg-black transform rotate-45"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[90%] bg-gray-200 rounded-3xl p-6 md:p-8 lg:p-12 relative overflow-hidden">
          {/* Carousel Container */}
          <div className="w-full h-[300px] rounded-2xl relative overflow-hidden">
            {/* Carousel Items */}
            {carouselItems.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  index === currentIndex ? "opacity-100 z-0" : "opacity-0 z-0"
                }`}
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
                >
                  {/* Placeholder for portrait - replace with actual image */}
                  <div className="w-64 h-80 md:w-80 md:h-96 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      Item {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Top-Left: Color Swatches */}
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
              <div className="w-8 h-8 bg-white rounded-lg shadow-md"></div>
              <div className="w-8 h-8 bg-black rounded-lg shadow-md"></div>
            </div>

            {/* Top-Right: Carousel Indicators */}
            <div className="absolute top-6  right-6 flex gap-2 z-10">
              {carouselItems.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                ></div>
              ))}
            </div>

            {/* Bottom-Left: Watch Button */}
            <div className="absolute bottom-6 left-6 z-10">
              <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-colors">
                Watch
              </button>
            </div>

            {/* Bottom-Right: Navigation Arrows */}
            <div className="absolute bottom-6  right-6 flex gap-3 z-10">
              <button
                onClick={goToPrevious}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-black"
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
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-black"
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
