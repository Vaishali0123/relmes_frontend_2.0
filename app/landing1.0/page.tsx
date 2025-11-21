"use client";
import React from "react";
import HeroSection from "./components/HeroSection";
import ThirdSection from "./components/ThirdSection";
import TrustedByUs from "./components/TrustedByUs";
import Requirement from "./components/Requirement";
import Pricings from "./components/Pricings";
import Footer from "./components/Footer";

const page = () => {
  return (
    <>
      <HeroSection />
      <ThirdSection />
      <TrustedByUs />
      {/* <Requirement /> */}
      {/* <Pricings /> */}
      <Footer />
    </>
  );
};
export default page;
