"use client";
import React, { useEffect, useRef, useState } from "react";
import Bg from "@/public/bg.png";
import Image from "next/image";
import im1 from "@/public/im1.png";
import im2 from "@/public/im2.png";
import im3 from "@/public/im3.png";
import im4 from "@/public/im4.png";
import im5 from "@/public/im5.png";
import Link from "next/link";
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
      <>
        {/* 1st section */}
        <div
          style={{
            backgroundImage: `url(${Bg.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="w-full h-screen pt-24 sm:pt-28 pb-[10vh] flex flex-col items-center justify-between"
        >
          <div className="text-[40px] font-bold font-space-grotesk text-[#3F3F3F] ">
            Piece together your perfect Relm
          </div>
          {/* Image can overlap each other */}
          <div className="flex  flex-row  relative ">
            <div
              className={`w-[210px] relative h-[210px] ${
                section2Visible
                  ? "animate-box6"
                  : showInitialAnimation
                  ? "animate-box1"
                  : "animate-box6-reverse"
              }  `}
            >
              <div className="w-[90%] h-[90%] rounded-lg bg-pink-200 overflow-hidden">
                <Image src={im1} alt="bg" className="w-full h-full " />
              </div>
              <div className="w-[90%] h-[90%] rounded-lg absolute bottom-0 overflow-hidden  right-0 bg-pink-200">
                <Image src={im1} alt="bg" fill className="w-full h-full " />
              </div>
            </div>
            <div
              className={`w-[210px] h-[210px] ${
                section2Visible
                  ? "animate-box7"
                  : showInitialAnimation
                  ? "animate-box2"
                  : "animate-box7-reverse"
              } `}
            >
              <div className="w-[90%] h-[90%] rounded-lg overflow-hidden bg-red-200">
                <Image src={im2} alt="bg" className="w-full h-full " />
              </div>
              <div className="w-[90%] h-[90%] rounded-lg absolute bottom-0 overflow-hidden right-0 bg-red-200">
                <Image src={im2} alt="bg" fill className="w-full h-full " />
              </div>
            </div>
            <div
              className={`w-[210px] h-[210px] ${
                section2Visible
                  ? "animate-box8"
                  : showInitialAnimation
                  ? "animate-box3"
                  : "animate-box8-reverse"
              } `}
            >
              <div className="w-[90%] h-[90%] rounded-lg overflow-hidden bg-yellow-200">
                <Image src={im3} alt="bg" className="w-full h-full " />
              </div>
              <div className="w-[90%] h-[90%] rounded-lg absolute bottom-0 overflow-hidden right-0 bg-yellow-200">
                <Image src={im3} alt="bg" fill className="w-full h-full " />
              </div>
            </div>
            <div
              className={`w-[210px] h-[210px] ${
                section2Visible
                  ? "animate-box9"
                  : showInitialAnimation
                  ? "animate-box4"
                  : "animate-box9-reverse"
              } `}
            >
              <div className="w-[90%] h-[90%] rounded-lg overflow-hidden bg-green-200">
                <Image src={im4} alt="bg" className="w-full h-full " />
              </div>
              <div className="w-[90%] h-[90%] rounded-lg absolute bottom-0 overflow-hidden right-0 bg-green-200">
                <Image src={im4} alt="bg" fill className="w-full h-full " />
              </div>
            </div>
            <div
              className={`w-[210px] h-[210px] ${
                section2Visible
                  ? "animate-box10"
                  : showInitialAnimation
                  ? "animate-box5"
                  : "animate-box10-reverse"
              } `}
            >
              <div className="w-[90%] h-[90%] rounded-lg overflow-hidden bg-blue-200">
                <Image src={im5} alt="bg" className="w-full h-full " />
              </div>
              <div className="w-[90%] h-[90%] rounded-lg absolute bottom-0 overflow-hidden right-0 bg-blue-200">
                <Image src={im5} alt="bg" fill className="w-full h-full " />
              </div>
            </div>
          </div>
          <div className="text-center animate-text1 font-space-grotesk text-[#2C2C2C] w-[55%] font-semibold text-[20px] ">
            {" "}
            Relmes creates your own Cloud Core: a customizable Relm where your
            team can connect, collaborate, and create freely.
          </div>
          <div className=" w-[22%] animate-text2 font-semibold flex flex-row-reverse justify-between">
            <button className="text-black ">Let's Explore</button>
            <Link
              href="/auth"
              className="px-6 py-2 bg-[#F9D199] rounded-[20px]"
            >
              Create Your Relm
            </Link>
          </div>
        </div>
        {/* 2nd section */}
        <div
          ref={section2Ref}
          className="w-full h-screen overflow-hidden flex flex-row "
        >
          <div className="w-[50%] h-full p-20  flex flex-col">
            <div className="w-[90%] space-y-9">
              <div className="text-[40px] font-bold font-space-grotesk text-[#3F3F3F] ">
                What is Relmes?
              </div>
              <div className="space-y-4 w-[70%]">
                <div className="text-[16px] text-[#3F3F3F] ">
                  Relmes is a next-generation platform for creating private
                  cloud & personalized space, called Relm - dedicated
                  environments where teams and friends collaborate, build, and
                  play.
                </div>
                <div>
                  Power up your Relm with chatting, planning, mind-mapping,
                  management, and more.
                </div>
              </div>

              <div className="text-white px-6 py-2 font-space-grotesk font-bold h-fit w-fit bg-black flex items-center justify-center rounded-[20px]">
                Want to know more ?
              </div>
            </div>
          </div>
          <div className="w-[50%] h-full flex flex-col  "></div>
        </div>
      </>
    </>
  );
}

export default HeroSection;
