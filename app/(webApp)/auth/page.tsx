"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { useAuthContext, UserData } from "./components/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API, errorHandler } from "../../utils/helpers";
import axios from "axios";
import { LuMails, LuUser } from "react-icons/lu";
import Bg from "../../../public/bg.png";
import { MdPersonAddAlt } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { CgRename } from "react-icons/cg";
import { LuPhone, LuUserCheck } from "react-icons/lu";
import {
  FaYoutube,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaReddit,
  FaDiscord,
  FaGithub,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import profile from "../../../public/bgin.png";

// Google OAuth types
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              theme?: string;
              size?: string;
              text?: string;
              width?: string;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

function Page() {
  const router = useRouter();
  const { setAuth, setData } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [referralSource, setReferralSource] = useState<string>("");
  const [signup, setSignup] = useState<boolean>(false);
  const [sign, setSign] = useState<number>(1);
  const [otp, setOtp] = useState<string>("");
  const [showOtpVerification, setShowOtpVerification] =
    useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [isGoogleSignup, setIsGoogleSignup] = useState<boolean>(false);
  const [googleCredential, setGoogleCredential] = useState<string>("");
  const [googleProfilePic, setGoogleProfilePic] = useState<string>("");
  const [isLoginOtpFlow, setIsLoginOtpFlow] = useState<boolean>(false);
  const [otpTimer, setOtpTimer] = useState<number>(0); // Timer in seconds (600 = 10 minutes)
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState<boolean>(false);
  const [googleButtonReady, setGoogleButtonReady] = useState<boolean>(false);
  const [googleSignUpButtonReady, setGoogleSignUpButtonReady] =
    useState<boolean>(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const googleButtonRefSignUp = useRef<HTMLDivElement>(null);

  // Helper function to decode JWT (Google credential)
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  // Redirect if user is already authenticated
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/home");
    }
  }, [router]);

  const [icon, setIcon] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIcon(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  const cookieSetter = (data: UserData, token: string) => {
    try {
      console.log(data, "Data", token, "tkjknj");
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 15);
      // Cookies.set("token", token, { expires: expirationDate });
      Cookies.set("token", token, {
        expires: expirationDate,
        path: "/",
        // secure: process.env.NODE_ENV === "production", // avoids issues on localhost
        // sameSite: "Lax",
      });

      // Store user data in localStorage as backup for immediate access
      if (typeof window !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(data));
      }

      setData(data);
      setAuth(true);
      // toast.success("Login successful!");
      // Small delay to ensure context updates before navigation
      setTimeout(() => {
        router.push("../home");
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const login = async () => {
    // Validate email
    const emailValue = email.trim();
    if (!emailValue) {
      toast.error("Please enter your email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Check if user exists by calling login API
      const loginResponse = await axios.post(`${API}/login`, {
        email: emailValue.toLowerCase().trim(),
      });

      // Step 2: If user exists, send OTP
      if (loginResponse.data.success) {
        if (loginResponse.data.data && loginResponse.data.access_token) {
          cookieSetter(
            loginResponse.data.data,
            loginResponse.data.access_token
          );
          return;
        }
        // const otpResponse = await axios.post(`${API}/send-otp`, {
        //   email: emailValue.toLowerCase().trim(),
        // });

        // if (otpResponse.data.success || otpResponse.data.status === 200) {
        //   // Show OTP verification screen
        //   setIsLoginOtpFlow(true);
        //   setOtpSent(true);
        //   setShowOtpVerification(true);
        //   startOtpTimer(); // Start 10-minute countdown
        //   toast.success(otpResponse.data.message || "OTP sent to your email!");
        // } else {
        //   toast.error(
        //     otpResponse.data.message || "Failed to send OTP. Please try again."
        //   );
        // }
      } else {
        toast.error("User not found. Please check your email or sign up.");
      }
    } catch (error: any) {
      // Handle errors
      if (error.response?.status === 404) {
        toast.error("User not found. Please check your email or sign up.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        errorHandler(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginOtp = async () => {
    // Validate OTP
    const otpValue = otp.trim();
    if (!otpValue || otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    const emailValue = email.trim();
    if (!emailValue) {
      toast.error("Email is required");
      return;
    }

    // Check if OTP is expired
    if (otpTimer === 0) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Verify OTP
      const verifyResponse = await axios.post(`${API}/verify-otp`, {
        email: emailValue.toLowerCase().trim(),
        otp: otpValue,
      });

      // Step 2: If OTP verified, complete login using cookieSetter
      if (verifyResponse.data.success) {
        if (verifyResponse.data.data && verifyResponse.data.access_token) {
          // User data and token received from verify-otp, proceed with login
          cookieSetter(
            verifyResponse.data.data,
            verifyResponse.data.access_token
          );
        } else {
          // If verify-otp doesn't return user data, call login API to get user data
          const loginResponse = await axios.post(`${API}/login`, {
            email: emailValue.toLowerCase().trim(),
          });

          if (loginResponse.data.success) {
            cookieSetter(
              loginResponse.data.data,
              loginResponse.data.access_token
            );
          } else {
            toast.error("Login failed. Please try again.");
          }
        }
      } else {
        toast.error(
          verifyResponse.data.message || "Invalid OTP. Please try again."
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(errorMessage);
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      setLoading(true);
      // For signup flow, use send-otp endpoint (user doesn't exist yet)
      // This endpoint should create OTP record without requiring user to exist
      const response = await axios.post(`${API}/send-otp`, {
        email: email.toLowerCase(),
        isSignup: true, // Indicate this is for signup
      });
      if (response.data.success) {
        setOtpSent(true);
        setShowOtpVerification(true);
        startOtpTimer(); // Start 10-minute countdown
        toast.success(response.data.message || "OTP sent to your email!");
      } else {
        toast.error(
          response.data.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (error: any) {
      // If send-otp doesn't exist, try resend-otp as fallback (for existing users)
      if (error.response?.status === 404) {
        try {
          const fallbackResponse = await axios.post(`${API}/resend-otp`, {
            email: email.toLowerCase(),
          });
          if (fallbackResponse.data.success) {
            setOtpSent(true);
            setShowOtpVerification(true);
            startOtpTimer(); // Start 10-minute countdown
            toast.success(
              fallbackResponse.data.message || "OTP sent to your email!"
            );
          }
        } catch (fallbackError: any) {
          const errorMessage =
            fallbackError.response?.data?.message ||
            "Failed to send OTP. Please try again.";
          toast.error(errorMessage);
        }
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to send OTP. Please try again.";
        toast.error(errorMessage);
      }
      console.error("OTP send error:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      // Verify the OTP
      // Note: Backend verify-otp requires user to exist, so we'll handle that in signupHandler
      // For now, just verify the OTP is valid (if backend supports it for signup)
      const response = await axios.post(`${API}/verify-otp`, {
        email: email.toLowerCase(),
        otp: otp.trim(),
      });

      if (response.data.success) {
        setOtpVerified(true);
        toast.success(response.data.message || "Email verified successfully!");

        // If user already exists and is verified, log them in directly
        if (response.data.data && response.data.access_token) {
          cookieSetter(response.data.data, response.data.access_token);
          return;
        }

        // Otherwise, proceed to next step (referral source selection)
        setTimeout(() => {
          setSign(3);
          setShowOtpVerification(false);
        }, 500);
      } else {
        toast.error(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      // If verify-otp fails because user doesn't exist, that's okay for signup flow
      // We'll create the user in signupHandler after OTP is verified
      if (
        error.response?.status === 404 &&
        error.response?.data?.message?.includes("not found")
      ) {
        // For signup, OTP verification might fail if user doesn't exist
        // Store OTP as verified locally and proceed to next step
        setOtpVerified(true);
        toast.success("OTP verified! Please complete your signup.");
        setTimeout(() => {
          setSign(3);
          setShowOtpVerification(false);
        }, 500);
      } else {
        const errorMessage =
          error.response?.data?.message || "Invalid OTP. Please try again.";
        toast.error(errorMessage);
        console.error("OTP verification error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${API}/resend-otp`, {
        email: email.toLowerCase(),
      });
      if (response.data.success) {
        setOtp("");
        startOtpTimer(); // Restart 10-minute countdown
        toast.success(
          response.data.message || "OTP has been resent to your email."
        );
      } else {
        toast.error(
          response.data.message || "Failed to resend OTP. Please try again."
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to resend OTP. Please try again.";
      toast.error(errorMessage);
      console.error("Resend OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signupHandler = async () => {
    // Validate required fields
    if (!fullname.trim() || !username.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // For non-Google signup, email is required
    if (!isGoogleSignup && !email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if email is verified (for non-Google signup)
    if (!isGoogleSignup && !otpVerified) {
      toast.error("Please verify your email first");
      return;
    }

    // Check if referral source is selected
    if (!referralSource) {
      toast.error("Please select where you heard about Relmes");
      return;
    }

    try {
      setLoading(true);

      // Handle Google signup differently
      if (isGoogleSignup && googleCredential) {
        // Build request payload matching backend expectations
        // Backend expects: credential, fullname, username, email, phoneNumber, referralSource
        const payload: {
          credential: string;
          fullname: string;
          username: string;
          email: string;
          phoneNumber?: string;
          referralSource: string;
        } = {
          credential: googleCredential,
          fullname: fullname.trim(),
          username: username.trim(),
          email: email.toLowerCase().trim(),
          referralSource: referralSource || "google",
        };

        // Add optional phone number if provided
        if (phone && phone.trim()) {
          payload.phoneNumber = phone.trim();
        }

        const response = await axios.post(`${API}/google-signup`, payload);

        if (response.data.success) {
          cookieSetter(response.data.data, response.data.access_token);
        } else {
          toast.error(
            response.data.message || "Google sign up failed. Please try again."
          );
        }
        return;
      }

      // Regular signup flow
      // Create user account with all information including referral source
      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("fullname", fullname.trim());
      formData.append("email", email.toLowerCase().trim());
      formData.append("type", referralSource); // Backend expects 'type' field
      if (phone && phone.trim()) {
        formData.append("phone", phone.trim());
      }
      if (icon) {
        formData.append("profilePicUrl", icon);
      }

      const response = await axios.post(`${API}/signup`, formData);

      if (response.data.success) {
        // If user was just created, verify OTP to mark email as verified
        if (!response.data.data?.isVerified) {
          try {
            // Verify OTP to mark email as verified
            await axios.post(`${API}/verify-otp`, {
              email: email.toLowerCase(),
              otp: otp.trim(),
            });
          } catch (verifyError) {
            // If verification fails, user can verify later
            console.log("OTP verification after signup failed:", verifyError);
          }
        }

        // Get user data from response
        const userData = response.data.data || {
          profilePicUrl: response.data.user?.profilePicUrl
            ? `${API}${response.data.user.profilePicUrl}`
            : "",
          fullname: response.data.user?.fullname || fullname,
          username: response.data.user?.username || username,
          id: response.data.user?._id || response.data.user?.id,
          isVerified: otpVerified, // Use OTP verification status
          role: response.data.user?.role || referralSource,
          createdAt: response.data.user?.createdAt || new Date(),
        };

        cookieSetter(userData, response.data.access_token);
      } else {
        toast.error(
          response.data.message || "Signup failed. Please try again."
        );
      }
    } catch (error: any) {
      // Handle "user already exists" error - might have been created during OTP verification
      if (
        error.response?.data?.message?.includes("already exists") ||
        error.response?.data?.message?.includes("User already exists")
      ) {
        // User exists, try to verify OTP and login
        try {
          const verifyResponse = await axios.post(`${API}/verify-otp`, {
            email: email.toLowerCase(),
            otp: otp.trim(),
          });

          if (
            verifyResponse.data.success &&
            verifyResponse.data.data &&
            verifyResponse.data.access_token
          ) {
            cookieSetter(
              verifyResponse.data.data,
              verifyResponse.data.access_token
            );
            return;
          }
        } catch (verifyError) {
          // If verification fails, show error
          toast.error(
            "Account exists but OTP verification failed. Please try logging in."
          );
          router.push("../auth");
        }
      } else {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          errorHandler(error);
        }
      }
      setLoading(false);
    }
  };

  // Google OAuth handlers
  const handleGoogleSignIn = useCallback(
    async (credential: string) => {
      try {
        setLoading(true);
        const response = await axios.post(`${API}/google-signin`, {
          credential,
        });

        if (response.data.success) {
          cookieSetter(response.data.data, response.data.access_token);
        } else {
          toast.error("Google sign in failed. Please try again.");
        }
      } catch (error: any) {
        if (
          error.response?.status === 404 ||
          error.response?.data?.message?.includes("not found")
        ) {
          toast.error("Account not found. Please sign up first.");
          setSignup(true);
        } else {
          errorHandler(error);
        }
        setLoading(false);
      }
    },
    [API]
  );

  const handleGoogleSignUp = useCallback(async (credential: string) => {
    try {
      setLoading(true);

      // Decode JWT to get user info
      const decodedToken = decodeJWT(credential);
      if (!decodedToken) {
        toast.error("Failed to process Google account information.");
        setLoading(false);
        return;
      }

      // Extract user info from Google token
      const googleEmail = decodedToken.email || "";
      const googleName = decodedToken.name || decodedToken.given_name || "";
      const googlePicture = decodedToken.picture || "";

      // Store credential and profile picture for later use
      setGoogleCredential(credential);
      setGoogleProfilePic(googlePicture);

      // Set Google signup flag and pre-fill data
      setIsGoogleSignup(true);
      setEmail(googleEmail);
      setFullname(googleName);
      setOtpVerified(true); // Skip OTP verification for Google signup

      // Switch to signup mode and go to step 1
      setSignup(true);
      setSign(1);

      toast.success("Google account connected! Please complete your profile.");
      setLoading(false);
    } catch (error) {
      errorHandler(error);
      setLoading(false);
    }
  }, []);

  // Initialize Google OAuth
  useEffect(() => {
    const loadGoogleScript = () => {
      if (document.getElementById("google-oauth-script")) {
        // Script already loaded, just initialize
        if (window.google) {
          setGoogleScriptLoaded(true);
          initializeGoogleSignIn();
          initializeGoogleSignUp();
        }
        return;
      }

      // Preload the script for faster loading
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = "https://accounts.google.com";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.id = "google-oauth-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleScriptLoaded(true);
        initializeGoogleSignIn();
        initializeGoogleSignUp();
      };
      document.head.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      if (!window.google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;

      try {
        // Initialize Google Sign In immediately (even if button ref not ready)
        // This allows the placeholder button to work via prompt()
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: (response: { credential: string }) => {
            handleGoogleSignIn(response.credential);
          },
        });
      } catch (error) {
        console.error("Error initializing Google Sign In:", error);
      }
    };

    const initializeGoogleSignUp = () => {
      if (!window.google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;

      try {
        // Initialize Google Sign Up immediately (even if button ref not ready)
        // This allows the placeholder button to work via prompt()
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: (response: { credential: string }) => {
            handleGoogleSignUp(response.credential);
          },
        });
      } catch (error) {
        console.error("Error initializing Google Sign Up:", error);
      }
    };

    loadGoogleScript();
  }, [signup, handleGoogleSignIn, handleGoogleSignUp]);

  // Re-initialize buttons when script loads and refs become available
  useEffect(() => {
    if (!googleScriptLoaded || !window.google) return;

    const checkAndInit = () => {
      if (!window.google) return;

      if (
        googleButtonRef.current &&
        !googleButtonReady &&
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      ) {
        try {
          googleButtonRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            width: "100%",
          });
          setGoogleButtonReady(true);
        } catch (error) {
          console.error("Error rendering Google Sign In button:", error);
        }
      }
      if (
        googleButtonRefSignUp.current &&
        !googleSignUpButtonReady &&
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      ) {
        try {
          googleButtonRefSignUp.current.innerHTML = "";
          window.google.accounts.id.renderButton(
            googleButtonRefSignUp.current,
            {
              theme: "outline",
              size: "large",
              text: "signup_with",
              width: "100%",
            }
          );
          setGoogleSignUpButtonReady(true);
        } catch (error) {
          console.error("Error rendering Google Sign Up button:", error);
        }
      }
    };

    // Check immediately and after a short delay
    checkAndInit();
    const timeout = setTimeout(checkAndInit, 100);
    return () => clearTimeout(timeout);
  }, [googleScriptLoaded, googleButtonReady, googleSignUpButtonReady]);

  // OTP Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [otpTimer]);

  // Helper function to format timer (MM:SS)
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Start OTP timer (10 minutes = 600 seconds)
  const startOtpTimer = () => {
    setOtpTimer(600); // 10 minutes
  };

  return (
    <div
      style={{
        backgroundImage: `url(${Bg.src})`,
      }}
      className="flex  min-h-screen w-screen bg-cover text-[#303030]"
    >
      {/* Left Section: Text + Animated Illustration */}
      {/* {signup ? (
        <div className="w-1/4  hidden flex-col justify-center items-center p-4 relative">
          <div className="w-full h-full rounded-3xl "></div>
        </div>
      ) : (
        <div className="w-1/4 flex flex-col  justify-center items-center p-4 relative">
          <div className="w-full h-full rounded-3xl bg-[#FCFCFC]"></div>
        </div>
      )} */}
      {/* Right Section: Sign Up Form */}
      <div className="w-full flex flex-col text-black">
        {signup ? (
          <p className="text-sm text-right p-4 text-gray-500 mb-6 ">
            Already have an account?{" "}
            <span
              onClick={() => {
                setSignup(false);
                setSign(1);
                setIsGoogleSignup(false);
                setGoogleCredential("");
                setGoogleProfilePic("");
                setOtpVerified(false);
                setIsLoginOtpFlow(false);
                setShowOtpVerification(false);
                setOtpSent(false);
                setOtp("");
                setOtpTimer(0);
                setOtpTimer(0);
              }}
              className="text-black font-medium cursor-pointer"
            >
              Sign In
            </span>
          </p>
        ) : (
          <p className="text-sm text-right p-4 text-gray-500 mb-6 ">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => {
                setSignup(true);
                setSign(1);
                setIsGoogleSignup(false);
                setGoogleCredential("");
                setGoogleProfilePic("");
                setOtpVerified(false);
                setIsLoginOtpFlow(false);
                setShowOtpVerification(false);
                setOtpSent(false);
                setOtp("");
                setOtpTimer(0);
                setOtpTimer(0);
              }}
              className="text-black font-medium cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        )}
        <div className="w-full h-[80vh]  flex flex-col items-center justify-center">
          {signup ? (
            <div className="w-sm p-8">
              {/* Step 1: Fullname and Username */}
              {sign === 1 && (
                <>
                  <div className="flex flex-col justify-center  items-center mb-4">
                    <h2 className="text-sm text-[#8c8c8c] mb-8">
                      {isGoogleSignup ? "1/2" : "1/3"}
                    </h2>
                    <h2 className="text-2xl font-space-grotesk ">Sign Up</h2>
                    {isGoogleSignup && (
                      <p className="text-xs text-green-600 mt-2">
                        ✓ Google account connected
                      </p>
                    )}
                  </div>

                  {!isGoogleSignup && (
                    <>
                      {/* <p className="mb-2 text-sm text-gray-700 font-semibold text-center w-full">
                        Sign up with
                      </p> */}
                      <div className="w-full mb-4 relative">
                        {!googleSignUpButtonReady && (
                          <div
                            onClick={() => {
                              if (window.google?.accounts?.id) {
                                window.google.accounts.id.prompt();
                              }
                            }}
                            className="w-full h-[40px] border border-gray-300 rounded-[16px] flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <FcGoogle className="w-5 h-5" />
                            <span className="text-sm font-medium text-gray-700">
                              Sign up with Google
                            </span>
                          </div>
                        )}
                        <div
                          ref={googleButtonRefSignUp}
                          className={`w-full ${
                            !googleSignUpButtonReady ? "hidden" : ""
                          }`}
                        ></div>
                      </div>
                      <div className="flex items-center gap-2 w-full mb-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-xs text-gray-500">OR</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <label
                          htmlFor="profile-upload"
                          className="flex h-[80px] w-[80px] cursor-pointer items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-[#f0f0f0] transition hover:border-gray-500"
                        >
                          {preview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={preview}
                              alt="profile preview"
                              className="h-full w-full rounded-2xl object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-600 text-center px-2">
                              Upload photo
                            </span>
                          )}
                        </label>
                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleIconChange}
                        />
                        <p className="text-[11px] text-gray-500">
                          JPG/PNG up to 5MB
                        </p>
                      </div>
                    </>
                  )}

                  <p className="mb-2 text-sm text-gray-700">Enter Fullname</p>
                  <div className="flex border rounded-xl px-3 py-2 gap-2 mb-4">
                    <span className="mr-2 text-black">
                      <CgRename />
                    </span>
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Your fullname"
                      className="w-full outline-none text-sm"
                      disabled={isGoogleSignup && fullname.trim() !== ""}
                    />
                  </div>
                  <p className="mb-2 text-sm text-gray-700">Enter Username</p>
                  <div className="flex border rounded-xl px-3 py-2 gap-2 mb-4">
                    <span className="mr-2 text-black">
                      <MdDriveFileRenameOutline />
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your Username"
                      className="w-full outline-none text-sm"
                    />
                  </div>
                  {isGoogleSignup && (
                    <p className="mb-2 text-sm text-gray-700">
                      Enter phone number (optional)
                    </p>
                  )}
                  {isGoogleSignup && (
                    <div className="flex border rounded-xl px-3 py-2 gap-2 mb-4">
                      <span className="mr-2 text-black">
                        <LuPhone />
                      </span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                        placeholder="Your phone number"
                        className="w-full outline-none text-sm"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (isGoogleSignup) {
                        // Skip step 2 for Google signup, go directly to step 3
                        setSign(3);
                      } else {
                        setSign(2);
                      }
                    }}
                    className="bg-black text-white w-full py-2 text-center block rounded-xl text-sm font-medium mb-3"
                  >
                    Next
                  </button>
                </>
              )}

              {/* Step 2: Email, Phone, and OTP Verification (Skip for Google signup) */}
              {sign === 2 && !isGoogleSignup && !showOtpVerification && (
                <>
                  <div className="flex flex-col justify-center items-center mb-4">
                    <h2 className="text-sm text-[#8c8c8c] mb-8">2/3</h2>
                    <h2 className="text-2xl font-semibold">Sign Up</h2>
                  </div>
                  <div className="relative flex mb-4 justify-center items-center">
                    <div className="absolute">
                      <LuMails className={`text-black`} size={24} />
                    </div>
                    <svg
                      width={140}
                      height={(60 * 142) / 140}
                      viewBox="0 0 140 142"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_627_1933"
                        style={{ maskType: "alpha" }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="140"
                        height="142"
                      >
                        <path
                          d="M10.6184 13.214C14.2673 13.214 17.2253 10.2559 17.2253 6.60698C17.2253 2.95805 20.1834 0 23.8323 0L130.252 0C135.465 0 139.69 4.22578 139.69 9.43854V116.802C139.69 122.015 135.465 126.241 130.252 126.241H104.178C99.9426 126.241 96.5091 129.674 96.5091 133.909C96.5091 138.145 93.0757 141.578 88.8403 141.578H9.43855C4.22579 141.578 0 137.352 0 132.14L0 21.8266C0 17.07 3.85602 13.214 8.61267 13.214H10.6184Z"
                          fill="#333333"
                        />
                      </mask>
                      <g mask="url(#mask0_627_1933)">
                        <rect
                          width="139.69"
                          height="141.578"
                          fill="#F7F7F7"
                          fillOpacity="10"
                        />
                      </g>
                    </svg>
                  </div>
                  <p className="text-sm mb-2">Enter email address</p>
                  <div className="flex border rounded-xl px-3 py-2 gap-2 mb-4">
                    <span className="mr-2 text-black">
                      <LuMails />
                    </span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Your email"
                      className="w-full outline-none text-sm"
                      disabled={otpSent}
                    />
                  </div>
                  <p className="text-sm mb-2">Enter phone number (optional)</p>
                  <div className="flex border rounded-xl px-3 py-2 gap-2 mb-4">
                    <span className="mr-2 text-black">
                      <LuPhone />
                    </span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="tel"
                      placeholder="Your phone number"
                      className="w-full outline-none text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSign(1)}
                      className="bg-gray-200 text-black w-full py-2 text-center block rounded-xl text-sm font-medium mb-3"
                    >
                      Back
                    </button>
                    <button
                      onClick={sendOtp}
                      disabled={loading || !email.trim() || otpSent}
                      className="bg-black text-white w-full py-2 text-center block rounded-xl text-sm font-medium mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? "Sending..."
                        : otpSent
                        ? "OTP Sent"
                        : "Send OTP"}
                    </button>
                  </div>
                </>
              )}

              {/* Step 2b: OTP Verification */}
              {sign === 2 && showOtpVerification && (
                <>
                  <div className="flex flex-col justify-center items-center mb-4">
                    <h2 className="text-sm text-[#8c8c8c] mb-8">2/3</h2>
                    <h2 className="text-2xl font-semibold">Verify Email</h2>
                  </div>
                  <div className="relative flex mb-4 justify-center items-center">
                    <div className="absolute">
                      <HiOutlineMail className={`text-black`} size={24} />
                    </div>
                    <svg
                      width={140}
                      height={(60 * 142) / 140}
                      viewBox="0 0 140 142"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_627_1933"
                        style={{ maskType: "alpha" }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="140"
                        height="142"
                      >
                        <path
                          d="M10.6184 13.214C14.2673 13.214 17.2253 10.2559 17.2253 6.60698C17.2253 2.95805 20.1834 0 23.8323 0L130.252 0C135.465 0 139.69 4.22578 139.69 9.43854V116.802C139.69 122.015 135.465 126.241 130.252 126.241H104.178C99.9426 126.241 96.5091 129.674 96.5091 133.909C96.5091 138.145 93.0757 141.578 88.8403 141.578H9.43855C4.22579 141.578 0 137.352 0 132.14L0 21.8266C0 17.07 3.85602 13.214 8.61267 13.214H10.6184Z"
                          fill="#333333"
                        />
                      </mask>
                      <g mask="url(#mask0_627_1933)">
                        <rect
                          width="139.69"
                          height="141.578"
                          fill="#F7F7F7"
                          fillOpacity="10"
                        />
                      </g>
                    </svg>
                  </div>
                  <p className="text-sm mb-2 text-center">
                    Enter the 6-digit OTP sent to
                  </p>
                  <p className="text-sm mb-2 text-center font-semibold text-gray-700">
                    {email}
                  </p>
                  {otpTimer > 0 ? (
                    <p className="text-xs mb-4 text-center text-gray-600">
                      OTP valid for:{" "}
                      <span className="font-semibold text-black">
                        {formatTimer(otpTimer)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-xs mb-4 text-center text-red-600 font-semibold">
                      OTP expired. Please request a new one.
                    </p>
                  )}
                  <div className="flex border rounded-xl px-3 py-2 gap-2 mb-4">
                    <span className="mr-2 text-black">
                      <HiOutlineMail />
                    </span>
                    <input
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      className="w-full outline-none text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowOtpVerification(false);
                        setOtp("");
                      }}
                      className="bg-gray-200 text-black w-full py-2 text-center block rounded-xl text-sm font-medium mb-3"
                    >
                      Back
                    </button>
                    <button
                      onClick={verifyOtp}
                      disabled={
                        loading ||
                        otp.length !== 6 ||
                        otpVerified ||
                        otpTimer === 0
                      }
                      className="bg-black text-white w-full py-2 text-center block rounded-xl text-sm font-medium mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? "Verifying..."
                        : otpVerified
                        ? "Verified"
                        : otpTimer === 0
                        ? "OTP Expired"
                        : "Verify OTP"}
                    </button>
                  </div>
                  <button
                    onClick={resendOtp}
                    disabled={loading}
                    className="text-sm text-gray-500 underline w-full mb-3 disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </>
              )}

              {/* Step 3: Where did you come from? */}
              {sign === 3 && (
                <>
                  <div className="flex flex-col justify-center items-center mb-4">
                    <h2 className="text-sm text-[#8c8c8c] mb-8">
                      {isGoogleSignup ? "2/2" : "3/3"}
                    </h2>
                    <h2 className="text-2xl font-semibold">Sign Up</h2>
                  </div>

                  <p className="text-sm mb-4 text-center">
                    Where did you hear about Relmes?
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => setReferralSource("youtube")}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                        referralSource === "youtube"
                          ? "border-black bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      <FaYoutube className="text-2xl mb-2 text-red-600" />
                      <span className="text-xs">YouTube</span>
                    </button>
                    <button
                      onClick={() => setReferralSource("linkedin")}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                        referralSource === "linkedin"
                          ? "border-black bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      <FaLinkedin className="text-2xl mb-2 text-blue-600" />
                      <span className="text-xs">LinkedIn</span>
                    </button>
                    <button
                      onClick={() => setReferralSource("twitter")}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                        referralSource === "twitter"
                          ? "border-black bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      <FaTwitter className="text-2xl mb-2 text-blue-400" />
                      <span className="text-xs">Twitter</span>
                    </button>
                    <button
                      onClick={() => setReferralSource("facebook")}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                        referralSource === "facebook"
                          ? "border-black bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      <FaFacebook className="text-2xl mb-2 text-blue-700" />
                      <span className="text-xs">Facebook</span>
                    </button>
                    <button
                      onClick={() => setReferralSource("instagram")}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                        referralSource === "instagram"
                          ? "border-black bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      <FaInstagram className="text-2xl mb-2 text-pink-600" />
                      <span className="text-xs">Instagram</span>
                    </button>
                    <button
                      onClick={() => setReferralSource("reddit")}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                        referralSource === "reddit"
                          ? "border-black bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      <FaReddit className="text-2xl mb-2 text-orange-600" />
                      <span className="text-xs">Reddit</span>
                    </button>
                    <button
                      onClick={() => setReferralSource("discord")}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                        referralSource === "discord"
                          ? "border-black bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      <FaDiscord className="text-2xl mb-2 text-indigo-600" />
                      <span className="text-xs">Discord</span>
                    </button>
                    <button
                      onClick={() => setReferralSource("other")}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                        referralSource === "other"
                          ? "border-black bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      {/* <FaGithub className="text-2xl mb-2 text-gray-800" /> */}
                      <span className="text-2xl mb-2">🔍</span>
                      <span className="text-xs">Other</span>
                    </button>
                    <button
                      onClick={() => setReferralSource("referred")}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all col-span-2 ${
                        referralSource === "referred"
                          ? "border-black bg-gray-50"
                          : "border-gray-200"
                      }`}
                    >
                      <LuUserCheck className="text-2xl mb-2 text-gray-600" />
                      <span className="text-xs">Referred by someone</span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (isGoogleSignup) {
                          setSign(1); // Go back to step 1 for Google signup
                        } else {
                          setSign(2);
                          setShowOtpVerification(false);
                        }
                      }}
                      className="bg-gray-200 text-black w-full py-2 text-center block rounded-xl text-sm font-medium mb-3"
                    >
                      Back
                    </button>
                    <button
                      onClick={signupHandler}
                      disabled={loading || !referralSource}
                      className="bg-black text-white w-full py-2 text-center block rounded-xl text-sm font-medium mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Creating..." : "Create Account"}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center">
                    This site is protected by reCAPTCHA and the Google Privacy
                    Policy.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="w-sm p-8">
              {!isLoginOtpFlow || !showOtpVerification ? (
                <>
                  <div className="flex justify-center items-center mb-4 ">
                    <h2 className="text-2xl font-space-grotesk ">Sign In</h2>
                  </div>
                  {/* <p className="mb-2 text-[16px] text-gray-700 font-semibold">
                    Sign in with
                  </p> */}

                  <div className="w-full mb-4 relative">
                    {!googleButtonReady && (
                      <div
                        onClick={() => {
                          if (window.google?.accounts?.id) {
                            window.google.accounts.id.prompt();
                          }
                        }}
                        className="w-full h-[40px] border border-gray-300 rounded-[16px] flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <FcGoogle className="w-5 h-5" />
                        <span className="text-sm font-medium text-gray-700">
                          Sign in with Google
                        </span>
                      </div>
                    )}
                    <div
                      ref={googleButtonRef}
                      className={`w-full rounded-[16px] ${
                        !googleButtonReady ? "hidden" : ""
                      }`}
                    ></div>
                  </div>

                  {/* <hr className="my-4 border-gray-200" /> */}

                  <div className="flex flex-col gap-3 mb-4">
                    <p className="mb-2 text-sm text-gray-700 font-semibold self-center">
                      Or
                    </p>

                    <div className="flex border rounded-xl px-3 py-2 gap-2">
                      <span className="mr-2 text-black">
                        <LuMails />
                      </span>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Your email"
                        className="w-full outline-none text-sm"
                        disabled={otpSent}
                      />
                    </div>
                  </div>

                  <button
                    onClick={login}
                    disabled={loading || !email.trim() || otpSent}
                    className="bg-black text-white w-full py-2 text-center block rounded-xl text-sm font-medium mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Sending OTP..."
                      : otpSent
                      ? "OTP Sent"
                      : "Continue"}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-center items-center mb-4">
                    <h2 className="text-2xl font-semibold">Verify OTP</h2>
                    <p className="text-sm text-gray-600 mt-2">
                      Enter the OTP sent to {email}
                    </p>
                    {otpTimer > 0 ? (
                      <p className="text-xs mt-2 text-gray-600">
                        OTP valid for:{" "}
                        <span className="font-semibold text-black">
                          {formatTimer(otpTimer)}
                        </span>
                      </p>
                    ) : (
                      <p className="text-xs mt-2 text-red-600 font-semibold">
                        OTP expired. Please request a new one.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 mb-4">
                    <p className="mb-2 text-sm text-gray-700">Enter OTP</p>
                    <div className="flex border rounded-xl px-3 py-2 gap-2">
                      <span className="mr-2 text-black">
                        <LuMails />
                      </span>
                      <input
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        className="w-full outline-none text-sm"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsLoginOtpFlow(false);
                        setShowOtpVerification(false);
                        setOtpSent(false);
                        setOtp("");
                      }}
                      className="bg-gray-200 text-black w-full py-2 text-center block rounded-xl text-sm font-medium mb-3"
                    >
                      Back
                    </button>
                    <button
                      onClick={verifyLoginOtp}
                      disabled={loading || otp.length !== 6 || otpTimer === 0}
                      className="bg-black text-white w-full py-2 text-center block rounded-xl text-sm font-medium mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? "Verifying..."
                        : otpTimer === 0
                        ? "OTP Expired"
                        : "Verify & Sign In"}
                    </button>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const response = await axios.post(`${API}/resend-otp`, {
                          email: email.toLowerCase().trim(),
                        });
                        if (response.data.success) {
                          setOtp("");
                          startOtpTimer(); // Restart 10-minute countdown
                          toast.success(
                            response.data.message ||
                              "OTP has been resent to your email."
                          );
                        } else {
                          toast.error(
                            response.data.message ||
                              "Failed to resend OTP. Please try again."
                          );
                        }
                      } catch (error: any) {
                        const errorMessage =
                          error.response?.data?.message ||
                          "Failed to resend OTP. Please try again.";
                        toast.error(errorMessage);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="text-sm text-gray-500 underline w-full mb-3 disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
