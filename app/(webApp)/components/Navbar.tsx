"use client";

import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CiViewList } from "react-icons/ci";
import { FiLogOut, FiSun } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoSettingsOutline, IoTimerOutline } from "react-icons/io5";
import { MdDelete, MdOutlineTipsAndUpdates } from "react-icons/md";
import { TbServerSpark } from "react-icons/tb";
import { useAuthContext } from "../auth/components/auth";
import { API } from "@/app/utils/helpers";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Check } from "lucide-react";
import { differenceInDays } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setStep } from "@/app/redux/slices/paramsSlice";
import { VscExtensions } from "react-icons/vsc";
import { LuMonitorCog } from "react-icons/lu";
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const monthShort = date.toLocaleString("default", { month: "short" }); // Jan, Feb...
  const year = date.getFullYear();

  return `upto ${day} ${monthShort} ${year}`;
};
const steps = [
  {
    id: 1,
    title: "Server Creation",
    description: "Basic server information",
  },
  { id: 2, title: "Add Plugins", description: "Choose server plugins" },
  { id: 3, title: "Payment", description: "Review and confirm" },
];
const Navbar = () => {
  const router = useRouter();
  const path = usePathname();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  // It is in query
  const serverId = searchParams.get("serverId");
  const dbName = searchParams.get("dbName");
  const { step, serverName, selectedServerPlan } = useAppSelector((state) => state.params);

  //  const [step, setStep] = useState(1);
  const [servers, setServers] = useState<
    {
      _id: string;
      dbName: string;
      name?: string;
      icon?: string;
      members?: number;
    }[]
  >([]);
  const [title, setTitle] = useState("");
  const [deletepop, setDeletepop] = useState(false);
  const [desc, setDesc] = useState("");
  const { data } = useAuthContext();
  const [showPopup, setShowPopup] = useState(false);
  const [results, setResults] = useState<
    { _id: string; name: string; description?: string }[]
  >([]);
  const [plugindata, setPlugindata] = useState([]);
  const [section, setSection] = useState(0);
  const [tasks, setTasks] = useState<
    {
      _id?: string;
      title: string;
      desc: string;
      createdAt: string;
      completed: boolean;
    }[]
  >([]);
  // const userId = localStorage.getItem("id");
  const userId = data?.id;
  const handleJoinServer = async (serverId: string) => {
    try {
      const res = await axios.post(
        `${API}/requestserver/${userId}/${serverId}`
      );

      if (res?.data?.success) {
        toast.success("Request sent");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getUserServers = async () => {
    try {
      const res = await axios.get(`${API}/getUserServers/${userId}`);

      setServers(res?.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleConfirmLogout = () => {
    Cookies.remove("token"); // remove your auth cookie here
    setShowPopup(false);
    router.push("/auth");
  };
  useEffect(() => {
    if (userId) {
      getUserServers();
    }
  }, []);
  const addTask = async () => {
    if (title.trim() === "") return;
    const newTask = {
      title: title,
      desc: desc,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    try {
      const res = await axios.post(`${API}/addtask/${userId}`, {
        title,
        desc,
      });
      if (res?.data?.success) {
        setTasks([newTask, ...tasks]);
        setTitle("");
        setDesc("");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getTasks = async () => {
    try {
      const res = await axios.get(`${API}/getTasks/${userId}`);

      if (res?.data?.success) {
        setTasks([...tasks, ...res?.data?.user?.todos]);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const updateTask = async (taskId: string) => {
    try {
      const res = await axios.post(`${API}/updateTask`, {
        userId,
        taskId,
      });

      if (res?.data?.success) {
        // getTasks();
      }
    } catch (e) {
      console.log(e);
    }
  };
  const toggleComplete = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };
  const adminId = data?.id;
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
  const getPlugins = async () => {
    try {
      const res = await axios.get(`${API}/getPlugins/${serverId}`);
      if (res?.data?.success) {
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

  const getDaysLeft = (createdAt: Date) => {
    const createdDate = new Date(createdAt);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(expiryDate.getDate() + 7);

    const today = new Date();
    const daysLeft = differenceInDays(expiryDate, today);
    return daysLeft > 0 ? daysLeft : 0;
  };

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await axios.get(`${API}/search?q=${value}`);
      console.log(res?.data, "resss");
      setResults(res.data?.results);
    } catch (err) {
      console.error("Search error:", err);
    }
  };
  const daysLeft = data?.createdAt ? getDaysLeft(data?.createdAt) : 0;
  return (
    <div className="w-full  pn:max-sm:flex flex-row-reverse  pn:max-sm:border border-[#f4f4f4da] items-center sm:min-w-[50px] rounded-t-2xl pn:max-sm:bg-white pn:max-sm:h-fit  sm:h-full">
      {/* header  */}
      <div className="h-[80px] sm:w-full rounded-2xl  p-2 ">
        <div className="h-full w-full rounded-[20px] bg-[#f4f4f4da] sm:bg-white  flex gap-2 items-center px-2">
          <div className="h-[45px] w-[45px]  sm:h-[50px] sm:w-[50px] bg-[#f0f0f0] rounded-[15px]">
            <img
              alt="server"
              src={data?.profilePicUrl}
              className="w-full h-full object-cover text-[10px] rounded-[15px]"
            />
          </div>

          <div>
            <div className="text-[14px] font-semibold">{data?.fullname}</div>
            <div className="text-[12px] text-slate-700">{data?.username}</div>
          </div>
        </div>
      </div>
      {/* main  */}
      <div className="  sm:h-full  p-2 text-[14px] font-space-grotesk pn:max-sm:h-[80px] ">
        <div className="sm:bg-white  sm:h-[calc(100%-80px)]  p-2 sm:rounded-3xl pn:max-sm:w-full">
          <div className="h-full w-full  sm:bg-[#fcfcfc]  sm:rounded-3xl sm:p-2 flex  sm:flex-col">
            <div
              className={`${path.startsWith("/serverCreation") ? "hidden" : ""
                } "w-full sm:space-y-2 pn:max-sm:flex justify-between"`}
            >
              {/* your severs  */}
              <div
                className={`${path.startsWith("/serverCreation") ? "hidden" : ""
                  } "sm:bg-white  sm:w-full pn:max-sm:flex  pn:max-sm:justify-center bg-white  rounded-2xl "`}
              >
                {/* Add server/plugins  */}
                <div
                  className={`${path.startsWith("/serverCreation") ? "hidden" : ""
                    } sm:h-[50px] w-full rounded-2xl  flex items-center px-2 justify-between`}
                >
                  <Link
                    href="../home"
                    className="flex items-center  pn:max-sm:flex-col pn:max-sm:justify-center gap-2"
                  >
                    <TbServerSpark className="text-[20px]" />
                    <div className="pn:max-sm:text-[12px]">
                      {path.startsWith("/relm") ? "Plugins" : "Your Relmes"}
                    </div>
                  </Link>
                  {/* add server */}
                  <div className="flex cursor-pointer pn:max-sm:hidden items-center gap-2">
                    <IoMdAddCircleOutline
                      onClick={() => {
                        router.push("../serverCreation");
                      }}
                      className="text-[20px]"
                    />

                    {/* <FaAngleDown className="text-[20px]" /> */}
                  </div>
                </div>
                {servers?.length > 0 && (
                  <>
                    <svg
                      width="11"
                      height="35"
                      viewBox="0 0 11 35"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.722656 0.720947V28.07C0.722656 31.2549 3.30452 33.8367 6.48942 33.8367H9.3728"
                        stroke="#D4D4D4"
                        stroke-width="1.44169"
                        stroke-linecap="round"
                      />
                    </svg>

                    <div
                      className={`${(path.startsWith("/relm") ||
                        path.startsWith("/serverCreation")) &&
                        "hidden"
                        } pn:max-sm:bg-white pn:max-sm:border border-[#f4f4f4da] max-h-[300px] overflow-y-auto pn:max-sm:h-[200px]  sm:w-full pn:max-sm:absolute pn:max-sm:p-3  gap-2 bottom-14 left-2 pn:max-sm:flex pn:max-sm:flex-col-reverse pn:max-sm:justify-center  rounded-2xl `}
                    >
                      {/* your server  */}
                      {servers?.map((server, index: number) => (
                        <Link
                          onClick={() => {
                            sessionStorage.setItem("serverId", server?._id);
                            sessionStorage.setItem("dbName", encodeURIComponent(server?.dbName));
                          }}
                          href={{
                            pathname: "/relm",
                            // query: {
                            //   serverId: server?._id,
                            //   dbName: encodeURIComponent(server?.dbName),
                            // },
                          }}
                          key={index}
                          className=" h-[50px]  hover:text-[14px] hover:font-semibold w-full sm:rounded-2xl flex items-center sm:px-4 "
                        >
                          {/* <div className="-mt-6  pn:max-sm:hidden">
                      <svg
                        width="11"
                        height="27"
                        viewBox="0 0 11 27"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.881836 0.753906V20.3628C0.881836 23.5786 3.48879 26.1855 6.70462 26.1855H9.61601"
                          stroke="#D4D4D4"
                          stroke-width="1.4557"
                          stroke-linecap="round"
                        />
                      </svg>
                    </div> */}

                          <div className="flex  items-center gap-2">
                            {/* Server Icon */}
                            <div className="w-[40px] h-[40px] hover:w-[42px] hover:h-[42px] rounded-2xl bg-[#D4D4D4]">
                              <img
                                alt="server"
                                src={server?.icon}
                                className="w-full h-full object-cover rounded-2xl text-[10px]"
                              />
                            </div>
                            <div className=" leading-4">
                              <div className="text-[13px]">{server?.name}</div>
                              <div className="text-[10px] text-slate-700">
                                {server?.members && server?.members > 1
                                  ? server?.members + " Members"
                                  : server?.members + " Member"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2"></div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
                {/* trail server  */}
                {daysLeft > 0 && (
                  <Link
                    href={{
                      pathname: "../relm",
                      query: {
                        free: true,
                      },
                    }}
                    className="sm:bg-white h-[50px] sm:w-full rounded-2xl flex items-center sm:px-2 justify-between "
                  >
                    <div className=" flex">
                      <div className="flex items-center -mt-8 ml-2 gap-2">
                        <svg
                          width="11"
                          height="35"
                          viewBox="0 0 11 35"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.722656 0.720947V28.07C0.722656 31.2549 3.30452 33.8367 6.48942 33.8367H9.3728"
                            stroke="#D4D4D4"
                            stroke-width="1.44169"
                            stroke-linecap="round"
                          />
                        </svg>
                      </div>
                      <div className="flex pn:max-sm:flex-col pn:max-sm:justify-center items-center sm:gap-2">
                        <IoTimerOutline className="text-[20px]" />
                        <div className="pn:max-sm:text-[12px]">Free trial</div>
                      </div>
                    </div>

                    {data?.createdAt && (
                      <div className="text-[12px] pn:max-sm:absolute top-0 left-20 text-slate-700 bg-amber-300 p-1 px-4 rounded-full">
                        {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                      </div>
                    )}
                  </Link>
                )}
              </div>

              {/* Delete Server */}
              <div
                onClick={() => {
                  setDeletepop(true);
                }}
                className={`h-[40px] ${path.startsWith("/relm") ? "" : "hidden"
                  } cursor-pointer sm:w-full bg-red-600 hover:bg-red-500 text-white pn:max-sm:hidden rounded-2xl flex items-center px-2 justify-between`}
              >
                <div className="flex items-center pn:max-sm:flex-col pn:max-sm:justify-center gap-2">
                  <MdDelete className="text-[20px]" />
                  <div>Remove Server</div>
                </div>
              </div>

              {deletepop && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-50">
                  <div className="bg-white p-4 rounded-lg">
                    <h2 className="text-[16px] font-semibold mb-4">
                      Are you sure you want to delete this server?
                    </h2>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setDeletepop(false)}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-200 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={deleteserver}
                        className="px-4 py-2 bg-red-600 hover:bg-red-400 text-white rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Explore Plugins */}
              <Link
                href="/explorePlugins"
                className={`${path.startsWith("/serverCreation") ||
                  (path.startsWith("/relm") && "hidden")
                  } sm:h-[40px] sm:w-full rounded-2xl flex items-center px-2 justify-between`}
              >
                <div className="flex items-center pn:max-sm:flex-col pn:max-sm:justify-center  gap-2">
                  <VscExtensions size={18} />
                  <div className="pn:max-sm:text-[12px] pn:max-sm:">
                    Explore Plugins
                  </div>
                </div>
              </Link>
              {/* billings  */}
              <Link
                href="../manageBilling"
                // onClick={() => setSection(2)}
                className={`${(path.startsWith("/serverCreation") ||
                  path.startsWith("/relm")) &&
                  "hidden"
                  } sm:h-[40px] sm:w-full rounded-2xl flex items-center px-2 justify-between`}
              >
                <div className="flex items-center pn:max-sm:flex-col pn:max-sm:justify-center  gap-2">
                  <LuMonitorCog className="text-[20px]" />
                  <div className="pn:max-sm:text-[12px] pn:max-sm:">
                    Monitor Relmes
                  </div>
                </div>
              </Link>

              {/* settings  */}
              <Link
                href="../settings"
                // onClick={() => setSection(3)}
                className={`${path.startsWith("/serverCreation") && "hidden"
                  } h-[40px] sm:w-full cursor-pointer pn:max-sm:hidden rounded-2xl flex items-center px-2 justify-between`}
              >
                <div className="flex items-center pn:max-sm:flex-col pn:max-sm:justify-center gap-2">
                  <IoSettingsOutline className="text-[20px]" />
                  <div>Settings</div>
                </div>
              </Link>
            </div>
            {/* Steps */}
            {path.startsWith("/serverCreation") && (
              <div className="p-2  ">
                <div className="">
                  {steps.map((stepItem) => (
                    <div
                      key={stepItem.id}
                      className={`cursor-pointer transition-all duration-200 ${step === stepItem.id ? "opacity-100" : "opacity-60"
                        }`}
                      onClick={() => {
                        // Validation logic
                        if (stepItem.id > 1) {
                          if (!serverName || !serverName.trim() ) {
                            toast.error("Please fill the step by step details first");
                            return;
                          }
                        }

                        dispatch(setStep(stepItem.id));
                        // setStep(stepItem.id); 
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {/* step number  */}
                        <div
                          className={`h-8 w-8 rounded-full border   flex items-center justify-center text-sm font-medium transition-colors ${step === stepItem.id
                            ? "bg-primary text-primary-foreground bg-[#FFDD99] border-[#FFDD99] border-primary"
                            : step > stepItem.id
                              ? "bg-success text-success-foreground  border-success"
                              : "border-border text-muted-foreground "
                            }`}
                        >
                          {step > stepItem.id ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            stepItem.id
                          )}
                        </div>
                        <div>
                          {/* title  */}
                          <div
                            className={`font-medium font-space-grotesk ${step === stepItem.id
                              ? "text-foreground"
                              : "text-muted-foreground"
                              }`}
                          >
                            {stepItem.title}
                          </div>
                          {/* description  */}
                          <div className="text-xs text-muted-foreground">
                            {stepItem.description}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`${stepItem.id === 3
                          ? "hidden"
                          : "h-[80px] w-[30px] flex items-center justify-center"
                          }`}
                      >
                        <div className="h-full border-dashed border-l border-success"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              className={`${path.startsWith("/serverCreation") ? "" : "hidden"
                } " self-end h-full justify-end flex flex-col w-full pn:max-sm:hidden" `}
            >
              <div className="border-[#D4D4D4] border-t"></div>

              {/* Log out  */}
              <div className=" h-[40px] w-full rounded-2xl flex items-center px-2 justify-between">
                <div
                  onClick={() => setShowPopup(true)}
                  className="flex text-red-500 items-center gap-2"
                >
                  <FiLogOut className="text-[20px]" />
                  <div>Back</div>
                </div>
              </div>
              {/* Popup Modal */}
              {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-2xl shadow-lg w-[300px] text-center">
                    <div className="text-lg font-semibold mb-4">
                      Confirm Logout
                    </div>
                    <div className="text-sm text-gray-600 mb-6">
                      Are you sure you want to log out?
                    </div>
                    <div className="flex justify-between gap-4">
                      <button
                        onClick={() => setShowPopup(false)}
                        className="w-full bg-gray-200 text-black rounded-xl py-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmLogout}
                        className="w-full bg-red-600 text-white rounded-xl py-2"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className={`${path.startsWith("/serverCreation") ? "hidden" : ""
                } " self-end h-full justify-end flex flex-col w-full pn:max-sm:hidden" `}
            >
              {/* dark/light Modes  */}
              <div className="border-[#D4D4D4] border-t"></div>
              {/* <div className=" h-[40px]  w-full rounded-2xl flex items-center px-2 justify-between">
                <div className="flex items-center gap-2">
                  <FiSun className="text-[20px]" />
                  <div>Light mode</div>
                </div>
              </div> */}

              {/* Updates & FAQ  */}
              {/* <div className=" h-[40px]  w-full rounded-2xl flex items-center px-2 justify-between">
                <div className="flex items-center gap-2">
                  <MdOutlineTipsAndUpdates className="text-[20px]" />
                  <div>Updates & FAQ</div>
                </div>
              </div> */}
              {/* Log out  */}
              <div className=" h-[40px] w-full rounded-2xl flex items-center px-2 justify-between">
                <div
                  onClick={() => setShowPopup(true)}
                  className="flex text-red-500 items-center gap-2"
                >
                  <FiLogOut className="text-[20px]" />
                  <div className="font-semibold">Log out</div>
                </div>
              </div>
              {/* Popup Modal */}
              {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-2xl shadow-lg w-[300px] text-center">
                    <div className="text-lg font-semibold mb-4">
                      Confirm Logout
                    </div>
                    <div className="text-sm text-gray-600 mb-6">
                      Are you sure you want to log out?
                    </div>
                    <div className="flex justify-between gap-4">
                      <button
                        onClick={() => setShowPopup(false)}
                        className="w-full bg-gray-200 text-black rounded-xl py-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmLogout}
                        className="w-full bg-red-600 text-white rounded-xl py-2"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
