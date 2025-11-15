"use client";

import { useState } from "react";
import { Search, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { IoCreateOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import MarketPlace from "../components/MarketPlace";

export default function MarketPlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full h-full  ">
      {/* Header */}
      <div
        className={`flex h-[80px]  ${
          path.startsWith("/marketPlace/plugins") ? "hidden" : ""
        }   p-2 justify-between items-center px-2 `}
      >
        <div className="flex h-full  w-full p-2  bg-white border rounded-2xl  border-[#f5f5f5] justify-between items-center px-2 ">
          <div className=" pl-2">
            <h1 className="text-[16px] font-semibold font-space-grotesk text-gray-900 mb-0.5">
              Plugin Marketplace
            </h1>
            <p className="text-gray-600 text-[12px]">
              Discover powerful plugins to enhance your server
            </p>
          </div>

          <div className=" flex items-center gap-2">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-2xl border-[#f5f5f5] bg-[#f5f5f5] focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="w-[45px] h-[45px] bg-[#f5f5f5] flex items-center border border-[#f5f5f5] rounded-2xl justify-center">
              <IoCreateOutline className="text-[20px] " />
            </div>
          </div>
        </div>
      </div>
      <div className="flex p-2 h-[calc(100%-100px)] bg-white rounded-3xl ">
        {children}

        <div className="w-80  bg-[#fcfcfc] h-full relative flex flex-col items-center rounded-3xl  p-2 pl-4">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-2">server</div>
            <div className="w-full h-[50px] bg-[#f5f5f5] rounded-2xl"></div>
          </div>
          <div className="w-full">
            <div className="flex items-center gap-2 mt-4 mb-2">
              Selected Plugins
            </div>
            <div className="w-full py-2 bg-[#f5f5f5] rounded-2xl"></div>
          </div>
          <div className="absolute bottom-2 w-[92%] border-t border-[#f5f5f5] pt-2 ">
            <div className="w-full flex items-center mb-4 justify-between">
              <div className="flex items-center gap-2 ">Total Amount</div>
              <div>$100</div>
            </div>
            <div className="w-full h-[40px] bg-[#181818] text-white rounded-2xl flex items-center justify-center">
              pay now
            </div>
          </div>
        </div>
      </div>
      {/* <MarketPlace /> */}
    </div>
  );
}
