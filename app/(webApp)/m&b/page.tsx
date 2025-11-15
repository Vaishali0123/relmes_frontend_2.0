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
import { API } from "../../utils/helpers";
import { useAuthContext } from "../auth/components/auth";
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
      className=" border border-[#f4f4f4da] cursor-pointer rounded-2xl p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex  items-center space-x-3">
          <div className="flex-shrink-0">
            {server?.type === "public" ? (
              <Globe className="w-5 h-5 text-blue-600" />
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
    <div className="h-screen w-full p-1 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between h-[80px] ">
        <div className="flex items-center space-x-4 h-fit w-full p-2 justify-between bg-white border border-[#f4f4f4da] rounded-2xl">
          <div>
            <h1 className="text-xl font-semibold pl-2 font-space-grotesk text-gray-900">
              Server Management
            </h1>
            <p className="text-gray-600 text-sm pl-2 mt-1">
              Manage and monitor your server infrastructure
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search servers..."
                value={createdSearch}
                onChange={(e) => setCreatedSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-[#f4f4f4da] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#] focus:border-[#]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Created by you section */}
      <div className=" bg-white h-[calc(100vh-100px)] p-4 border border-[#f4f4f4da] rounded-3xl overflow-hidden overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {joinedServers.slice(0, 7).map((server, index) => (
            <ServerCard key={index} server={server} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServerManagement;
