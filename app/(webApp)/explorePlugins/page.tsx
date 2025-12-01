"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import axios from "axios";
import { API, errorHandler } from "@/app/utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "@/app/redux/slices/paramsSlice";
import { RootState } from "@/app/redux/store";

// const categories = [
//   "All",
//   "Analytics",
//   "Security",
//   "Backup",
//   "Performance",
//   "Communication",
//   "Database",
//   "Automation",
//   "API",
// ];

type ApiPlugin = {
  _id?: string;
  pluginName?: string;
  description?: string;
  pluginType?: string;
  tags?: string[];
  membership?: { planName?: string; price?: number }[];
  icon?: string;
  slug?: string;
  generatedpluginId?: string;
};

type MarketplacePlugin = {
  id: string;
  name: string;
  description: string;
  category: string;
  priceLabel: "Free" | "Paid";
  priceValue: number;
  downloads: number;
  rating: number;
  icon?: string;
  slug?: string;
};

export default function MarketplacePage() {
  const dispatch=useDispatch()
  const searchQuery = useSelector(
    (state: RootState) => state.params.searchQuery
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [chartTab, setChartTab] = useState<"free" | "grossing" | "paid">(
    "free"
  );
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [plugins, setPlugins] = useState<MarketplacePlugin[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const endpoint = API ? `${API}/getAllPlugins` : "/api/getAllPlugins";

    const fetchPlugins = async () => {
      try {
        setLoading(true);
        const res = await axios.get(endpoint);
        const apiData: ApiPlugin[] =
          res.data?.data || res.data?.plugins || res.data || [];

        const normalized: MarketplacePlugin[] = apiData.map((plugin, index) => {
          const id =
            plugin._id ||
            plugin.generatedpluginId ||
            `plugin-${index.toString()}`;
          const name = plugin.pluginName?.trim() || "Untitled Plugin";
          const description =
            plugin.description?.trim() || "No additional information provided.";
          const category = plugin.pluginType?.trim() || "General";
          const priceValue = Number(plugin.membership?.[0]?.price ?? 0);
          const priceLabel = priceValue > 0 ? "Paid" : "Free";
          const downloads = 10 * (index + 1);
          const rating = 4 + (index % 10) * 0.05;

          return {
            id,
            name,
            description,
            category,
            priceLabel,
            priceValue,
            downloads,
            rating: Math.min(rating, 5),
            icon: plugin.icon,
            slug: plugin.slug,
          };
        });

        setPlugins(normalized);
        const uniqueCategories = [
          "All",
          ...Array.from(
            new Set(normalized.map((plugin) => plugin.category).filter(Boolean))
          ),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlugins();
  }, []);

  const filteredPlugins = useMemo(() => {
    let filtered = plugins.filter((plugin) => {
      const matchesSearch =
        plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || plugin.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // if (chartTab === "free") {
    //   filtered = filtered.filter((p) => p.priceLabel === "Free");
    //   filtered.sort((a, b) => b.downloads - a.downloads);
    // } else if (chartTab === "paid") {
    //   filtered = filtered.filter((p) => p.priceLabel === "Paid");
    //   filtered.sort((a, b) => b.rating - a.rating);
    // } else {
    //   filtered.sort((a, b) => b.downloads * b.rating - a.downloads * a.rating);
    // }

    return filtered;
  }, [searchQuery, selectedCategory, chartTab, plugins]);

  // const renderStars = (rating: number) => {
  //   const fullStars = Math.floor(rating);
  //   const hasHalfStar = rating % 1 >= 0.5;
  //   const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  //   return (
  //     <div className="flex items-center gap-0.5">
  //       {[...Array(fullStars)].map((_, i) => (
  //         <Star
  //           key={i}
  //           className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
  //         />
  //       ))}
  //       {hasHalfStar && (
  //         <Star className="h-3.5 w-3.5 text-gray-300 fill-gray-300" />
  //       )}
  //       {[...Array(emptyStars)].map((_, i) => (
  //         <Star key={i} className="h-3.5 w-3.5 text-gray-300" />
  //       ))}
  //     </div>
  //   );
  // };

  return (
    <>
      <div className=" p-2  w-full  ">
        {/* <div className="mb-5 flex flex-col gap-4 rounded-3xl bg-[#fcfcfc] p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Explore Plugins
            </h1>
            <p className="text-sm text-gray-500">
              Browse plugins submitted by the Relmes community.
            </p>
          </div>
          <div className="flex max-w-md flex-1 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              value={searchQuery}
              // onChange={(event) => setSearchQuery(event.target.value)}
              onChange={(event)=>{
                dispatch(setSearchQuery(event.target.value))
              }}
              placeholder="Search by name or description"
              className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div> */}

        {/* Category Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "text-black"
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
        <div className="mb-6 rounded-3xl bg-[#fcfcfc] p-4">
          {/* <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Top charts
          </h2> */}

          {/* Chart Tabs */}
          {/* <div className="flex gap-2 mb-4">
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
              Top Rated
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
          </div> */}

          {/* Chart List */}
          <div className="space-y-1 ">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="h-16 rounded-3xl bg-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredPlugins.length > 0 ? (
              filteredPlugins.slice(0, 9).map((plugin) => (
                <Link
                  key={plugin.id}
                  href={`/explorePlugins/plugins/${plugin.slug || plugin.id}`}
                  className="flex items-center gap-4 rounded-3xl p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-lg font-semibold text-gray-600">
                    {/* {plugin.icon ? (
                      <span className="truncate">
                        {plugin.icon.slice(0, 2)}
                      </span>
                    ) : (
                      plugin.name.charAt(0)
                    )} */}
                     {plugin.icon ? (
                     <img
                     src={plugin.icon}
                   alt="icon"
className="h-fulll w-full object-contain"
                     />
                    ) : (
                      plugin.name.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-gray-900">
                      {plugin.name}
                    </h3>
                    <p className="truncate text-sm text-gray-500">
                      {plugin.category}
                    </p>
                  </div>

                  {/* <span className="whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold text-gray-900">
                    {plugin.priceLabel}
                  </span> */}
                </Link>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500">No plugins available right now</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Section */}
        {selectedCategory !== "All" && filteredPlugins.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl  font-semibold text-gray-900 mb-4">
              {selectedCategory} Plugins
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPlugins.map((plugin) => (
                <Link
                  key={plugin.id}
                  href={`/explorePlugins/plugins/${plugin.slug || plugin.id}`}
                  className=" border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-3 mx-auto">
                    {/* {plugin.icon ? (
                      <span>{plugin.icon.slice(0, 2)}</span>
                    ) : (
                      plugin.name.charAt(0)
                    )} */}
                    {plugin.icon ? 
              (
                <img
                src={plugin.icon}
                alt={plugin.name}
                className="w-16 h-16 rounded-xl"
                />
              ):(
                <span>{plugin.name.charAt(0)}</span>
              )
                     }
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                    {plugin.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {plugin.description}
                  </p>
                  {/* <div className="flex items-center gap-1 mb-2">
                    {renderStars(plugin.rating)}
                    <span className="text-xs text-gray-600">
                      {plugin.rating}
                    </span>
                  </div> */}
                  {/* <div className="flex items-center justify-between">
                    <span className="text-xs rounded px-2 py-0.5 text-gray-700">
                      {plugin.priceLabel}
                    </span>
                    {plugin.priceLabel === "Paid" && (
                      <span className="text-xs font-medium text-orange-600">
                        ${plugin.priceValue.toFixed(0)}
                      </span>
                    )}
                  </div> */}
                </Link>
              ))}
            </div>
          </div>
        )}

        {!loading && filteredPlugins.length === 0 && (
          <div className="py-12 text-center">
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
