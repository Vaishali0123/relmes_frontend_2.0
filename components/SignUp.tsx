"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { User, Mail, Phone, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { API, errorHandler } from "@/app/utils/helpers";
import axios from "axios";
import { useAuthContext, UserData } from "@/app/auth/components/auth";

const SignUp = () => {
  // const navigate = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phone: "",
    type: "",
  });
  const router = useRouter();
  const { setAuth, setData } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  // const [loading, setLoading] = useState(false);
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (
  //     !formData.fullName ||
  //     !formData.userName ||
  //     !formData.email ||
  //     !formData.type
  //   ) {
  //     // toast({
  //     //   title: "Missing Fields",
  //     //   description: "Please fill in all required fields.",
  //     //   variant: "destructive",
  //     // });
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     // Simulate API call - replace with actual implementation
  //     await new Promise((resolve) => setTimeout(resolve, 2000));

  //     // toast({
  //     //   title: "Success!",
  //     //   description: "Account created successfully.",
  //     // });
  //     toast.success("Account created successfully.");

  //     // Navigate to main app or login
  //     router.push("/");
  //   } catch (error) {
  //     // console.error("Error creating account:", error);
  //     toast.error("Error creating account. Please try again.");
  //     // toast({
  //     //   title: "Error",
  //     //   description: "Failed to create account. Please try again.",
  //     //   variant: "destructive",
  //     // });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const cookieSetter = (data: UserData, token: string) => {
    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 15);
      // Cookies.set("token", token, { expires: expirationDate });
      Cookies.set("token", token, {
        expires: expirationDate,
        path: "/",
        // secure: process.env.NODE_ENV === "production", // avoids issues on localhost
        // sameSite: "Lax",
      });

      setData(data);
      setAuth(true);
      toast.success("Login successful!");
      router.push("../");
    } catch (error) {
      console.log(error);
    }
  };
  // const signupHandler = async () => {
  //   try {
  //     setLoading(true);
  //     const formdata = new FormData();
  //     console.log(formData, "formData");
  //     formdata.append("username", formData?.userName);

  //     formdata.append("fullname", formData?.fullName);
  //     if (formData.email) {
  //       formdata.append("email", formData.email); // ✅ Image file is added here
  //     }
  //     if (formData.phone) {
  //       formdata.append("phone", formData.phone); // ✅ Image file is added here
  //     }
  //     // if (formData?.icon) {
  //     //   formData.append("profilePicUrl", formData?.icon); // ✅ Image file is added here
  //     // }
  //     // Make the axios POST request to login with phone number
  //     const response = await axios.post(`${API}/signup`, formData);
  //     console.log(response.data, "response.data");

  //     // Check if the response is successful
  //     if (response.data.success) {
  //       cookieSetter(response.data.data, response.data.access_token);
  //     } else {
  //       // Handle case when login fails, like user not found
  //       toast.error("Seems like you don't have an account in the app.");
  //       router.push("../");
  //     }
  //   } catch (error) {
  //     errorHandler(error);
  //     router.push("../Signup");
  //     setLoading(false);
  //   }
  // };
  const signupHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const fd = new FormData();
      fd.append("fullname", formData.fullName);
      fd.append("username", formData.userName);
      fd.append("email", formData.email);
      if (formData.phone) fd.append("phone", formData.phone);
      fd.append("type", formData.type);

      // If you add profile pic later:
      // if (formData.icon) fd.append("profilePic", formData.icon);

      const response = await axios.post(`${API}/signup`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response?.data, "Res");
      if (response.data.success) {
        cookieSetter(response.data.data, response.data.access_token);
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Join us today and start your journey
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={signupHandler} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="userName"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Username *
                  </Label>
                  <Input
                    id="userName"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.userName}
                    onChange={(e) =>
                      handleInputChange("userName", e.target.value)
                    }
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="type"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    Account Type *
                  </Label>
                  <Select
                    onValueChange={(value) => handleInputChange("type", value)}
                    required
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="enterprise-admin">
                        Enterprise-admin
                      </SelectItem>
                      <SelectItem value="enterprise-member">
                        Enterprise-member
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-medium text-primary hover:underline transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
