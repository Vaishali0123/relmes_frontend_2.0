"use client";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

// Client-side wrapper for AuthContextProvider
const AuthContextProvider = dynamic(
  () => import("./auth").then((mod) => ({ default: mod.AuthContextProvider })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex font-semibold justify-center items-center">
        Loading....
      </div>
    )
  }
);

export default function AuthProviderWrapper({ children }: { children: ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}

