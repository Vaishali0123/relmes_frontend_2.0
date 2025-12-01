"use client";
import axios from "axios";
import { ReactNode, FC, useState, useEffect, Children } from "react";
import { API } from "../utils/helpers";
import { useAuthContext } from "./auth/components/auth";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
// import { differenceInDays } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
// import TaskManager from "@/components/TaskManager";
// import Settings from "@/components/Settings";
// import BillingHistory from "@/components/BillingHistory";
import Bg from "@/public/bgin2.png";
import Navbar from "./components/Navbar";
import AuthProviderWrapper from "./auth/components/AuthProviderWrapper";
import { differenceInDays } from "date-fns";

interface MainLayout {
  children: ReactNode;
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const path = usePathname();
  const [todopopup, setTodopopup] = useState(false);
  const [servers, setServers] = useState<
    {
      _id: string;
      dbName: string;
      name?: string;
      icon?: string;
      members?: [];
    }[]
  >([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const { data } = useAuthContext();
  const [showPopup, setShowPopup] = useState(false);
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

  const getUserServers = async () => {
    try {
      const res = await axios.get(`${API}/getUserServers/${userId}`);
      console.log(res?.data);
      setServers(res?.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleConfirmLogout = () => {
    Cookies.remove("token"); // remove your auth cookie here
    setShowPopup(false);
    router.push("/login");
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
      const res = await axios.post(
        `http://localhost:5005/api/addtask/${userId}`,
        {
          title,
          desc,
        }
      );
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

  const getDaysLeft = (createdAt: Date) => {
    const createdDate = new Date(createdAt);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(expiryDate.getDate() + 7);

    const today = new Date();
    const daysLeft = differenceInDays(expiryDate, today);
    return daysLeft > 0 ? daysLeft : 0;
  };

  const daysLeft = data?.createdAt ? getDaysLeft(data?.createdAt) : 0;

  return (
    <AuthProviderWrapper>
      <div
        className="duration-75 bg-cover  fixed h-screen w-screen  flex pn:max-sm:flex-col"
        style={{
          backgroundImage: `url(${Bg.src})`,
          backgroundPosition: "top",
        }}
      >
        <Toaster />
        <div className="flex h-full w-full pn:max-sm:flex-col-reverse relative ">
          <div
            className={`sm:w-[400px]  ${
              (path.startsWith("/auth") || path.startsWith("/relm")) &&
              "hidden"
            } `}
          >
            <div className=" relative pn:max-sm:h-[50px] h-full w-full pn:max-sm:absolute  pn:max-sm:bottom-8 ">
              <Navbar />
            </div>
          </div>
          <div className="w-full h-full">{children}</div>
        </div>
      </div>
    </AuthProviderWrapper>
  );
}
