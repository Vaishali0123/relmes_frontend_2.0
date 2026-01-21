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
  Calendar,
  CalendarCheck,
  Timer,
} from "lucide-react";
import axios from "axios";
import { API, formatDateDay } from "../../utils/helpers";
import { useAuthContext } from "../auth/components/auth";
import Link from "next/link";
import { FaServer } from "react-icons/fa";
import Image from "next/image";
import Group from "../../../public/Group.svg";

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
  storageallotted: number;
  storageused: number;
  icon: string;
  expireson?: Date;
  broughton?: Date;
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
  const isExpiredSoon = (expires: Date | string | undefined) => {
    if (!expires) return false;
    const diff = new Date(expires).getTime() - new Date().getTime();
    return diff < 1000 * 60 * 60 * 24 * 7; // less than 7 days
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
      onClick={() => {
        sessionStorage.setItem("serverId", server?._id);
        sessionStorage.setItem("dbName", encodeURIComponent(server?.dbName));
      }}
      href={{
        pathname: `/manage/${server?._id}`,
        // query: {
        //   serverId: server?._id,
        //   dbName: encodeURIComponent(server?.dbName),
        // },
      }}
      className=" border border-[#f4f4f4da] gap-2 flex flex-col cursor-pointer rounded-2xl p-6 hover:scale-105 hover:duration-300 hover:transition-all transition-shadow duration-200"
    >
      {/* Name & Description */}
      <div className="flex  h-[25%] items-start justify-between ">
        <div className="flex  items-center space-x-3">
          {/* <div className="flex-shrink-0">
            {server?.type === "public" ? (
              <Globe className="w-5 h-5 text-blue-600" />
            ) : (
              <Lock className="w-5 h-5 text-gray-600" />
            )}
          </div> */}
          <div>
            <div className="flex items-center gap-2">
              <img
                src={server?.icon}
                alt="server icon"
                className="h-[35px] w-[35px] rounded-[14px] object-cover"
              />

              <h3 className="font-semibold text-gray-900 text-sm">
                {server?.name}
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">{server?.description}</p>
          </div>
        </div>
        {showActions && (
          <button className="text-gray-400  hover:text-gray-600">
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </div>
      {/* Members */}
      <div className="flex items-center py-1  justify-between">
        {/* <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            server?.status
          )}`}
        >
          {server?.status?.charAt(0)?.toUpperCase() + server?.status?.slice(1)}
        </span> */}

        <div className="flex items-center   text-xs text-gray-500">
          <Users className="w-3 h-3 mr-1" />
          {server?.members} {server?.members > 1 ? "members" : "member"}
        </div>
      </div>
      <div className="text-gray-600 text-[14px]">Total Storage: {server?.storageallotted} GB </div>

      {/* Storage Used */}
      <div className="space-y-2  h-[20%]">
        <div className="flex justify-between items-center text-xs">

          <span className="text-gray-600">Used</span>
          <span className="font-medium">{server?.storageallotted} GB</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${getUsageColor(
              server?.storageused
            )}`}
            style={{ width: `${server?.storageused}%` }}
          ></div>
        </div>
        {/* <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600">Memory</span>
          <span className="font-medium">{server?.memoryUsage} GB</span>
        </div> */}
        {/* <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${getUsageColor(
              server?.memoryUsage
            )}`}
            style={{ width: `${server?.memoryUsage}%` }}
          ></div>
        </div> */}
      </div>
      {/* Add bought on and expires on area */}
      {/* <div className="flex items-center justify-between text-xs text-gray-500">
  <div className="flex items-center">
    <div className="flex items-center">
      <Calendar className="w-3 h-3 mr-1" />
      Bought on: {server?.broughton}
    </div>
    <div className="flex items-center">
      <Calendar className="w-3 h-3 mr-1" />
      Expires on: {server?.expireson}
    </div>
  </div>
</div> */}

      {/* Dates */}
      <div className="flex h-[45%] justify-evenly    flex-col gap-3 text-xs">
        {/* Bought On */}
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg shadow-sm border border-green-100">
          <CalendarCheck className="w-3.5 h-3.5 text-green-600" />
          <span className="font-semibold">Created On:</span>
          <span>{formatDateDay(server?.broughton)}</span>
        </div>

        {/* Expires On */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-sm border
      ${isExpiredSoon(server?.expireson || new Date())
              ? "bg-red-50 text-red-700 border-red-100"
              : "bg-purple-50 text-purple-700 border-purple-100"
            }
    `}
        >
          <Timer
            className={`w-3.5 h-3.5 ${isExpiredSoon(server?.expireson || new Date())
                ? "text-red-600"
                : "text-purple-600"
              }`}
          />
          <span className="font-semibold">Expires On:</span>
          <span>{formatDateDay(server?.expireson)}</span>
        </div>
      </div>

      {/* <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <Activity className="w-3 h-3 mr-1" />
          Last active: {server.lastActive}
        </div>
      </div> */}
    </Link>
  );

  return (
    <div className="h-screen w-full p-1 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between h-[80px] ">
        <div className="flex items-center space-x-4 h-fit w-full p-2 justify-between bg-white border border-[#f4f4f4da] rounded-2xl">
          <div>
            <h1 className="text-xl font-semibold pl-2 font-space-grotesk text-gray-900">
              Manage your spaces
            </h1>
            <p className="text-gray-600 text-sm pl-2 mt-1">
              Manage and monitor your infrastructure
            </p>
          </div>

          <div className={`flex ${servers?.length === 0 && "hidden"} items-center space-x-4`}>
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
      <div className="  h-[calc(100vh-100px)] p-4 border border-[#f4f4f4da]  rounded-3xl overflow-hidden overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servers?.length > 0 && servers.map((server, index) => (
            <ServerCard key={index} server={server} />
          ))
          }
        </div>
        {servers?.length === 0 && (
          <div className="flex flex-col w-full gap-2 h-full items-center justify-center">
            {/* <FaServer size={25} /> */}
            <Image src={Group} alt="" className="w-[100px] h-[100px] object-cover animate-jump-angle" />
            <div className="font-space-grotesk text-[18px]">No Relm found to manage</div>
            <Link href={"/serverCreation"} className=" hover:opacity-[90%]  border-2 border-black rounded-[18px] hover:bg-black hover:text-white hover:transition-all hover:duration-500 px-8 py-2 text-black">Create Now</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerManagement;
