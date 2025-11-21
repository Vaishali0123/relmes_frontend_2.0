"use client";
import React, { useRef, useEffect, useState } from "react";

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
        threshold: 0.1, // Trigger when 10% of the element is visible
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
        threshold: 0.1, // Trigger when 10% of the element is visible
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
      <div ref={firstSectionRef} className="w-full h-[50vh] p-10 relative z-30">
        {/* 1st section */}
        <div
          className={`w-full h-full rounded-[24px] flex relative items-center footer-container justify-center bg-[#F9D199] ${
            isFirstSectionVisible ? "animate" : ""
          }`}
        >
          <div className="w-[200px] h-[50px] bg-[#F9D199] absolute -bottom-[50px] rounded-b-[24px]"></div>
        </div>
      </div>
      {/* 2nd section */}

      <div
        ref={secondSectionRef}
        className="w-full h-[50vh] relative z-20 p-10"
      >
        <div
          className={`w-full h-full rounded-[24px] flex relative items-center justify-center overflow-hidden footer-container-reverse bg-[#F6F6F6] ${
            isSecondSectionVisible ? "animate" : ""
          }`}
        >
          <div className="w-[200px] bg-white  h-[50px]  absolute top-0 font-space-grotesk text-[34px] font-bold text-center rounded-b-[24px]">
            Relmes
          </div>
          <div className="w-full h-full ">
            <div className="flex font-space-grotesk h-[calc(100%-80px)]  justify-center w-full">
              <div className="w-[40%] flex flex-row   justify-evenly   h-full p-4">
                {/* 1st Section */}
                <div className="w-[30%]  gap-2 flex flex-col items-center justify-start pt-8">
                  <div className="text-black text-[18px] font-bold">
                    Company
                  </div>
                  <div className="text-black">About Rotar AI</div>
                  {/* <div className="text-black">Pricing</div> */}
                  <div className="text-black">Demo</div>
                </div>
                {/* 2nd Section */}
                {/* <div className="w-[30%]   gap-2 flex flex-col items-center justify-center">
                  <div className="text-black text-[18px] font-bold">
                    Company
                  </div>
                  <div className="text-black">About Us</div>
                  <div className="text-black">Pricing</div>
                  <div className="text-black">Demo</div>
                </div> */}
                {/* 3rd Section */}
                <div className="w-[30%]   gap-2 flex flex-col items-center justify-start pt-8">
                  <div className="text-black text-[18px] font-bold">Legal</div>
                  <div className="text-black">Terms of Use</div>
                  <div className="text-black">Pricing</div>
                  <div className="text-black">Privacy Policy</div>
                </div>
              </div>
              <div className="w-[200px] h-full pt-[50px] "></div>
              {/* 4th  Right Section */}
              <div className="w-[40%] h-full p-4 flex  gap-4 ">
                <div className="w-[80%] ">
                  We are at the forefront of AI chatbot development,
                  revolutionizing the way businesses engage with their
                  customers.
                </div>
              </div>
            </div>
            <div className="h-[80px] w-full p-4  ">
              <div className="w-full h-full border-t border-gray-300 flex flex-row"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
