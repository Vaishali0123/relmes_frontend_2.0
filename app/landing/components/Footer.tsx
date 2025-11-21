"use client";
import React, { useRef, useEffect, useState } from "react";
import Oneimage from "@/public/footerrelm.png";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  const firstSectionRef = useRef<HTMLDivElement>(null);
  const secondSectionRef = useRef<HTMLDivElement>(null);
  const [isFirstSectionVisible, setIsFirstSectionVisible] = useState(false);
  const [isSecondSectionVisible, setIsSecondSectionVisible] = useState(false);

  useEffect(() => {
    const firstObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsFirstSectionVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px",
      }
    );

    const secondObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsSecondSectionVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px",
      }
    );

    if (firstSectionRef.current) {
      firstObserver.observe(firstSectionRef.current);
    }

    if (secondSectionRef.current) {
      secondObserver.observe(secondSectionRef.current);
    }

    return () => {
      if (firstSectionRef.current) {
        firstObserver.unobserve(firstSectionRef.current);
      }
      if (secondSectionRef.current) {
        secondObserver.unobserve(secondSectionRef.current);
      }
    };
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes footer-container {
          0% {
            top: 36%;
            scale: 0.9;
          }
          100% {
            top: 0%;
            scale: 1;
          }
        }
        .footer-container {
          position: relative;
          z-index: 10;
        }
        .footer-container.animate {
          animation: footer-container 2s ease-in-out forwards;
        }
        @keyframes footer-container-reverse {
          0% {
            top: 0%;
            scale: 0.9;
          }
          100% {
            top: 0%;
            scale: 1;
          }
        }
        .footer-container-reverse {
          position: relative;
          z-index: 10;
        }
        .footer-container-reverse.animate {
          animation: footer-container-reverse 2s ease-in-out forwards;
        }
      `}</style>

      {/* First Section */}
      {/* <div
        ref={firstSectionRef}
        className="w-full h-[40vh] sm:h-[45vh] md:h-[50vh] p-4 sm:p-6 md:p-10 relative z-30"
      >
        <div
          className={`w-full h-full rounded-[16px] sm:rounded-[20px] md:rounded-[24px] flex relative items-center footer-container justify-center bg-[#FBDFB7] ${
            isFirstSectionVisible ? "animate" : ""
          }`}
        >
          <div className="w-full h-full  text-black  flex items-center justify-center">
            <div className=" flex-col flex items-center justify-center">
            <div className="font-bold text-[40px] text-[#4A4A4A] font-space-grotesk">Every idea deserves a space.</div>
            <div className="text-[18px] font-light">Every group deserves a realm.</div>
            <div className="text-[18px] font-light">Build your first one today.</div>
            </div>
            <div></div>
          </div>
          <div className="w-[120px] sm:w-[160px] md:w-[200px] h-[30px] sm:h-[40px] md:h-[50px] bg-[#FBDFB7] absolute -bottom-[30px] sm:-bottom-[40px] md:-bottom-[50px] rounded-b-[16px] sm:rounded-b-[20px] md:rounded-b-[24px]"></div>
        </div>
      </div> */}

      {/* Second Section */}
      <div
        ref={secondSectionRef}
        className="w-full h-auto md:h-[50vh] relative z-20 p-4 sm:p-6 md:p-10"
      >
        <div
          className={`w-full h-full min-h-[500px] md:min-h-0 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] flex relative items-center justify-center overflow-hidden footer-container-reverse bg-[#F6F6F6] ${
            isSecondSectionVisible ? "animate" : ""
          }`}
        >
          {/* Logo Header */}
          <div className="w-[120px] sm:w-[160px] md:w-[200px] bg-white h-[30px] sm:h-[40px] md:h-[50px] absolute top-0 font-space-grotesk text-[20px] sm:text-[28px] md:text-[34px] font-bold text-center flex items-center justify-center rounded-b-[16px] sm:rounded-b-[20px] md:rounded-b-[24px]">
            Relmes
          </div>

          <div className="w-full h-full">
            {/* Main Content */}
            <div className="flex flex-col md:flex-row font-space-grotesk min-h-[calc(100%-60px)] md:h-[calc(100%-80px)] justify-center w-full pt-12 sm:pt-14 md:pt-0">
              {/* Links Container - 3 Columns */}
              <div className="w-full md:w-[40%] flex flex-col sm:flex-row justify-evenly gap-6 sm:gap-4 h-auto md:h-full p-4 sm:p-6  md:p-4">
                {/* 1st Column */}
                <div className="w-full sm:w-[30%] gap-2 sm:gap-3 flex flex-col items-center sm:items-start md:items-center justify-start md:justify-center">
                  <div className="text-black text-[16px] sm:text-[17px] md:text-[18px] font-bold">
                    Company
                  </div>
                  <div className="text-black text-[14px] sm:text-[15px] md:text-[16px]">
                    About Relmes
                  </div>
                  <div className="text-black text-[14px] sm:text-[15px] md:text-[16px]">
                    Pricing
                  </div>
                  <div className="text-black text-[14px] sm:text-[15px] md:text-[16px]">
                    Demo
                  </div>
                </div>

                {/* 2nd Column */}
                {/* <div className="w-full sm:w-[30%] gap-2 sm:gap-3 flex flex-col items-center sm:items-start md:items-center justify-start md:justify-center">
                  <div className="text-black text-[16px] sm:text-[17px] md:text-[18px] font-bold">
                    Company
                  </div>
                  <div className="text-black text-[14px] sm:text-[15px] md:text-[16px]">
                    About Rotar AI
                  </div>
                  <div className="text-black text-[14px] sm:text-[15px] md:text-[16px]">
                    Pricing
                  </div>
                  <div className="text-black text-[14px] sm:text-[15px] md:text-[16px]">
                    Demo
                  </div>
                </div> */}

                {/* 3rd Column */}
                <div className="w-full sm:w-[30%] gap-2 sm:gap-3 flex flex-col items-center sm:items-start md:items-center justify-start md:justify-center">
                  <div className="text-black text-[16px] sm:text-[17px] md:text-[18px] font-bold">
                    Legal
                  </div>
                  <div className="text-black text-[14px] sm:text-[15px] md:text-[16px]">
                  Terms of Use                  </div>
                  <Link href="/privacy" className="text-black text-[14px] sm:text-[15px] md:text-[16px]">
                  Privacy Policy
                  </Link>
                  
                </div>
              </div>

              {/* Spacer - hidden on mobile */}
              <div className="hidden md:block w-[120px] lg:w-[200px] h-full pt-[50px]"></div>

              {/* Description Section */}
              <div className="w-full md:w-[40%] h-auto md:h-full p-4 sm:p-6 md:p-4 flex gap-4 justify-center md:justify-start items-start md:items-center">
                <div className="w-full md:w-[80%] text-[14px] sm:text-[15px] md:text-[16px] text-center md:text-left">
                Relmes lets you build your own relm — a secure space to collaborate, create, and expand with powerful modular tools.
                </div>
              </div>
            </div>

            {/* Bottom Border */}
            <div className="h-[60px] md:h-[80px] w-full p-4 sm:p-6 md:p-4">
              <div className="w-full h-full border-t border-gray-300 flex flex-row"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
