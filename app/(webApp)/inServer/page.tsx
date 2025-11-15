"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useAuthContext } from "../auth/components/auth";
import Bg from "@/public/bgin.png";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import Image from "next/image";
import profile from "../../../public/image.png";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Link from "next/link";
import { setOpenPluginwindow } from "@/app/redux/slices/paramsSlice";
import axios from "axios";
import { API } from "@/app/utils/helpers";
import { PluginData } from "./layout";

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
    type: "Project Management ihefwik uhewduhwihbwejd",
    expireson: "2025-12-10",
  },
  {
    _id: "6",
    type: "Calendar",
    expireson: "2025-12-10",
  },
];
const PageContent = () => {
  const dispatch = useAppDispatch();
  const searchparams = useSearchParams();
  const [plugin, setPlugin] = useState("");
  const [serverId, setServerId] = useState("");
  const [dbName, setDbName] = useState("");
  const { openPluginwindow } = useAppSelector((state) => state.params);
  useEffect(() => {
    setPlugin(searchparams.get("plugin") || "");
    setServerId(searchparams.get("serverId") || "");
    setDbName(searchparams.get("dbName") || "");
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
          setPlugindata(res?.data?.server?.pluginsdata || []);
        }
      } catch (e) {
        console.log(e);
      }
    };

    if (serverId) {
      getPlugins();
    }
  }, [serverId]);

  console.log(plugindata, "pluginsdata");

  return (
    <div
      style={
        {
          // backgroundImage: `url(${Bg.src})`,
          // backgroundPosition: "top",
        }
      }
      className="bg-orange-200  bg-cover  h-full flex items-center "
    >
      {openPluginwindow ? (
        <iframe
          src={`http://localhost:5173/?dbName=${encoded}&userId=${userId}&serverId=${serverId}`}
          className="w-full h-full rounded-2xl"
        />
      ) : (
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
          {plugindata?.map((d, i) => (
            <Link
              onClick={() => {
                dispatch(setOpenPluginwindow(true));
              }}
              href={{
                pathname: "../inServer",
                query: {
                  plugin: `${d?.type}`,
                  serverId: serverId,
                  dbName: dbName,
                },
              }}
              key={i}
              className="py-2 text-[12px] text-center items-center  justify-center hover:-rotate-12  hover:scale-110 transition-all duration-300   w-[50px] flex flex-col gap-2"
            >
              <div className="relative  h-[35px] rotate-0  w-[30px]">
                {/* Reflection / Shadow box */}
                <div className="absolute top-[3px] left-[-3px] h-[32px] w-[30px] rounded-sm bg-[#F7F7F7] overflow-hidden">
                  <Image
                    src={profile}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Main box */}
                <div className="relative h-[32px] w-[30px] bg-[#F7F7F7] rounded-sm overflow-hidden ">
                  <Image
                    src={profile}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="block text-center w-full overflow-hidden whitespace-nowrap text-black">
                {d?.type}
              </span>
            </Link>
          ))}
        </div>
      )}
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
