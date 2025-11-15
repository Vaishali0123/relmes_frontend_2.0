"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Search, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { mockPlugins, type Plugin } from "./data/plugins";

const categories = [
  "All",
  "Analytics",
  "Security",
  "Backup",
  "Performance",
  "Communication",
  "Database",
  "Automation",
  "API",
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [chartTab, setChartTab] = useState<"free" | "grossing" | "paid">(
    "free"
  );
  const carouselRef = useRef<HTMLDivElement>(null);

  const featuredPlugins = mockPlugins.filter((p) => p.featured).slice(0, 3);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const filteredPlugins = useMemo(() => {
    let filtered = mockPlugins.filter((plugin) => {
      const matchesSearch =
        plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || plugin.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by chart type
    if (chartTab === "free") {
      filtered = filtered.filter((p) => p.price === "Free");
      filtered.sort((a, b) => {
        const aDownloads = parseInt(
          a.downloads.replace("K+", "").replace("+", "")
        );
        const bDownloads = parseInt(
          b.downloads.replace("K+", "").replace("+", "")
        );
        return bDownloads - aDownloads;
      });
    } else if (chartTab === "paid") {
      filtered = filtered.filter((p) => p.price === "Paid");
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      // Top grossing - sort by downloads * rating
      filtered.sort((a, b) => {
        const aScore =
          parseInt(a.downloads.replace("K+", "").replace("+", "")) * a.rating;
        const bScore =
          parseInt(b.downloads.replace("K+", "").replace("+", "")) * b.rating;
        return bScore - aScore;
      });
    }

    return filtered;
  }, [searchQuery, selectedCategory, chartTab]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <Star className="h-3.5 w-3.5 text-gray-300 fill-gray-300" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className=" p-2  w-full ">
        {/* Category Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={
                selectedCategory === category
                  ? { backgroundColor: "#FDD78D" }
                  : {}
              }
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Carousel Section */}
        {/* {selectedCategory === "All" && searchQuery === "" && (
          <div className="mb-8 bg-amber-500">
            <div className="relative">
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {featuredPlugins.map((plugin) => (
                  <div
                    key={plugin.id}
                    onClick={() => setSelectedPlugin(plugin)}
                    className="flex-shrink-0 w-[85%] md:w-[70%] lg:w-[60%] bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden"
                  >
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                      Featured
                    </div>
                    <div className="flex items-start gap-4 mt-8">
                      <div className="text-6xl">{plugin.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {plugin.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {plugin.description}
                        </p>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            {renderStars(plugin.rating)}
                            <span className="text-sm font-medium text-gray-700 ml-1">
                              {plugin.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {plugin.developer}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-gray-200 rounded text-gray-700">
                            {plugin.category}
                          </span>
                        </div>
                        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                          Install
                        </button>
                        {plugin.price === "Paid" && (
                          <p className="text-xs text-gray-500 mt-2">
                            In-app purchases
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => scrollCarousel("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        )} */}

        {/* Top Charts Section */}
        <div className="mb-6 bg-[#fcfcfc] p-4 rounded-3xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Top charts
          </h2>

          {/* Chart Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setChartTab("free")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                chartTab === "free"
                  ? "bg-[#171717] text-[#FDD78D]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Top free
            </button>
            <button
              onClick={() => setChartTab("grossing")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                chartTab === "grossing"
                  ? "bg-[#171717] text-[#FDD78D]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Top grossing
            </button>
            <button
              onClick={() => setChartTab("paid")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                chartTab === "paid"
                  ? "bg-[#171717] text-[#FDD78D]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Top paid
            </button>
          </div>

          {/* Chart List */}
          <div className="space-y-1">
            {filteredPlugins.slice(0, 9).map((plugin, index) => (
              <Link
                key={plugin.id}
                href={`/marketPlace/plugins/${plugin.id}`}
                className="flex items-center gap-4 p-3 rounded-3xl hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">
                  {plugin.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {plugin.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {plugin.category}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
                  style={{ backgroundColor: "#FDD78D" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#FDD78DCC")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#FDD78D")
                  }
                >
                  add
                </button>
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended Section */}
        {selectedCategory !== "All" && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedCategory} Plugins
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPlugins.map((plugin) => (
                <Link
                  key={plugin.id}
                  href={`/marketPlace/plugins/${plugin.id}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-3xl mb-3 mx-auto">
                    {plugin.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                    {plugin.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {plugin.developer}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(plugin.rating)}
                    <span className="text-xs text-gray-600">
                      {plugin.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                      {plugin.price}
                    </span>
                    {plugin.trending && (
                      <span className="text-xs text-orange-600 font-medium">
                        Trending
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {filteredPlugins.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No plugins found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
