"use client";
import React, { useEffect, useRef, useState } from "react";

function HeroSection() {
  const section2Ref = useRef<HTMLDivElement>(null);
  const [section2Visible, setSection2Visible] = useState(false);
  const [showInitialAnimation, setShowInitialAnimation] = useState(true);

  useEffect(() => {
    const el = section2Ref.current;
    if (!el || typeof window === "undefined") return;

    let userHasScrolled = false;
    let timeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      userHasScrolled = true;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!userHasScrolled) return; // Do not trigger on load

        // Clear any pending timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        // Log for debugging
        console.log("Intersection:", {
          isIntersecting: entry.isIntersecting,
          intersectionRatio: entry.intersectionRatio,
          boundingClientRect: entry.boundingClientRect,
        });

        // Check if section is intersecting (visible) and has at least 10% visible
        // When fully visible, intersectionRatio should be 1.0 or close to it
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          // Section is visible (at least 10%)
          setSection2Visible(true);
          setShowInitialAnimation(false);
        } else {
          // Section is not visible (completely out of view or less than 10% visible)
          // This handles both scrolling down past section 2 and scrolling back up
          setSection2Visible(false);
          setShowInitialAnimation(false); // Reset to show reverse animation first
          // Start initial animations right after reverse animation starts for smoother transition
          // Reverse animation is 0.5s, start initial animations immediately with CSS delay
          timeoutId = setTimeout(() => {
            setShowInitialAnimation(true);
          }, 300); // Start initial animation classes early, CSS delay handles smooth transition
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0], // Multiple thresholds including 0.9 and 1.0 for full visibility
      }
    );

    observer.observe(el);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // DEBUG: remove console if you don't want logs
  useEffect(() => {
    console.log("section2Visible:", section2Visible);
  }, [section2Visible]);
  console.log("section2Visible:", section2Visible);

  return (
    // Add keyframes for the animation of the boxes
    <>
      <style jsx>{`
        @keyframes box {
          0% {
            left: 40%;
            top: 80%;
          }
          100% {
            top: 10%;
            left: 80%;
          }
        }
        .animate-box {
          position: relative;
          animation: box 2s ease-in-out forwards;
        }

        @keyframes boxAnimation1 {
          0% {
            left: 40%;
            top: 80%;
            transform: rotate(45deg);
          }
          100% {
            top: 10%;
            left: 10%;
            transform: rotate(-15deg);
          }
        }
        .animate-box1 {
          position: relative;
          animation: boxAnimation1 0.7s ease-in-out forwards;
          animation-delay: 0.3s;
        }
        @keyframes boxAnimation2 {
          0% {
            left: 20%;
            top: 80%;
            transform: rotate(45deg);
          }
          100% {
            top: 10%;
            left: 5%;
            transform: rotate(-5deg);
          }
        }
        .animate-box2 {
          position: relative;
          animation: boxAnimation2 0.7s ease-in-out forwards;
          animation-delay: 0.3s;
        }
        @keyframes boxAnimation3 {
          0% {
            left: 0%;
            top: 80%;
            transform: rotate(45deg);
          }
          100% {
            top: 0%;
            left: 0%;
            transform: rotate(5deg);
          }
        }
        .animate-box3 {
          position: relative;
          animation: boxAnimation3 0.7s ease-in-out forwards;
          animation-delay: 0.3s;
        }
        @keyframes boxAnimation4 {
          0% {
            left: -20%;
            top: 80%;
            transform: rotate(45deg);
          }
          100% {
            top: 15%;
            left: -5%;
            transform: rotate(5deg);
          }
        }
        .animate-box4 {
          position: relative;
          animation: boxAnimation4 0.7s ease-in-out forwards;
          animation-delay: 0.3s;
        }
        @keyframes boxAnimation5 {
          0% {
            left: -40%;
            top: 80%;
            transform: rotate(45deg);
          }
          100% {
            top: 10%;
            left: -10%;
            transform: rotate(100deg);
          }
        }
        .animate-box5 {
          position: relative;
          animation: boxAnimation5 0.7s ease-in-out forwards;
          animation-delay: 0.3s;
        }

        @keyframes textAnimation1 {
          0% {
            top: 100%;
            left: 0%;
            opacity: 0%;
          }
          100% {
            top: 0%;
            left: 0%;
            opacity: 100%;
          }
        }
        .animate-text1 {
          position: relative;
          animation: textAnimation1 2s ease-in-out forwards;
        }
        @keyframes textAnimation2 {
          0% {
            opacity: 0%;
          }
          100% {
            opacity: 100%;
          }
        }
        .animate-text2 {
          position: relative;
          animation: textAnimation2 2s ease-in-out forwards;
        }
        @keyframes boxAnimation6 {
          0% {
            left: 40%;
            top: 80%;
            transform: rotate(45deg);
          }
          100% {
            top: 300%;
            left: 50%;
            transform: rotate(0deg);
          }
        }
        .animate-box6 {
          position: relative;
          animation: boxAnimation6 1s ease-in-out forwards;
        }

        @keyframes boxAnimation7 {
          0% {
            left: 20%;
            top: 80%;
            transform: rotate(45deg);
          }
          100% {
            top: 340%;
            left: 45%;
            transform: rotate(0deg);
          }
        }
        .animate-box7 {
          position: relative;
          animation: boxAnimation7 1s ease-in-out forwards;
        }
        @keyframes boxAnimation8 {
          0% {
            left: 0%;
            top: 80%;
            transform: rotate(45deg);
          }
          100% {
            top: 380%;
            left: 40%;
            transform: rotate(0deg);
          }
        }
        .animate-box8 {
          position: relative;
          animation: boxAnimation8 1s ease-in-out forwards;
        }
        @keyframes boxAnimation9 {
          0% {
            left: -20%;
            top: 80%;
            transform: rotate(45deg);
          }
          100% {
            top: 420%;
            left: 35%;
            transform: rotate(0deg);
          }
        }
        .animate-box9 {
          position: relative;
          animation: boxAnimation9 1s ease-in-out forwards;
        }
        @keyframes boxAnimation10 {
          0% {
            left: -40%;
            top: 80%;
            transform: rotate(45deg);
          }
          100% {
            top: 460%;
            left: 30%;
            transform: rotate(0deg);
          }
        }
        .animate-box10 {
          position: relative;
          animation: boxAnimation10 1s ease-in-out forwards;
        }

        @keyframes boxAnimation6Reverse {
          0% {
            top: 300%;
            left: 50%;
            transform: rotate(0deg);
          }
          100% {
            left: 40%;
            top: 80%;
            transform: rotate(45deg);
          }
        }
        .animate-box6-reverse {
          position: relative;
          animation: boxAnimation6Reverse 0.5s ease-in-out forwards;
        }

        @keyframes boxAnimation7Reverse {
          0% {
            top: 340%;
            left: 45%;
            transform: rotate(0deg);
          }
          100% {
            left: 20%;
            top: 80%;
            transform: rotate(45deg);
          }
        }
        .animate-box7-reverse {
          position: relative;
          animation: boxAnimation7Reverse 0.5s ease-in-out forwards;
        }

        @keyframes boxAnimation8Reverse {
          0% {
            top: 380%;
            left: 40%;
            transform: rotate(0deg);
          }
          100% {
            left: 0%;
            top: 80%;
            transform: rotate(45deg);
          }
        }
        .animate-box8-reverse {
          position: relative;
          animation: boxAnimation8Reverse 0.5s ease-in-out forwards;
        }

        @keyframes boxAnimation9Reverse {
          0% {
            top: 420%;
            left: 35%;
            transform: rotate(0deg);
          }
          100% {
            left: -20%;
            top: 80%;
            transform: rotate(45deg);
          }
        }
        .animate-box9-reverse {
          position: relative;
          animation: boxAnimation9Reverse 0.5s ease-in-out forwards;
        }

        @keyframes boxAnimation10Reverse {
          0% {
            top: 460%;
            left: 30%;
            transform: rotate(0deg);
          }
          100% {
            left: -40%;
            top: 80%;
            transform: rotate(45deg);
          }
        }
        .animate-box10-reverse {
          position: relative;
          animation: boxAnimation10Reverse 0.5s ease-in-out forwards;
        }
      `}</style>
      <div className="">
        {/* 1st section */}
        <div className="w-full h-screen py-[10vh] flex flex-col items-center justify-between">
          <div className="text-[40px] font-bold text-[#3F3F3F] ">
            Piece together your perfect server
          </div>
          {/* Image can overlap each other */}
          <div className="flex  flex-row  relative ">
            {/* <div className="w-[230px] h-[230px]  animate-box1 bg-slate-300"></div>
            <div className="w-[230px] h-[230px] animate-box2 bg-red-300"></div>
            <div className="w-[230px] h-[230px] animate-box3 bg-yellow-300"></div>
            <div className="w-[230px] h-[230px] animate-box4 bg-green-300"></div>
            <div className="w-[230px] h-[230px] animate-box5 bg-blue-300"></div> */}
            <div
              className={`w-[210px] h-[210px] ${
                section2Visible
                  ? "animate-box6"
                  : showInitialAnimation
                  ? "animate-box1"
                  : "animate-box6-reverse"
              } bg-slate-300`}
            ></div>
            <div
              className={`w-[210px] h-[210px] ${
                section2Visible
                  ? "animate-box7"
                  : showInitialAnimation
                  ? "animate-box2"
                  : "animate-box7-reverse"
              } bg-red-900`}
            ></div>
            <div
              className={`w-[210px] h-[210px] ${
                section2Visible
                  ? "animate-box8"
                  : showInitialAnimation
                  ? "animate-box3"
                  : "animate-box8-reverse"
              } bg-yellow-300`}
            ></div>
            <div
              className={`w-[210px] h-[210px] ${
                section2Visible
                  ? "animate-box9"
                  : showInitialAnimation
                  ? "animate-box4"
                  : "animate-box9-reverse"
              } bg-green-300`}
            ></div>
            <div
              className={`w-[210px] h-[210px] ${
                section2Visible
                  ? "animate-box10"
                  : showInitialAnimation
                  ? "animate-box5"
                  : "animate-box10-reverse"
              } bg-blue-300`}
            ></div>
          </div>
          <div className="text-center animate-text1 text-[#2C2C2C] w-[55%] font-semibold text-[20px] ">
            {" "}
            Relmes lets you create personalized cloud servers — as your own
            realm — where you and your team can connect, collaborate, and play.
          </div>
          <div className=" w-[22%] animate-text2 font-semibold flex justify-between">
            <button className="text-black ">Let's Explore</button>
            <button className="px-6 py-2 bg-black text-white rounded-[20px]">
              Create now
            </button>
          </div>
        </div>
        {/* 2nd section */}
        <div ref={section2Ref} className="w-full h-screen  flex flex-row ">
          <div className="w-[50%] h-full p-4  flex flex-col">
            <div>What is Relmes?</div>
            <div>
              Relmes is a next-generation SaaS platform that lets you create
              personalized servers—we call them realms—where you and your
              friends or team can collaborate, play, and build together.
            </div>
            <div>
              {" "}
              Add plugins (we call them puzzles or extensions) to expand your
              realm’s powers—whether it’s chatting, planning, mind-mapping, or
              managing.
            </div>
            <div className="text-white px-6 py-2 bg-black flex items-center justify-center rounded-[20px]">
              Create Now
            </div>
          </div>
          <div className="w-[50%] h-full flex flex-col  ">
            {/* <div className="w-[300px] h-[600px] animate-box6  bg-gray-900"></div> */}
            {/* <div className="w-[300px] h-[600px] animate-box7  bg-green-600"></div>
            <div className="w-[300px] h-[600px] animate-box8 bg-yellow-900"></div>
            <div className="w-[300px] h-[600px] animate-box9  bg-green-300"></div>
            <div className="w-[300px] h-[600px] animate-box10 bg-blue-700"></div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroSection;
