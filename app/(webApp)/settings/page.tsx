"use client";
import { useState } from "react";
import {
  Server,
  CreditCard,
  Settings,
  Clock,
  Sun,
  LogOut,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function SettingsPage() {
  const [serversExpanded, setServersExpanded] = useState(true);

  const servers = [
    {
      name: "Experience",
      members: null,
      icon: Clock,
      badge: "Start Free Trial",
      color: "bg-white",
    },
    {
      name: "WilloWave",
      members: "40,000 Members",
      icon: null,
      logo: "W",
      color: "bg-gray-900",
    },
    {
      name: "Apna City",
      members: "98,070 Members",
      icon: null,
      logo: "🏙️",
      color: "bg-white",
    },
    {
      name: "FigVerse",
      members: "5,000",
      icon: null,
      logo: "💬",
      color: "bg-blue-600",
    },
  ];

  return (
    <div className=" h-screen pr-2 ">
      {/* Main Content */}
      <div className="w-full space-y-2">
        <div className="flex items-center h-[80px] justify-center">
          <div className="text-2xl font-semibold font-space-grotesk bg-white border border-[#f4f4f4da] w-full p-4 rounded-2xl text-gray-900 ">
            Settings
          </div>
        </div>

        <div className="bg-white relative rounded-3xl w-full p-8 border border-[#f4f4f4da] h-[calc(100vh-100px)] ">
          <h2 className="text-xl font-semibold font-space-grotesk text-gray-900 mb-8">
            Account Information
          </h2>

          {/* Profile Picture */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#f4f4f4da]">
            <div>
              <div className="text-sm text-gray-600 mb-1">Profile Picture</div>
              <div className="text-gray-900">Set an avatar</div>
            </div>
            <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center">
              <span className="text-white text-xl">👤</span>
            </div>
          </div>

          {/* Name */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#f4f4f4da]">
            <div>
              <div className="text-sm text-gray-600 mb-1">Name</div>
              <div className="text-gray-900 font-medium">Maya Sinclair</div>
            </div>
            <button className="text-amber-500 hover:text-amber-600 font-medium">
              Update
            </button>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#f4f4f4da]">
            <div>
              <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                Email
                <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>
              <div className="text-gray-900 font-medium">hey@agency.com</div>
            </div>
            <button className="text-amber-500 hover:text-amber-600 font-medium">
              Update
            </button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#f4f4f4da]">
            <div>
              <div className="text-sm text-gray-600 mb-1">Password</div>
              <div className="text-gray-900">Las changed Sep 21, 2023</div>
            </div>
            <button className="text-amber-500 hover:text-amber-600 font-medium">
              Update
            </button>
          </div>

          {/* Sign Out Everywhere */}
          <div>
            <div className="text-sm font-medium text-gray-900 mb-2">
              Sign Out Everywhere
            </div>
            <p className="text-sm text-gray-600 mb-4">
              If you lost a device or left logged in a public computer, you can
              sign out everywhere except your current browser.
            </p>
            <button className="flex items-center absolute bottom-4 right-4 gap-2 text-red-600 hover:text-red-700 font-medium">
              <LogOut className="w-4 h-4" />
              Sign out everywhere
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
