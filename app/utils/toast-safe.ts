// Safe wrapper for react-hot-toast that only works on client side
"use client";

import React, { ComponentType, useEffect, useState } from "react";

// Create a no-op toast for SSR
const noOpToast = {
  success: () => "",
  error: () => "",
  loading: () => "",
  promise: () => Promise.resolve(),
  custom: () => "",
  dismiss: () => {},
} as const;

// Cache for the toast module
let toastModuleCache: any = null;
let toasterComponentCache: ComponentType<any> | null = null;

// Lazy load react-hot-toast only on client side when actually called
const getToast = () => {
  if (typeof window === "undefined") {
    return noOpToast;
  }
  
  if (toastModuleCache) {
    return toastModuleCache;
  }
  
  // Only load when actually needed on client
  try {
    // Dynamic import that's truly lazy - only when function is called
    toastModuleCache = (window as any).__REACT_HOT_TOAST__;
    if (!toastModuleCache) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      toastModuleCache = require("react-hot-toast");
      toastModuleCache = toastModuleCache.default || toastModuleCache;
      (window as any).__REACT_HOT_TOAST__ = toastModuleCache;
    }
    return toastModuleCache;
  } catch {
    return noOpToast;
  }
};

// Create a proxy that lazily loads the toast module only when methods are called
export const toast = new Proxy(noOpToast, {
  get(_target, prop: string | symbol) {
    // Don't try to load on server
    if (typeof window === "undefined") {
      return () => {};
    }
    
    const toastInstance = getToast();
    const method = toastInstance[prop as keyof typeof toastInstance];
    if (typeof method === "function") {
      return (...args: any[]) => {
        if (typeof window === "undefined") return;
        return method.apply(toastInstance, args);
      };
    }
    return method;
  },
}) as unknown as typeof import("react-hot-toast").default;

// Toaster component that only renders on client after mount
export const Toaster: ComponentType<any> = (props: any) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted || typeof window === "undefined") {
    return null;
  }
  
  if (!toasterComponentCache) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const module = require("react-hot-toast");
      toasterComponentCache = module.Toaster;
    } catch {
      return null;
    }
  }
  
  if (!toasterComponentCache) {
    return null;
  }
  
  return React.createElement(toasterComponentCache, props);
};

