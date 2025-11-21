import Image from "next/image";
import React from "react";
import feature1 from "@/public/feature1.svg";
import feature2 from "@/public/feature2.svg";
import feature3 from "@/public/feature3.svg";
import feature4 from "@/public/feature4.svg";
import feature5 from "@/public/feature5.svg";

const Features = () => {
  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            left: -10%;
            top: -10%;
          }
          100% {
            left: 0%;
            top: 0%;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out forwards;
        }
        @keyframes fadeIn2 {
          0% {
            right: -10%;
            top: -10%;
          }
          100% {
            right: 0%;
            top: 0%;
          }
        }
        .animate-fadeIn2 {
          animation: fadeIn2 1s ease-in-out forwards;
        }

        @keyframes fadeIn3 {
          0% {
            left: -10%;
            bottom: -10%;
          }
          100% {
            left: 0%;
            bottom: 0%;
          }
        }
        .animate-fadeIn3 {
          animation: fadeIn3 1s ease-in-out forwards;
        }
        @keyframes fadeIn4 {
          0% {
            right: -10%;
            bottom: -10%;
          }
          100% {
            right: 0%;
            bottom: 0%;
          }
        }
        .animate-fadeIn4 {
          animation: fadeIn4 1s ease-in-out forwards;
        }
      `}</style>
      <div className="w-full min-h-screen flex flex-col items-center justify-center py-8 sm:py-12 md:py-16">
        {/* Title Section */}
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-space-grotesk font-bold text-center px-4 sm:px-6 md:px-8 mb-6 sm:mb-8 md:mb-0">
          Explore, Choose, Add to Extend
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          Your Imagination Capabilities
        </div>

        {/* Grid Container */}
        <div className="h-auto md:h-[80vh] w-full p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Top Row */}
          <div className="h-[250px] sm:h-[300px] md:h-[50%] w-full flex flex-col sm:flex-row gap-2 sm:gap-0 mb-2 sm:mb-0">
            {/* Top Left */}
            <div className="w-full sm:w-[40%] flex flex-col items-center justify-center h-full relative rounded-tl-[30px] sm:rounded-tl-[40px] md:rounded-tl-[50px] rounded-tr-[30px] sm:rounded-tr-none animate-fadeIn border-t border-l border-r border-[#EFEFEF] bg-[#fcfcfc]">
<Image src={feature1} alt="feature1"  className="w-full h-[50%] object-contain"/>
{/* text container */}
<div className="h-[50%] w-full flex flex-col justify-center p-4">
<div className="text-[#343434] text-[18px] font-bold font-space-grotesk">Plug and play System</div>
<div className="text-[#343434] text-[14px] font-medium">Explore, choose, and add Modules to extend your Realm’s capabilities.
Build a realm that fits your workflow or your fun.</div>
</div>
            </div>

            {/* Top Right */}
            <div className="w-full sm:w-[60%] h-full relative rounded-bl-[30px] sm:rounded-bl-none rounded-br-[30px] sm:rounded-br-none sm:rounded-tr-[40px] md:rounded-tr-[50px] animate-fadeIn2 border-b-2 sm:border-b-0 border-t border-r border-l sm:border-l-0 border-[#EFEFEF] bg-[#fcfcfc]">
            <Image src={feature2} alt="feature2"  className="w-full h-[50%] object-contain"/>
{/* text container */}
<div className="h-[50%] w-full flex flex-col justify-center p-4">
<div className="text-[#343434] text-[18px] font-bold font-space-grotesk">Easily accessible</div>
<div className="text-[#343434] text-[14px] font-medium">Zero heavy lifting for your device.
Your Realme lives in the cloud — so your imagination isn’t limited by your device. No High-End Device Needed</div>
</div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="h-[250px] sm:h-[300px] md:h-[50%] w-full flex flex-col sm:flex-row gap-2 sm:gap-0">
            {/* Bottom Left */}
            <div className="w-full sm:w-[30%] h-full relative rounded-tl-[30px] sm:rounded-tl-none rounded-tr-[30px] sm:rounded-tr-none sm:rounded-bl-[40px] md:rounded-bl-[50px] animate-fadeIn3 border-t  border-b border-l  border-[#EFEFEF] bg-[#fcfcfc]">
            <Image src={feature3} alt="feature3"  className="w-full h-[50%] object-contain mt-2"/>
{/* text container */}
<div className="h-[50%] w-full flex flex-col justify-center p-4">
<div className="text-[#343434] text-[18px] font-bold font-space-grotesk">Data control in your hand</div>
<div className="text-[#343434] text-[14px] font-medium">Your data, your control. Every Relm is isolated, encrypted, and  customizable.</div>
</div>
            </div>
             {/* Bottom Center */}
            <div className="w-full sm:w-[40%] h-full relative flex flex-col items-center justify-center animate-fadeIn3 border  border-[#EFEFEF] bg-[#fcfcfc]">
            <Image src={feature4} alt="feature4"  className="w-[50%] h-[50%] object-cover my-2 "/>
{/* text container */}
<div className="h-[50%] w-full flex flex-col justify-center px-4">
<div className="text-[#343434] text-[18px] font-bold font-space-grotesk">10+ plugins to chose from</div>
<div className="text-[#343434] text-[14px] font-medium">Chat, plan, brainstorm, map ideas, manage projects — everything stays in sync, all in one place.</div>
</div>
            </div>
            {/* Bottom Right */}
            <div className="w-full sm:w-[30%] h-full relative rounded-bl-[30px] sm:rounded-bl-none rounded-br-[30px] sm:rounded-br-[40px] md:rounded-br-[50px] rounded-tl-[30px] sm:rounded-tl-none animate-fadeIn4 border-t border-b border-r  border-[#EFEFEF] bg-[#fcfcfc]">
            <Image src={feature5} alt="feature5"  className="w-full h-[50%] object-contain py-2"/>
{/* text container */}
<div className="h-[50%] w-full flex flex-col justify-center p-4">
<div className="text-[#343434] text-[18px] font-bold font-space-grotesk">Developer Friendly</div>
<div className="text-[#343434] text-[14px] font-medium">Create and publish your own puzzles with step-by-step documentation for building, uploading, and deploying modules across Relmes.</div>
</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
