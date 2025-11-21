"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Server,
  ChevronDown,
} from "lucide-react";
import { IoCreateOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";
import MarketPlace from "../components/MarketPlace";

interface SelectedPlugin {
  id: string;
  name: string;
  icon: string;
  price: number;
  plan: "basic" | "pro" | "enterprise";
}

export default function MarketPlaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServer, setSelectedServer] = useState<string>("");
  const [selectedPlugins, setSelectedPlugins] = useState<SelectedPlugin[]>([
    // Sample data for testing - remove in production
    {
      id: "1",
      name: "Advanced Analytics",
      icon: "📊",
      price: 29.99,
      plan: "pro",
    },
    {
      id: "2",
      name: "Security Shield",
      icon: "🛡️",
      price: 39.99,
      plan: "pro",
    },
  ]);
  const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock servers data
  const mockServers = [
    { id: "1", name: "Production Server", status: "active" },
    { id: "2", name: "Development Server", status: "active" },
    { id: "3", name: "Staging Server", status: "active" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsServerDropdownOpen(false);
      }
    };

    if (isServerDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isServerDropdownOpen]);

  const totalAmount = selectedPlugins.reduce(
    (sum, plugin) => sum + plugin.price,
    0
  );

  const removePlugin = (pluginId: string) => {
    setSelectedPlugins((prev) => prev.filter((p) => p.id !== pluginId));
  };

  const handlePayNow = () => {
    if (selectedPlugins.length === 0) {
      alert("Please select at least one plugin");
      return;
    }
    if (!selectedServer) {
      alert("Please select a server");
      return;
    }
    // Handle payment logic here
    console.log("Processing payment:", {
      selectedServer,
      selectedPlugins,
      totalAmount,
    });
    alert(
      `Processing payment of $${totalAmount.toFixed(2)} for ${
        selectedPlugins.length
      } plugin(s)`
    );
  };

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

        {/* Billing Section */}
        <div className="w-80 bg-[#fcfcfc] h-full relative flex flex-col rounded-3xl p-4 overflow-hidden">
          {/* Server Selection */}
          <div className="w-full mb-4">
            <label className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Server className="h-4 w-4" />
              Select Server
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsServerDropdownOpen(!isServerDropdownOpen)}
                className="w-full h-[50px] bg-white border border-[#f5f5f5] rounded-2xl px-4 flex items-center justify-between hover:border-gray-300 transition-colors"
              >
                <span className="text-sm text-gray-700 truncate">
                  {selectedServer
                    ? mockServers.find((s) => s.id === selectedServer)?.name
                    : "Choose a server"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    isServerDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isServerDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#f5f5f5] rounded-2xl shadow-lg z-10 max-h-48 overflow-y-auto">
                  {mockServers.map((server) => (
                    <button
                      key={server.id}
                      onClick={() => {
                        setSelectedServer(server.id);
                        setIsServerDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                        selectedServer === server.id
                          ? "bg-[#FDD78D] bg-opacity-20"
                          : ""
                      } ${
                        server.id === mockServers[0].id ? "rounded-t-2xl" : ""
                      } ${
                        server.id === mockServers[mockServers.length - 1].id
                          ? "rounded-b-2xl"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{server.name}</span>
                        <span className="text-xs text-green-600 font-medium">
                          {server.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Plugins */}
          <div className="w-full flex-1 flex flex-col min-h-0 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Selected Plugins
              </h3>
              {selectedPlugins.length > 0 && (
                <span className="text-xs bg-[#FDD78D] text-gray-900 px-2 py-0.5 rounded-full font-medium">
                  {selectedPlugins.length}
                </span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {selectedPlugins.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center bg-white border border-[#f5f5f5] rounded-2xl">
                  <div className="text-center px-4">
                    <p className="text-sm text-gray-500 mb-1">
                      No plugins selected
                    </p>
                    <p className="text-xs text-gray-400">
                      Add plugins by selecting them from explore plugins page
                    </p>
                  </div>
                </div>
              ) : (
                selectedPlugins.map((plugin) => (
                  <div
                    key={plugin.id}
                    className="bg-white border border-[#f5f5f5] rounded-2xl p-3 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0">
                        {plugin.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                          {plugin.name}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 capitalize">
                            {plugin.plan}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            ${plugin.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removePlugin(plugin.id)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0"
                      >
                        <X className="h-3.5 w-3.5 text-gray-600 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Total and Pay Button */}
          <div className="w-full border-t border-[#f5f5f5] pt-4 mt-auto">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-900">
                Total Amount
              </span>
              <span className="text-lg font-bold text-gray-900">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handlePayNow}
              disabled={selectedPlugins.length === 0 || !selectedServer}
              className="w-full h-[45px] bg-[#181818] text-white rounded-2xl flex items-center justify-center font-medium hover:bg-[#2a2a2a] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
      {/* <MarketPlace /> */}
    </div>
  );
}
