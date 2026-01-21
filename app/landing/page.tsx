"use client";
import React from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ThirdSection from "./components/ThirdSection";
import TrustedByUs from "./components/TrustedByUs";
import Requirement from "./components/Requirement";
import Pricings from "./components/Pricings";
import Footer from "./components/Footer";
import Howitworks from "./components/Howitworks";
import Plugins from "./components/Plugins";
import Features from "./components/Features";

const page = () => {
  return (
    <div className="w-full space-y-10">
      <Header />
      <HeroSection />
      <ThirdSection />
      <TrustedByUs />
      <Features />
      <Howitworks />
      <Requirement />
      <Plugins />
      <Pricings />
      <Footer />
    </div>
  );
};
export default page;
