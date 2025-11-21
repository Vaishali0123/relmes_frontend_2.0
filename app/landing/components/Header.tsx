"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const Header = () => {
  const router = useRouter();
  // const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 20);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  const handleGetStarted = () => {
    router.push("/auth");
  };

  return (
    <header
      className={`h-[70px] w-screen transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl sm:text-3xl font-bold font-space-grotesk text-[#2C2C2C] hover:opacity-80 transition-opacity"
          >
            Relmes
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-[#2C2C2C] hover:text-[#3F3F3F] transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="text-[#2C2C2C] hover:text-[#3F3F3F] transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="/privacy"
              className="text-[#2C2C2C] hover:text-[#3F3F3F] transition-colors font-medium"
            >
              Privacy
            </Link>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2.5 bg-[#F9D199] rounded-[20px] font-semibold text-[#2C2C2C] hover:bg-[#F9D199]/90 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Get Started
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#2C2C2C] hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-2 pt-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#2C2C2C] hover:text-[#3F3F3F] transition-colors font-medium py-2"
              >
                Home
              </Link>
              <Link
                href="/#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#2C2C2C] hover:text-[#3F3F3F] transition-colors font-medium py-2"
              >
                Features
              </Link>
              <Link
                href="/privacy"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#2C2C2C] hover:text-[#3F3F3F] transition-colors font-medium py-2"
              >
                Privacy
              </Link>
              <button
                onClick={() => {
                  handleGetStarted();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-6 py-3 bg-[#F9D199] rounded-[20px] font-semibold text-[#2C2C2C] hover:bg-[#F9D199]/90 transition-all duration-200 shadow-sm text-left"
              >
                Get Started
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
