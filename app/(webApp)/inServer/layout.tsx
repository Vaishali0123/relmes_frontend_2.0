"use client";
import axios from "axios";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, FC, useState, useEffect, Suspense } from "react";

import { FaRegBell, FaRegFolderOpen } from "react-icons/fa";
import { FiChevronDown, FiInfo, FiLogOut, FiSun } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { IoMdAddCircleOutline } from "react-icons/io";
import {
  IoChevronBackOutline,
  IoClose,
  IoExtensionPuzzleOutline,
  IoExtensionPuzzleSharp,
  IoPersonAddOutline,
  IoSearch,
  IoSettingsOutline,
} from "react-icons/io5";
import {
  MdDelete,
  MdHelpOutline,
  MdOutlineTipsAndUpdates,
} from "react-icons/md";
import { useAuthContext } from "../auth/components/auth";
import { API } from "../../utils/helpers";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { TbServerSpark, TbTournament } from "react-icons/tb";
import Image from "next/image";
import profile from "../../../public/image.png";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setOpenPluginwindow } from "@/app/redux/slices/paramsSlice";
import * as Tooltip from "@radix-ui/react-tooltip";
import { HiGift } from "react-icons/hi";
import { RiNotification4Line } from "react-icons/ri";
import { BsFillArrowUpLeftSquareFill } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BillingPage from "./payments/page";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
interface MainLayoutProps {
  children: ReactNode;
}

export interface PluginData {
  _id?: string;
  type?: string;
  expireson?: string;
}
// Add some raw data for the plugins
const plugins = [
  {
    _id: "1",
    type: "Xmind",
    expireson: "2025-12-10",
  },
  {
    _id: "2",
    type: "Chat",
    expireson: "2025-12-10",
  },
  {
    _id: "3",
    type: "Drive",
    expireson: "2025-12-10",
  },
  {
    _id: "4",
    type: "Task Management",
    expireson: "2025-12-10",
  },
  {
    _id: "5",
    type: "Project Management",
    expireson: "2025-12-10",
  },
  {
    _id: "6",
    type: "Calendar",
    expireson: "2025-12-10",
  },
  {
    _id: "7",
    type: "Notes",
    expireson: "2025-12-10",
  },
  {
    _id: "8",
    type: "Files",
    expireson: "2025-12-10",
  },
  {
    _id: "9",
    type: "Tasks",
    expireson: "2025-12-10",
  },
  {
    _id: "10",
    type: "Documents",
    expireson: "2025-12-10",
  },
];

const notifications = [
  {
    _id: "1",
    type: "Notification 1",
    message: "Notification 1 message",
  },
  {
    _id: "2",
    type: "Notification 2",
    message: "Notification 2 message",
  },
  {
    _id: "3",
    type: "Notification 3",
    message: "Notification 3 message",
  },
];
const MainLayoutContent: FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { openPluginwindow } = useAppSelector((state) => state.params);
  const searchparams = useSearchParams();
  const path = usePathname();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [openMorePlugins, setOpenMorePlugins] = useState(false);
  const [openAccountSettings, setOpenAccountSettings] = useState(false);
  const serverId = searchparams.get("serverId");
  const dbName = searchparams.get("dbName");
  const { data } = useAuthContext();

  const [plugindata, setPlugindata] = useState<PluginData[]>([]);
  const [requests, setRequests] = useState<
    { _id: string; fullname: string; username: string }[]
  >([]);
  const [viewrequests, setViewRequests] = useState(false);
  const [deletepop, setDeletepop] = useState(false);
  const free = searchparams.get("free");
  const adminId = data?.id;
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const monthShort = date.toLocaleString("default", { month: "short" }); // Jan, Feb...
    const year = date.getFullYear();
    return `upto ${day} ${monthShort} ${year}`;
  };
  const [openProfile, setOpenProfile] = useState(false);
  const [openBillingDialog, setOpenBillingDialog] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const getPlugins = async () => {
    try {
      const res = await axios.get(`${API}/getPlugins/${serverId}`);
      if (res?.data?.success) {
        console.log(res?.data, "pluginsdata");
        setPlugindata(res?.data?.server?.pluginsdata);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (serverId) {
      getPlugins();
    }
  }, [serverId]);
  const getrequests = async () => {
    try {
      const res = await axios.get(`${API}/getrequests/${serverId}`);
      if (res?.data?.success) {
        console.log(res?.data);
        setRequests(res?.data?.requests?.requests);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const acceptrequest = async (userId: string) => {
    try {
      const res = await axios.post(
        `${API}/approverequest/${adminId}/${serverId}/${userId}`
      );
      if (res?.data?.success) {
        toast.success("Request approved");
        getrequests();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const inviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    try {
      const res = await axios.post(
        `${API}/invitemember/${adminId}/${serverId}`,
        { email: inviteEmail }
      );
      if (res?.data?.success) {
        toast.success("Invitation sent successfully");
        setInviteEmail("");
      }
    } catch (e: any) {
      console.log(e);
      toast.error(e?.response?.data?.message || "Failed to send invitation");
    }
  };
  console.log(plugindata, "plugindata");
  const deleteserver = async () => {
    try {
      const res = await axios.post(
        `${API}/deleteserver/${adminId}/${serverId}`
      );
      if (res?.data?.success) {
        toast.success("Server deleted successfully");
        router.back();
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete server");
    }
  };
  return (
    <div className="h-full text-white  w-full">
      <Toaster />

      <div className="h-full flex justify-center   items-center relative w-full ">
        {/* header  */}
        <div className="h-[40px] absolute top-0 w-full">
          <div className="h-full w-full bg-[#2d2d2d33] shadow-lg backdrop-blur-3xl flex justify-between items-center px-2">
            <div className="flex  items-center gap-2">
              <IoChevronBackOutline
                onClick={() => {
                  dispatch(setOpenPluginwindow(false));
                }}
                className={`mx-2 hover:opacity-80 ${
                  openPluginwindow ? "" : "hidden"
                }`}
                size={20}
              />
              <div className="h-[30px] w-[30px] bg-[#ececec1c] rounded-[10px]">
                <img
                  src={data?.profilePicUrl}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-[14px] font-semibold">
                  {data?.username}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* <div
              onClick={() => {
                getrequests();
                setViewRequests(!viewrequests);
              }}
              className={`p-2  flex items-center justify-center rounded-[10px] ${
                viewrequests ? "bg-slate-200" : ""
              }`}
            >
              View Requests
            </div> */}
              <Tooltip.Provider delayDuration={100}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div
                      className={`${
                        path.startsWith("/inServer") ? "" : "hidden"
                      } sm:h-[40px] hover:opacity-80  duration-300 rounded-[10px] flex items-center px-2 justify-between cursor-pointer`}
                    >
                      <div className="flex items-center pn:max-sm:flex-col pn:max-sm:justify-center gap-2">
                        <RiNotification4Line className="text-[20px] hover:opacity-80 hover:scale-110 transition-all duration-300" />
                      </div>
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      sideOffset={6}
                      className="px-3 py-1.5 text-xs text-white rounded-xl shadow-lg border border-white/20 bg-white/10 backdrop-blur-md animate-in fade-in-50"
                    >
                      {notifications?.length > 0 ? (
                        <div>
                          {" "}
                          {notifications?.map((item, index) => (
                            <div key={index}>
                              <div>{item?.type}</div>
                              <div>{item?.message}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div> No Notifications</div>
                      )}

                      <Tooltip.Arrow className="fill-white/20" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          </div>
        </div>
        {viewrequests ? (
          <div className="h-[calc(100%-100px)] gap-2 w-full border border-white/10 ">
            {requests?.length === 0 ? (
              <div className={`text-black font-semibold self-center flex`}>
                No requests available
              </div>
            ) : (
              requests?.map((item, index) => (
                <div
                  key={index}
                  className="w-full bg-slate-100 px-4 flex rounded-xl items-center justify-between"
                >
                  <div className="w-[80%] flex flex-col">
                    <div className="font-semibold">{item?.fullname}</div>
                    <div>{item?.username}</div>
                  </div>
                  <div
                    onClick={() => {
                      acceptrequest(item?._id);
                    }}
                    className="w-[20%] hover:bg-slate-200 rounded-xl p-2 flex items-center justify-center"
                  >
                    Accept
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="h-[calc(100%)]  w-full ">{children}</div>
        )}

        <Tooltip.Provider delayDuration={100}>
          <div
            className={`h-[50px] ${
              openPluginwindow ? "hidden" : ""
            } absolute bottom-6`}
          >
            <div className="h-full w-full flex flex-row rounded-[20px] bg-[#2d2d2d33] shadow-lg backdrop-blur-xl border border-white/10 justify-between items-center p-2 pr-4 gap-4">
              {/* 🔍 Search Bar */}
              <div className="h-[35px] rounded-[14px] flex items-center px-2 justify-between bg-[#18181833] shadow-lg backdrop-blur-xl w-[200px]">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-full rounded-[20px] bg-transparent text-white border-none outline-none pl-2 placeholder-white/70"
                />
                <IoSearch className="text-[20px]" />
              </div>

              {/* ➕ Add Server */}
              <div className="h-[35px] rounded-[10px] flex items-center px-2 justify-between">
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div
                      className="flex pn:max-sm:hidden items-center gap-2 cursor-pointer"
                      onClick={() => router.push("../serverCreation")}
                    >
                      <TbTournament className="text-[20px] hover:opacity-80 hover:scale-110 transition-all duration-300" />
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      sideOffset={6}
                      className="px-3 py-1.5 text-xs text-black rounded-xl shadow-lg border border-white/20 bg-white/10 backdrop-blur-md animate-in fade-in-50"
                    >
                      Create Server
                      <Tooltip.Arrow className="fill-white/20" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </div>

              {/* 🧩 Map max 5 Plugins - recently used */}
              {plugindata?.length > 0 &&
                path.startsWith("/inServer") &&
                plugindata?.slice(0, 5)?.map((item, i) => (
                  <Tooltip.Root key={item?._id || i}>
                    <Tooltip.Trigger asChild>
                      <Link
                        onClick={() => {
                          dispatch(setOpenPluginwindow(true));
                        }}
                        href={{
                          pathname: "../inServer",
                          query: {
                            plugin: `${item?.type}`,
                            serverId,
                            dbName,
                          },
                        }}
                        className="sm:h-[40px] text-white rounded-xl flex items-center px-2 justify-between cursor-pointer"
                      >
                        <div className="relative h-[35px] rotate-0 hover:rotate-12 hover:scale-110 transition-all duration-300 w-[30px]">
                          {/* Reflection / Shadow box */}
                          <div className="absolute top-[3px] left-[-3px] h-[32px] w-[30px] rounded-sm bg-[#F7F7F7] overflow-hidden">
                            <Image
                              src={profile}
                              alt="plugin"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Main box */}
                          <div className="relative h-[32px] w-[30px] bg-[#F7F7F7] rounded-sm overflow-hidden">
                            <Image
                              src={profile}
                              alt="plugin"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </Link>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="top"
                        sideOffset={6}
                        className="px-3 py-1.5 text-xs text-white rounded-xl shadow-lg border border-white/20 bg-white/10 backdrop-blur-md animate-in fade-in-50"
                      >
                        {item?.type}
                        <Tooltip.Arrow className="fill-white/20" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                ))}

              {/* 👥 Members */}
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link
                    href="../inServer/members"
                    className={`${
                      path.startsWith("/inServer") ? "" : "hidden"
                    } sm:h-[40px] hover:opacity-80 hover:scale-110 transition-all duration-300 rounded-[10px] flex items-center px-2 justify-between cursor-pointer`}
                  >
                    <div className="flex items-center pn:max-sm:flex-col pn:max-sm:justify-center gap-2">
                      <GoPeople className="text-[20px]" />
                    </div>
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    sideOffset={6}
                    className="px-3 py-1.5 text-xs text-white rounded-xl shadow-lg border border-white/20 bg-white/10 backdrop-blur-md animate-in fade-in-50"
                  >
                    Members
                    <Tooltip.Arrow className="fill-white/20" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div className="cursor-pointer">
                      <IoSettingsOutline className="text-[20px] hover:opacity-80 hover:scale-110 transition-all duration-300" />
                    </div>
                  </Tooltip.Trigger>

                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      align="center"
                      sideOffset={12}
                      className="z-50 w-[280px] bg-[#44444433] shadow-lg backdrop-blur-xl border border-white/10 rounded-2xl p-4 animate-fadeIn"
                    >
                      <div className="space-y-4">
                        {/* Account Info */}
                        <div className="flex items-center gap-3 pb-4 border-b border-[#ffffff2c]">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#932E75] to-[#95437D] flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {data?.username?.charAt(0)?.toUpperCase() ||
                                data?.user?.username
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                "U"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-semibold text-sm truncate">
                              {data?.username || data?.user?.username || "User"}
                            </div>
                            <div className="text-white text-xs truncate">
                              {data?.email ||
                                data?.user?.email ||
                                "xyz@gmail.com"}
                            </div>
                          </div>
                        </div>

                        {/* Credits */}
                        <div className="space-y-3 pb-4 border-b border-[#ffffff2c]">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-sm font-medium">
                              Storage
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-white text-sm">
                                3.1 left
                              </span>
                              <FiChevronDown className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                          <div className="w-full h-2 bg-[#2c2d30] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#FDD78D] rounded-full transition-all"
                              style={{ width: "78%" }}
                            ></div>
                          </div>
                          {/* <div className="flex items-center gap-2 text-xs text-gray-400">
              <FiInfo className="w-3 h-3" />
              <span>Storage reset at midnight UTC</span>
            </div> */}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 pb-4 border-b border-[#ffffff2c]">
                          <button
                            onClick={() => {
                              setOpenAccountSettings(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#fafafa] text-sm font-medium transition-colors"
                          >
                            <IoSettingsOutline className="w-4 h-4" />
                            Settings
                          </button>
                          <button
                            onClick={() => {
                              setOpenInviteDialog(true);
                              getrequests();
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#f8f8f8] text-sm font-medium transition-colors hover:bg-[#e8e8e8]"
                          >
                            <IoPersonAddOutline className="w-4 h-4" />
                            Invite
                          </button>
                        </div>

                        {/* Bottom Menu */}
                        <div className="space-y-1">
                          <button
                            onClick={() => setOpenBillingDialog(true)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm transition-colors hover:bg-[#2c2d30]"
                          >
                            <HiGift className="w-4 h-4" />
                            Billing & Payments
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm transition-colors">
                            <MdHelpOutline className="w-4 h-4" />
                            Help Center
                          </button>

                          <button
                            onClick={() => setShowLogoutPopup(true)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#2c2d30] text-[#F16047] hover:text-[#ff6b57] text-sm font-medium transition-colors"
                          >
                            <BsFillArrowUpLeftSquareFill className="w-4 h-4" />
                            Back to Dashboard
                          </button>
                        </div>
                      </div>

                      {/* Tooltip Arrow */}
                      <Tooltip.Arrow className="fill-[#fff]/80" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          </div>
        </Tooltip.Provider>

        {/* Billing Dialog */}
        <Dialog open={openBillingDialog} onOpenChange={setOpenBillingDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 bg-white">
            <DialogHeader className="sr-only">
              <DialogTitle>Billing & Payments</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[90vh] ">
              <BillingPage />
            </div>
          </DialogContent>
        </Dialog>

        {/* Invite Dialog - Custom Popup */}
        {openInviteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay with blur */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
              onClick={() => setOpenInviteDialog(false)}
            />

            {/* Popup Content */}
            <div
              className="relative z-50 w-full max-w-[500px] bg-[#2d2d2d] backdrop-blur-xl border border-white/10 shadow-2xl rounded-[20px] text-white overflow-hidden animate-in "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setOpenInviteDialog(false)}
                className="absolute top-4  right-4 z-10 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <IoClose className="w-5 h-5 text-white" />
              </button>

              {/* Header */}
              <div className="px-6 pt-6 pb-4">
                <h2 className="text-xl font-semibold text-white">
                  Invite Members
                </h2>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                <Tabs defaultValue="invite" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-[#1a1a1a]/50 border border-white/10 rounded-[14px] p-1">
                    <TabsTrigger
                      value="invite"
                      className="data-[state=active]:bg-[#3d3d3d] data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-400 rounded-[12px]"
                    >
                      Invite Members
                    </TabsTrigger>
                    <TabsTrigger
                      value="requests"
                      className="data-[state=active]:bg-[#3d3d3d] data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-400 rounded-[12px]"
                    >
                      View Requests
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="invite" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Search by username or email
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="Enter username or email address"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              inviteMember();
                            }
                          }}
                          className="flex-1 bg-[#1a1a1a] border-white/10 text-white placeholder:text-gray-500 focus:border-white/20 rounded-[12px]"
                        />
                        <Button
                          onClick={inviteMember}
                          className="bg-white hover:bg-gray-200 text-gray-900 rounded-[12px]"
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      Enter the email address of the person you want to invite
                      to this server.
                    </p>
                  </TabsContent>
                  <TabsContent value="requests" className="mt-4">
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {requests?.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <GoPeople className="w-12 h-12 mx-auto mb-2 opacity-50 text-gray-500" />
                          <p className="text-sm">No pending requests</p>
                        </div>
                      ) : (
                        requests?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-[14px] border border-white/10 hover:bg-[#252525] transition-colors"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-white">
                                {item?.fullname}
                              </div>
                              <div className="text-sm text-gray-400">
                                {item?.username}
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                acceptrequest(item?._id);
                              }}
                              className="bg-white hover:bg-gray-200 text-gray-900 text-sm px-4 py-2 rounded-[12px]"
                            >
                              Accept
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      }
    >
      <MainLayoutContent>{children}</MainLayoutContent>
    </Suspense>
  );
};

export default MainLayout;
