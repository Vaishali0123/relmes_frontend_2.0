"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { API } from "@/app/utils/helpers";
import { toast } from "@/app/utils/toast-safe";

// Safely import Cookies only on client side
let Cookies: typeof import("js-cookie").default | null = null;
if (typeof window !== "undefined") {
  Cookies = require("js-cookie").default;
}

interface AuthContextType {
  data: UserData | null;
  auth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

// Provide a default value for the context
const defaultAuthContext: AuthContextType = {
  data: null,
  auth: false,
  setAuth: () => {},
  setData: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export interface UserData {
  profilePicUrl: string;
  fullname: string;
  username: string;
  id: string;
  isVerified: boolean; // was "isverified", corrected to match backend key
  role: "individual" | "admin" | "enterprise-admin" | "enterprise-member"; // new
  createdAt: Date;
  phone: string;
  email: string;
  user: UserData;
  // serverscreated: Array<string>;
  // serversjoined: Array<string>;
}
export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Initialize data from localStorage if available (for immediate access)
  const [data, setData] = useState<UserData | null>(() => {
    if (typeof window !== "undefined") {
      const cachedData = localStorage.getItem("userData");
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          return parsedData;
        } catch (e) {
          localStorage.removeItem("userData");
        }
      }
    }
    return null;
  });
  const [auth, setAuth] = useState(() => {
    // Set auth to true if we have cached data
    if (typeof window !== "undefined") {
      const cachedData = localStorage.getItem("userData");
      return !!cachedData;
    }
    return false;
  });
  const [loading, setLoading] = useState(false);

  const sendTokenAndVerify = async () => {
    // Ensure we're on the client side before accessing cookies
    if (typeof window === "undefined" || !Cookies) {
      return;
    }

    try {
      const token = Cookies.get("token");

      if (!token) {
        // Check if there's cached data in localStorage
        const cachedData = localStorage.getItem("userData");
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            setData(parsedData);
            setAuth(true);
          } catch (e) {
            localStorage.removeItem("userData");
          }
        }
        return;
      }

      setLoading(true);
      const res = await axios.get(`${API}/verifytoken`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
     
      if (res.data.success) {
        setAuth(true);
        setData(res.data.data);
        // Update localStorage with fresh data
        if (typeof window !== "undefined") {
          localStorage.setItem("userData", JSON.stringify(res.data.data));
        }
      } else {
        if (typeof window !== "undefined" && Cookies) {
          Cookies.remove("token");
          localStorage.removeItem("userData");
        }
      }
    } catch (error: unknown) {
      console.log(error);

      // Check localStorage as fallback
      const cachedData = localStorage.getItem("userData");
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          setData(parsedData);
          setAuth(true);
        } catch (e) {
          localStorage.removeItem("userData");
        }
      } else {
        // toast wrapper handles SSR safely
        toast.error("Token expired. Please login again.");
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sendTokenAndVerify();
  }, []);

  const contextValue = useMemo(
    () => ({
      data,
      auth,
      setAuth,
      setData,
    }),
    [data, auth]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? (
        <div className="w-full h-screen flex font-semibold justify-center items-center">
          Loading....
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
