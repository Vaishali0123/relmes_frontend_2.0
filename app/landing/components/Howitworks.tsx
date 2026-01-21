"use client"
import React, { useState, useEffect } from "react";

const Howitworks = () => {
  const [clickedStep, setClickedStep] = useState(0)
  const steps = [

    {
      title: "Log in & create your account",
      description: "Create a new realm with your own name and description."
    },
    {
      title: "Create Realm",
      description: "Create a new realm with your own name and description."
    },
    {
      title: "Buy server",
      description: "Create a new realm with your own name and description."
    },
    {
      title: "Add on some extensions",
      description: "Create a new realm with your own name and description."
    },
  ]

  // Auto-rotate steps every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setClickedStep((prev) => (prev + 1) % steps.length);
    }, 5000); // Change step every 5 seconds

    return () => clearInterval(interval);
  }, [steps.length]);
  return (
    <>
      <style jsx>{`
        @keyframes box {
          0% {
            top: -40%;
            left:2%
          }
          100% {
            left:2%
            top: 0%;
          }
        }
        .animate-box {
          position: relative;
          animation: box 2s ease-in-out infinite;
        }
      `}</style>
      <div className="h-[80vh] w-full relative flex items-center justify-center">
        <svg
          className="w-full h-full"
          viewBox="0 0 1376 1015"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M458 924C458 974.258 417.258 1015 367 1015H91C40.7421 1015 0 974.258 0 924V708.155V91.0001C0 40.7422 40.7421 0 91 0H679.442H1285C1335.26 0 1376 40.7421 1376 91V598C1376 648.258 1335.26 689 1285 689H549C498.742 689 458 729.742 458 780V924Z"
            fill="#F6F6F6"
          />
        </svg>
        <div className="w-full h-full  absolute space-y-4 z-10 flex justify-center">
          <div className="w-[20%] h-[100%]  rounded-l-3xl p-8">
            {
              steps?.map((d, i) => (
                <div key={i} onClick={() => setClickedStep(i)} className={`p-4  cursor-pointer duration-500 transition-all ease-in w-full ${clickedStep === i ? "bg-[#F9D199]" : ""} rounded-[20px]`}>
                  <div className="text-xl font-bold font-space-grotesk">
                    {d?.title}
                  </div>
                  <div className="text-sm font-space-grotesk">
                    Create a new realm with your own name and description.
                  </div>
                </div>
              ))
            }
            {/* <div className="p-4  w-full bg-[#F9D199] rounded-[20px]">
              <div className="text-xl font-bold font-space-grotesk">
                Create Realm
              </div>
              <div className="text-sm font-space-grotesk">
                Create a new realm with your own name and description.
              </div>
            </div>
            <div className="p-4 w-full  rounded-[20px]">
              <div className="text-xl font-bold font-space-grotesk">
                Create Realm
              </div>
              <div className="text-sm font-space-grotesk">
                Create a new realm with your own name and description.
              </div>
            </div>
            <div className="p-4 w-full rounded-[20px]">
              <div className="text-xl font-bold font-space-grotesk">
                Create Realm
              </div>
              <div className="text-sm font-space-grotesk">
                Create a new realm with your own name and description.
              </div>
            </div>
            <div className="p-4  w-full rounded-[20px]">
              <div className="text-xl font-bold font-space-grotesk">
                Create Realm
              </div>
              <div className="text-sm font-space-grotesk">
                Create a new realm with your own name and description.
              </div>
            </div> */}
          </div>
          <div className="w-[40%] h-[70%] rounded-r-3xl p-8 ">
            <div className="h-[95%] w-full bg-[#000] border-[#1B1C1E] rounded-[40px] overflow-hidden">
              {/* Add video here */}
              <video
                ref={(el) => {
                  if (el) {
                    el.load(); // Force reload on source change
                    el.play().catch(e => console.log("Autoplay prevented:", e));
                  }
                }}
                key={clickedStep}
                onEnded={() => {
                  setClickedStep((prev) => (prev + 1) % steps.length);
                }}
                autoPlay
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover rounded-[40px]"
              >
                <source src={clickedStep === 0 ? "/vedo1.mp4" : clickedStep === 1 ? "/vedo2.mp4" : clickedStep === 2 ? "/vedo3.mp4" : clickedStep === 3 ? "/vedo4.mp4" : ""} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[80vh]  w-full relative flex items-center justify-center">
        <svg
          className="w-full h-full "
          viewBox="0 0 1376 992"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M425.3 77.9999C425.3 34.9217 460.221 0 503.3 0H1298C1341.08 0 1376 34.9218 1376 78V299.892V914C1376 957.078 1341.08 992 1298 992H696.558H77.9999C34.9217 992 0 957.078 0 914V502.166C0 459.087 34.9218 424.166 78 424.166H347.3C390.378 424.166 425.3 389.244 425.3 346.166V77.9999Z"
            fill="#F7F7F7"
          />
        </svg>
        <div className="w-full h-full absolute flex justify-center items-end">
          <div className="w-[19%] h-[100%]   p-8 space-y-10">
            <div className="p-4 w-full h-[40%] bg-[#F9D199] rounded-[20px]"></div>
            <div className="p-4 w-full h-[55%] bg-[#F9D199] rounded-[20px]"></div>
          </div>
          <div className="w-[41%] h-[100%] p-4">
            <div className="h-full w-full bg-[#fff] flex items-end rounded-[40px]">
              <svg
                className="w-full pt-24 h-full"
                viewBox="0 0 881 791"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 93C0 41.6375 41.6375 0 93 0H391.541C418.58 0 440.5 21.9197 440.5 48.9591C440.5 75.9984 462.42 97.9181 489.459 97.9181H788C839.362 97.9181 881 139.556 881 190.918V698C881 749.363 839.362 791 788 791H93C41.6375 791 0 749.362 0 698V93Z"
                  fill="#090909"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Howitworks;
