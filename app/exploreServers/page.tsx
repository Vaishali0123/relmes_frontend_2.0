"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Settings,
  Globe,
  Lock,
  Users,
  Activity,
  MoreVertical,
  Bell,
} from "lucide-react";
import axios from "axios";
import { API } from "../utils/helpers";
import { useAuthContext } from "../(webApp)/auth/components/auth";
import Link from "next/link";

interface Server {
  _id: string;
  name: string;
  description: string;
  status: "online" | "offline" | "maintenance";
  type: "public" | "private";
  members: number;
  lastActive: string;
  cpuUsage: number;
  memoryUsage: number;
  dbName: string;
}

const ServerManagement: React.FC = () => {
  const [createdSearch, setCreatedSearch] = useState("");
  const [joinedSearch, setJoinedSearch] = useState("");
  const [isDefaultSet, setIsDefaultSet] = useState(false);
  // const [servers, setServers] = useState<
  //   {
  //     _id: string;
  //     dbName: string;
  //     name?: string;
  //     icon?: string;
  //     members?: [];
  //   }[]
  // >([]);
  const [servers, setServers] = useState<Server[]>([]);
  const { data } = useAuthContext();
  const userId = data?.id;

  // Mock data for joined servers
  const joinedServers: Server[] = [
    {
      id: "9",
      name: "Client Portal Server",
      description: "External client access portal",
      status: "online",
      type: "public",
      members: 25,
      lastActive: "5 min ago",
      cpuUsage: 41,
      memoryUsage: 55,
    },
    {
      id: "10",
      name: "Shared Analytics",
      description: "Cross-team analytics platform",
      status: "online",
      type: "public",
      members: 18,
      lastActive: "8 min ago",
      cpuUsage: 52,
      memoryUsage: 71,
    },
    {
      id: "11",
      name: "Testing Sandbox",
      description: "Collaborative testing environment",
      status: "online",
      type: "private",
      members: 11,
      lastActive: "12 min ago",
      cpuUsage: 29,
      memoryUsage: 46,
    },
    {
      id: "12",
      name: "Documentation Hub",
      description: "Team documentation server",
      status: "maintenance",
      type: "public",
      members: 22,
      lastActive: "45 min ago",
      cpuUsage: 5,
      memoryUsage: 18,
    },
    {
      id: "13",
      name: "Monitoring Dashboard",
      description: "System monitoring and alerts",
      status: "online",
      type: "private",
      members: 9,
      lastActive: "2 min ago",
      cpuUsage: 38,
      memoryUsage: 52,
    },
    {
      id: "14",
      name: "API Gateway",
      description: "Centralized API management",
      status: "online",
      type: "public",
      members: 16,
      lastActive: "1 min ago",
      cpuUsage: 63,
      memoryUsage: 74,
    },
    {
      id: "15",
      name: "Cache Server",
      description: "Redis caching layer",
      status: "offline",
      type: "private",
      members: 3,
      lastActive: "3 hours ago",
      cpuUsage: 0,
      memoryUsage: 12,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600 bg-green-100";
      case "offline":
        return "text-red-600 bg-red-100";
      case "maintenance":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage < 50) return "bg-green-500";
    if (usage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };
  const getUserServers = async () => {
    try {
      if (!userId) return;
      const res = await axios.get(`${API}/getUserServers/${userId}`);
      console.log(res?.data);
      setServers(res?.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (userId) {
      getUserServers();
    }
  }, []);
  const ServerCard: React.FC<{ server: Server; showActions?: boolean }> = ({
    server,
    showActions = false,
  }) => (
    <Link
      href={{
        pathname: "../inServer",
        query: {
          serverId: server?._id,
          dbName: encodeURIComponent(server?.dbName),
        },
      }}
      className=" border border-gray-200  cursor-pointer rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex  items-center space-x-3">
          <div className="flex-shrink-0">
            {server?.type === "public" ? (
              <Globe className="w-5 h-5" style={{ color: "#FDD78D" }} />
            ) : (
              <Lock className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {server?.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{server?.description}</p>
          </div>
        </div>
        {showActions && (
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            server?.status
          )}`}
        >
          {server?.status?.charAt(0)?.toUpperCase() + server?.status?.slice(1)}
        </span>
        <div className="flex items-center text-xs text-gray-500">
          <Users className="w-3 h-3 mr-1" />
          {server?.members}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600">CPU</span>
          <span className="font-medium">{server?.cpuUsage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${getUsageColor(server?.cpuUsage)}`}
            style={{ width: `${server?.cpuUsage}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600">Memory</span>
          <span className="font-medium">{server?.memoryUsage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${getUsageColor(
              server?.memoryUsage
            )}`}
            style={{ width: `${server?.memoryUsage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <Activity className="w-3 h-3 mr-1" />
          Last active: {server.lastActive}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center space-x-4">
            {/* Profile Picture (DP) */}
            <div
              className="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center shadow-md"
              style={{
                background: `linear-gradient(to bottom right, #FDD78D, #9333ea)`,
              }}
            >
              <span className="text-white font-bold text-lg">JD</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Server Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage and monitor your server infrastructure
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <div className="relative">
              <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              {/* Notification badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
            </div>

            {/* Set as Default Button */}
            <button
              onClick={() => setIsDefaultSet(!isDefaultSet)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                isDefaultSet
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-gray-800 text-white hover:bg-gray-900"
              }`}
            >
              {isDefaultSet ? "Set as Default ✓" : "Set as Default"}
            </button>
          </div>
        </div>

        {/* Created by you section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#FDD78D33" }}
              >
                <Settings className="w-4 h-4" style={{ color: "#FDD78D" }} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Created by you:
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                style={{ backgroundColor: "#FDD78D" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#FDD78DCC")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#FDD78D")
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Server
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search servers..."
                  value={createdSearch}
                  onChange={(e) => setCreatedSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#FDD78D";
                    e.currentTarget.style.boxShadow = "0 0 0 2px #FDD78D";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                />
              </div>

              <button
                className="text-sm font-medium"
                style={{ color: "#FDD78D" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#FDD78DCC")
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = "#FDD78D")}
              >
                View More →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {servers?.slice(0, 8).map((server, index) => (
              <ServerCard key={index} server={server} showActions={true} />
            ))}
          </div>
        </div>

        {/* Joined by you section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Joined by you:
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search servers..."
                  value={joinedSearch}
                  onChange={(e) => setJoinedSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#FDD78D";
                    e.currentTarget.style.boxShadow = "0 0 0 2px #FDD78D";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                />
              </div>
              <button
                className="text-sm font-medium"
                style={{ color: "#FDD78D" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#FDD78DCC")
                }
                onMouseLeave={(e) => (e.currentTarget.style.color = "#FDD78D")}
              >
                View More →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {joinedServers.slice(0, 7).map((server, index) => (
              <ServerCard key={index} server={server} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerManagement;
