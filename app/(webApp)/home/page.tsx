"use client";
import { API } from "@/app/utils/helpers";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoPlanetOutline, IoSearch } from "react-icons/io5";
import { TbTournament } from "react-icons/tb";
import { useAuthContext } from "../auth/components/auth";
import Link from "next/link";
import { PluginData } from "../relm/layout";

const Page = () => {
  const [section, setSection] = useState(0);
  const [serachvalue, setSearchvalue] = useState("");
  const [pluginData, setPluginData] = useState([])
  const [results, setResults] = useState<
    { _id: string; name: string; description?: string }[]
  >([]);

  const { data } = useAuthContext();
  const getAllPlugins = async () => {
    try {
      const res = await axios.get(`${API}/getAllPlugins`)
      setPluginData(res?.data?.plugins)
    }
    catch (E) {
      console.log(E)
    }
  }
  useEffect(() => {
    getAllPlugins()
  }, [])
  const userId = data?.id;

  const handleJoinServer = async (serverId: string) => {
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }
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

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await axios.get(`${API}/search?q=${value}`);

      setResults(res.data?.results);
    } catch (err) {
      console.error("Search error:", err);
    }
  };
  const [openPopup, setOpenpopup] = useState(false)


  const PLACEHOLDERS = [
    "Discover servers to join and contribute to team success",
    "Discover Relmes to collaborate, create, and grow",
    "Explore Relmes built for work, play, and everything in between",
    "Find Relmes where teams turn ideas into action",
    "Browse Relmes created by people like you",
    "Discover spaces designed to move together",
  ];

  const [placeholderText, setPlaceholderText] = useState("");
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [delta, setDelta] = useState(100);

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [placeholderText, delta]);

  const tick = () => {
    let i = loopNum % PLACEHOLDERS.length;
    let fullText = PLACEHOLDERS[i];
    let updatedText = isDeleting
      ? fullText.substring(0, placeholderText.length - 1)
      : fullText.substring(0, placeholderText.length + 1);

    setPlaceholderText(updatedText);

    if (isDeleting) {
      setDelta((prev) => prev / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setDelta(2000);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setDelta(100);
    }
  };

  return (
    <div onClick={() => { setOpenpopup(false) }} className="flex sm:items-center  pn:max-sm:items-start justify-center w-full h-full">
      <div className="sm:w-full flex  flex-col items-center p-4 sm:justify-center pn:max-sm:p-0 pn:max-sm:h-auto pn:max-sm:overflow-y-auto no-scrollbar">
        <div className="sm:w-full  flex flex-col  sm:pb-4 pt-20 sm:pt-0  justify-center items-center">
          <div className="sm:text-[35px] font-space-grotesk bg-clip-text">
            Hi, Aryansh
          </div>
          <div className="text-[16px] text-[#616161]">
            Ready to create your own Relm
          </div>
        </div>
        {/* Top Search */}
        <div className="text-[15px] vs:scale-[0.5] ss:scale-[0.6] pp:scale-[0.8] sm:scale-[1] origin-center transition-transform duration-300 justify-center flex items-center gap-4  p-2 text-[#364141] ">
          <div className="relative bg-white rounded-[30px] overflow-hidden w-[662px] border border-[#f4f4f4da] h-[240px]">
            {/* SVG background */}
            <svg
              width="662"
              height="189"
              viewBox="0 0 662 189"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
            >
              <path
                d="M30 188.5H288.456C300.138 188.5 310.72 181.607 315.44 170.921L322.646 154.611C327.526 143.564 338.466 136.437 350.544 136.437H632C648.292 136.437 661.5 123.229 661.5 106.937V27C661.5 10.7076 648.292 -2.5 632 -2.5H30C13.7076 -2.5 0.5 10.7076 0.5 27V159C0.5 175.292 13.7076 188.5 30 188.5Z"
                fill="#2C2C2C"
                stroke="#F0F0F0"
              />
            </svg>

            {/* Your content inside the SVG area */}
            <div className="absolute inset-0   space-y-1 h-fit  flex flex-col gap-1 p-4 text-white">
              <div className="">
                <div className="flex font-medium mb-2 gap-2  text-[18px] font-space-grotesk pl-2 items-center">
                  <IoPlanetOutline />
                  Search Relm
                </div>
                <div className="flex justify-center relative ">
                  <input
                    value={serachvalue}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchvalue(val);
                      handleSearch(val); // 🔍 search on each input change
                      setOpenpopup(true)
                    }}
                    type="text"
                    placeholder={placeholderText}
                    className="h-[50px] p-2 w-full outline-none text-[15px] pl-4 bg-white rounded-[20px] text-[#364141] placeholder:text-gray-400 border-2 border-transparent focus:border-[#F9D199] transition-all duration-300"
                  />
                  <div className="w-[55px] h-[50px] bg-[#F9D199] flex items-center justify-center rounded-[20px]">
                    <IoSearch className="text-[25px] text-[#364141]" />
                  </div>
                </div>

              </div>
              <hr className="border-[#333]" />
              <Link
                href="../serverCreation"
                className="h-[50px] font-space-grotesk z-20 w-[280px] p-2 flex items-center justify-center  outline-none text-[15px] bg-[#F9D199] rounded-[20px] text-[#364141] "
              >
                Create your own Relm
                {/* <span className="text-[12px] px-1"> (Server)</span> */}
              </Link>
            </div>
            <div className=" h-[100px] gap-2 p-2  flex items-end bottom-0 absolute w-full ">
              <div className="h-[40px] w-[50%] p-2 flex items-center justify-center font-space-grotesk gap-2 rounded-3xl bg-white">
                <TbTournament /> Explore popular plugins
              </div>
              {/* Fetch plugins */}
              <div className="h-full w-[50%] p-2   flex gap-2 items-center justify-center rounded-3xl">
                {pluginData?.map((d: PluginData, i) => (
                  <div key={i} className="flex flex-col items-center justify-center h-full w-full">
                    <div className="h-full w-full rounded-[25px] rotate-6 relative">
                      <div className="absolute top-2 left-2 w-[60%] h-[80%] bg-[#eeeeee] rounded-[5px]">
                        <img src={d?.icon} className="h-full w-full object-cover rounded-[5px]" />
                      </div>
                      <div className=" w-[60%] h-[80%] bg-[#eeeeee] rounded-[5px]">
                        {/* <img src={d?.icon} className="h-full w-full object-cover rounded-[5px]"/> */}
                      </div>
                    </div>
                    <div className="text-[12px]  font-space-grotesk pr-4 -pb-4">
                      {d?.pluginName?.slice(0, 4)}{d?.pluginName && d?.pluginName.length > 4 ? ".." : ""}
                    </div>
                  </div>
                ))}
                {/* <div className="flex flex-col items-center justify-center h-full w-full">
                  <div className="h-full w-full rounded-[25px] rotate-6 relative">
                    <div className="absolute top-2 left-2 w-[60%] h-[80%] bg-[#eeeeee] rounded-[5px]"></div>
                    <div className=" w-[60%] h-[80%] bg-[#eeeeee] rounded-[5px]"></div>
                  </div>
                  <div className="text-[12px] font-space-grotesk pr-4 -pb-4">
                    name
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <div className="h-full w-full rounded-[25px] rotate-6 relative">
                    <div className="absolute top-2 left-2 w-[60%] h-[80%] bg-[#eeeeee] rounded-[5px]"></div>
                    <div className=" w-[60%] h-[80%] bg-[#eeeeee] rounded-[5px]"></div>
                  </div>
                  <div className="text-[12px] font-space-grotesk pr-4 -pb-4">
                    name
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <div className="h-full w-full rounded-[25px] rotate-6 relative">
                    <div className="absolute top-2 left-2 w-[60%] h-[80%] bg-[#eeeeee] rounded-[5px]"></div>
                    <div className=" w-[60%] h-[80%] bg-[#eeeeee] rounded-[5px]"></div>
                  </div>
                  <div className="text-[12px] font-space-grotesk pr-4 -pb-4">
                    name
                  </div>
                </div> */}
                <Link
                  href="../explorePlugins"
                  className="flex flex-col items-center justify-center h-full w-full"
                >
                  <div className="h-full w-full rounded-[25px] rotate-6 relative">
                    <div className="absolute top-2 left-2 w-[60%] h-[80%] flex items-center justify-center text-[18px] -pl-4 font-space-grotesk bg-[#eeeeee] rounded-[5px]">
                      +
                    </div>
                    <div className=" w-[60%] h-[80%] bg-[#eeeeee] rounded-[5px]"></div>
                  </div>
                  <div className="text-[12px] font-space-grotesk pr-4 -pb-4">
                    145+
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {results.length > 0 && openPopup && (
          <div className="absolute top-[53%] w-[50%] mt-2  bg-white border border-gray-200 rounded-[20px] shadow-md z-50 max-h-[300px] overflow-y-auto">
            {results.map((server) => (
              <div
                key={server._id}
                className="px-4 py-3 flex justify-between  cursor-pointer"
              >
                <div className="flex flex-col">
                  <div className="font-semibold">{server.name}</div>
                  <div className="text-sm text-gray-600">
                    {server.description}
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleJoinServer(server._id);
                  }}
                  className=" h-[30px] bg-black hover:bg-[#333] text-white px-2 rounded-xl flex justify-center self-center items-center text-[10px]"
                >
                  Send request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
