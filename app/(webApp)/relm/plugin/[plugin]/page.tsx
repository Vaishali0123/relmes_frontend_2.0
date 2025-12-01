"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import profile from "../../../../public/image.png";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import Link from "next/link";
import { setOpenPluginwindow } from "@/app/redux/slices/paramsSlice";
import axios from "axios";
import { API } from "@/app/utils/helpers";
// import { PluginData } from "./layout";
import { useAuthContext } from "../../../auth/components/auth";
interface PluginData {
  _id: string;
  type: string;
  expireson: string;
}
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
const Page = () => {
  const dispatch = useAppDispatch();
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
  const[currentPluginData,setCurrentPluginData]=useState(JSON.parse(sessionStorage.getItem("currentPluginData") || "{}"))
const pluginId = sessionStorage.getItem("pluginId");
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
 const getPluginDetails = async () => {
      if (!pluginId) return;
      try {
        const res = await axios.get(`${API}/getPluginData/${pluginId}`);
        console.log(res?.data,"awa");
        if (res?.data?.success) {
          setCurrentPluginData(res?.data?.plugin)
          sessionStorage.setItem("currentPluginData",JSON.stringify({icon:res?.data?.plugin?.icon,productiondomain:res?.data?.plugin?.productiondomain}))
          // setPlugindata(res?.data?.server?.pluginsdata || []);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getPluginDetails()
    if (serverId) {
      getPlugins();
    }
  }, [serverId]);


  return (
    <div
      className=" h-[100%] w-full  "
    >

      <iframe
        src={`http://localhost:3001/?dbName=${encoded}&userId=${userId}&serverId=${serverId}`}
        className="w-full h-full "
      />

    </div>
  );
};

export default Page;
