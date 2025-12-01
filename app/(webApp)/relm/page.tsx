"use client";
import { useRouter, useSearchParams } from "next/navigation";
import  { Suspense, useEffect, useState } from "react";
import { useAuthContext } from "../auth/components/auth";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";

import { setOpenPluginwindow } from "@/app/redux/slices/paramsSlice";
import axios from "axios";
import { API } from "@/app/utils/helpers";
import { PluginData } from "./layout";


// const plugins = [
//   {
//     _id: "1",
//     type: "Xmind",
//     expireson: "2025-12-10",
//   },
//   {
//     _id: "2",
//     type: "Chat",
//     expireson: "2025-12-10",
//   },
//   {
//     _id: "3",
//     type: "Drive",
//     expireson: "2025-12-10",
//   },
//   {
//     _id: "4",
//     type: "Task Management",
//     expireson: "2025-12-10",
//   },
//   {
//     _id: "5",
//     type: "Project Management ihefwik uhewduhwihbwejd",
//     expireson: "2025-12-10",
//   },
//   {
//     _id: "6",
//     type: "Calendar",
//     expireson: "2025-12-10",
//   },
// ];
const PageContent = () => {
  const dispatch = useAppDispatch();
  const router=useRouter()
  const searchparams = useSearchParams();
  const [plugin, setPlugin] = useState("");
  const [serverId, setServerId] = useState("");
  const [dbName, setDbName] = useState("");
  const { openPluginwindow } = useAppSelector((state) => state.params);

  useEffect(() => {
    setPlugin(searchparams.get("plugin") || "");
    setServerId(
      searchparams.get("serverId") || sessionStorage.getItem("serverId") || ""
    );
    setDbName(
      searchparams.get("dbName") || sessionStorage.getItem("dbName") || ""
    );
  }, [searchparams]);

  const { data } = useAuthContext();
  // const encoded = btoa(dbName);
  const encoded =
    typeof window === "undefined"
      ? Buffer.from(dbName).toString("base64")
      : btoa(dbName);

  const userId = data?.id;
  // const encodedDbName = encodeURIComponent(dbName);
  const [selectedPlugin, setSelectedPlugin] = useState(false);
  const [plugindata, setPlugindata] = useState<PluginData[]>([]);

  useEffect(() => {
    const getPlugins = async () => {
      if (!serverId) return;
      try {
        const res = await axios.get(`${API}/getPlugins/${serverId}`);
        if (res?.data?.success) {
          setPlugindata(res?.data?.plugins || []);
        }
      } catch (e) {
        console.log(e);
      }
    };

    if (serverId) {
      getPlugins();
    }
  }, [serverId]);

  console.log(openPluginwindow, "openPluginwindow");

  return (
    <div
     
      style={{
          backgroundImage: `url('/wallpaper1.png')`,
          backgroundPosition: "top",
          backgroundSize: "contain",
          // backgroundRepeat: "repeat",

        }}
      className="bg-black   h-full flex items-center "
    >
      
      {/* {openPluginwindow?.length > 0 ? (
        <iframe
          src={`${openPluginwindow}/?dbName=${encoded}&userId=${userId}&serverId=${serverId}`}
          className="w-full h-full rounded-2xl"
        />
      ) : ( */}
        <div
          style={{
            gridAutoFlow: "column",
            gridTemplateRows: "repeat(auto-fill, minmax(90px, 1fr))",
            placeItems: "start",
          }}
          className=" 
            grid
             justify-start
        
        gap-x-4
          
            w-full
            h-[90%]
           px-4 mt-4"
        >
          {plugindata?.map((d:PluginData, i) => (
            <div
              onClick={(e) => {
                e.preventDefault()
                
                // dispatch(setOpenPluginwindow(true));
              }}
               onDoubleClick={(e) => {
    e.preventDefault();
    
    dispatch(setOpenPluginwindow(d?.productiondomain));
    router.push(`../relm/plugin/${d?.pluginName}`)
    sessionStorage.setItem("pluginId", d?._id);
  }}
              // href={{
              //   pathname: "../inServer",
              //   query: {
              //     plugin: `${d?.type}`,
              //     serverId: serverId,
              //     dbName: dbName,
              //     productiondomain: `${d?.productiondomain}`,
              //   },
              // }}
              key={i}
              className="py-2 text-[12px] cursor-pointer text-center items-center  justify-center   w-[50px] flex flex-col gap-2"
            >
              <div className="relative  h-[35px]  hover:-rotate-12  hover:scale-110 transition-all duration-300 rotate-0  w-[30px]">
                {/* Reflection / Shadow box */}
                <div className="absolute top-[3px] left-[-3px] h-[32px] w-[30px] rounded-sm bg-[#F7F7F7] overflow-hidden">
                  <img
                    src={d?.icon}
                    alt={d?.pluginName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Main box */}
                <div className="relative h-[32px] w-[30px] bg-[#F7F7F7] rounded-sm overflow-hidden ">
                  <img
                    src={d?.icon}
                    alt={d?.pluginName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="block text-center w-full font-bold  overflow-hidden font-space-grotesk whitespace-nowrap text-white">
                {d?.pluginName}
              </span>
            </div>
          ))}
        </div>
      {/* )} */}
    </div>
  );
};
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default Page;
