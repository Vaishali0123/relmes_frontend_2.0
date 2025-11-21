"use client";
import React, { useState } from "react";
import axios from "axios";

import toast, { Toaster } from "react-hot-toast";
import { Camera, Check, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { API } from "@/app/utils/helpers";
import { useAuthContext } from "@/app/(webApp)/auth/components/auth"
import Bg from "@/public/Vector.svg"


type Plugin = {
  type: string;
  validity: number;
};

interface UserData {
  id: string;
  fullname: string;
  username: string;
  profilePicUrl: string;
}

// Mock user data - replace with your auth context
const mockUserData: UserData = {
  id: "user123",
  fullname: "John Doe",
  username: "johndoe",
  profilePicUrl: "/placeholder.svg",
};

// Replace with your API URL

const ServerCreation = () => {
  const navigate = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validity, setValidity] = useState(0);
  const [amount, setAmount] = useState(0);
  const [storageAllotted, setStorageAllotted] = useState(0);
  const [icon, setIcon] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedPlugins, setSelectedPlugins] = useState<Plugin[]>([]);
  const { data } = useAuthContext(); // Assuming you have a context to get user data
  // Using mock data - replace with actual auth context
  const userData = mockUserData;

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIcon(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const selectStoragePlan = (storage: number, price: number, days: number) => {
    setStorageAllotted(storage);
    setValidity(days);
    setAmount(price);
  };

  const addOrUpdatePlugin = (
    type: string,
    serverValidity: number,
    price: number
  ) => {
    if (serverValidity > validity) {
      toast.error("Plugin validity cannot exceed server validity");
      return;
    }

    setSelectedPlugins((prev) => {
      const exists = prev.find((p) => p.type === type);
      if (exists) {
        return prev.map((p) =>
          p.type === type ? { ...p, validity: serverValidity } : p
        );
      } else {
        return [...prev, { type, validity: serverValidity }];
      }
    });
    setAmount((prev) => prev + price);
  };

  const removePlugin = (type: string, price: number) => {
    setSelectedPlugins((prev) => prev.filter((p) => p.type !== type));
    setAmount((prev) => prev - price);
  };

  const createServer = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("storageallotted", storageAllotted.toString());
      if (data?.id) {
        formData.append("ownerId", data?.id);
      }
      formData.append("validity", validity.toString());
      formData.append("amount", amount.toString());
      formData.append("plugin", JSON.stringify(selectedPlugins));

      if (icon) {
        formData.append("icon", icon);
      }

      const res = await axios.post(`${API}/createServer`, formData);

      if (res?.data?.success) {
        toast.success("Server created successfully!");
        navigate.push("/");
      }
    } catch (e) {
      toast.error("Failed to create server");
      console.log(e);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Server Creation",
      description: "Basic server information",
    },
    { id: 2, title: "Add Plugins", description: "Choose server plugins" },
    { id: 3, title: "Payment", description: "Review and confirm" },
  ];

  const storageOptions = [
    { storage: 5, price: 0, days: 7, popular: false },
    { storage: 15, price: 10, days: 30, popular: false },
    { storage: 85, price: 80, days: 180, popular: true },
    { storage: 150, price: 140, days: 365, popular: false },
  ];

  const pluginOptions = [
    {
      type: "Chat",
      description: "Real-time messaging system",
      variants: [{ validity: 30, price: 40 }],
    },
    {
      type: "Drive",
      description: "File storage and sharing",
      variants: [
        { validity: 30, price: 20 },
        { validity: 180, price: 40 },
        { validity: 365, price: 80 },
      ],
    },
    {
      type: "Xmind",
      description: "Mind mapping tool",
      variants: [
        { validity: 30, price: 20 },
        { validity: 180, price: 40 },
        { validity: 365, price: 55 },
      ],
    },
  ];

  return (
    <div   style={{
          backgroundImage: `url(${Bg.src})`,
          backgroundPosition: "top",
        }} className="min-h-screen bg-background">
      <Toaster position="top-right" />

      <div className="flex h-screen">
         {/* navbar  */}
         <div className="w-[25%] pn:max-sm:w-full min-w-[50px] h-full">
          {/* header  */}
          <div className="h-[80px] w-full rounded-2xl p-2">
            <div className="h-full w-full rounded-[20px] bg-white shadow-xl flex gap-2 items-center px-2">
              <div className="h-[50px] w-[50px] bg-[#ececec] rounded-2xl">
                <img
                  alt="server"
                  src={data?.profilePicUrl}
                  className="w-full h-full object-cover text-[10px]"
                />
              </div>
              <div>
                <div className="text-[14px] font-semibold">
                  {data?.fullname}
                </div>
                <div className="text-[12px] text-slate-700">
                  {data?.username}
                </div>
              </div>
            </div>
          </div>
          {/* main  */}
          <div className="  h-full  p-2 pn:max-sm:fixed    pn:max-sm:h-[60px]  pn:max-sm:bottom-0">
            <div className="bg-white h-[calc(100%-80px)] p-2 rounded-3xl pn:max-sm:w-full">
            <div className="h-full w-full bg-[#F9F9F9] sm:rounded-2xl p-2 flex justify-between sm:flex-col">
              <div className="w-full sm:space-y-2 pn:max-sm:flex justify-between">
          

          {/* Steps */}
          <div className="p-6">
            <div className="space-y-4">
              {steps.map((stepItem) => (
                <div
                  key={stepItem.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    step === stepItem.id ? "opacity-100" : "opacity-60"
                  }`}
                  onClick={() => setStep(stepItem.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                        step === stepItem.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : step > stepItem.id
                          ? "bg-success text-success-foreground border-success"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {step > stepItem.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        stepItem.id
                      )}
                    </div>
                    <div>
                      <div
                        className={`font-medium ${
                          step === stepItem.id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {stepItem.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stepItem.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
              </div>
             
            </div>
            </div>
          </div>
        </div>
     

        {/* Main Content */}
        <div className="flex-1 flex">
          <div className="flex-1 p-6 overflow-y-auto">
            {step === 1 && (
              <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <h1 className="text-3xl font-medium text-foreground">
                    Server Creation
                  </h1>
                  <p className="text-muted-foreground">
                    Set up your new server with basic information
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Server Details</CardTitle>
                    <CardDescription>
                      Configure your server&apos;s basic information and storage
                      plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Icon Upload */}
                    <div>
                      <Label>Server Icon</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <label
                          htmlFor="iconInput"
                          className="cursor-pointer flex items-center gap-3"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="iconInput"
                            onChange={handleIconChange}
                          />
                          <div className="h-16 w-16 rounded-2xl border-2 border-dashed border-border bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                            {preview ? (
                              <img
                                src={preview}
                                alt="Server Icon"
                                className="h-full w-full rounded-2xl object-cover"
                              />
                            ) : (
                              <Camera className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {icon?.name || "Click to upload server icon"}
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Server Name and Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="serverName">Server Name</Label>
                        <Input
                          id="serverName"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter server name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="serverDescription">Description</Label>
                        <Textarea
                          id="serverDescription"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Server description"
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Storage Plans */}
                    {/* <div>
                      <Label>Storage Plan</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        {storageOptions.map((option) => (
                          <Card
                            key={option.storage}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                              storageAllotted === option.storage
                                ? "ring-2 ring-primary bg-primary/5"
                                : "hover:bg-muted/50"
                            }`}
                            onClick={() =>
                              selectStoragePlan(
                                option.storage,
                                option.price,
                                option.days
                              )
                            }
                          >
                            <CardContent className="p-4 text-center">
                              {option.popular ? (
                                <Badge className="mb-2" variant="secondary">
                                  Popular
                                </Badge>
                              ) : (
                                option?.price === 0 && (
                                  <Badge className="mb-2" variant="free">
                                    Free
                                  </Badge>
                                )
                              )}
                              <div className="text-2xl font-bold text-foreground">
                                {option.storage}GB
                              </div>
                              <div className="text-lg font-semibold text-primary">
                                ${option.price}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {option.days} days
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div> */}
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-foreground">
                    Add Plugins
                  </h1>
                  <p className="text-muted-foreground">
                    Enhance your server with additional features
                  </p>
                </div>

                <div className="space-y-6">
                  {pluginOptions.map((plugin) => (
                    <Card key={plugin.type}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Server className="h-5 w-5" />
                          {plugin.type}
                        </CardTitle>
                        <CardDescription>{plugin.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {plugin.variants.map((variant, index) => {
                            const isSelected = selectedPlugins.some(
                              (p) =>
                                p.type === plugin.type &&
                                p.validity === variant.validity
                            );

                            return (
                              <Card
                                key={index}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                                  isSelected
                                    ? "ring-2 ring-primary bg-primary/5"
                                    : "hover:bg-muted/50"
                                }`}
                                onClick={() => {
                                  if (isSelected) {
                                    removePlugin(plugin.type, variant.price);
                                  } else {
                                    addOrUpdatePlugin(
                                      plugin.type,
                                      variant.validity,
                                      variant.price
                                    );
                                  }
                                }}
                              >
                                <CardContent className="p-4 text-center">
                                  <div className="text-lg font-semibold text-primary">
                                    ${variant.price}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {variant.validity} days
                                  </div>
                                  {isSelected && (
                                    <Badge className="mt-2" variant="secondary">
                                      <Check className="h-3 w-3 mr-1" />
                                      Selected
                                    </Badge>
                                  )}
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-foreground">
                    Payment
                  </h1>
                  <p className="text-muted-foreground">
                    Review your order and complete payment
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>
                      Review your server configuration before payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Server: {name}</span>
                      <span>
                        $
                        {storageAllotted
                          ? storageOptions.find(
                              (o) => o.storage === storageAllotted
                            )?.price
                          : 0}
                      </span>
                    </div>

                    {selectedPlugins.map((plugin) => (
                      <div
                        key={`${plugin.type}-${plugin.validity}`}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium">
                          {plugin.type} ({plugin.validity} days)
                        </span>
                        <span>
                          $
                          {
                            pluginOptions
                              .find((p) => p.type === plugin.type)
                              ?.variants.find(
                                (v) => v.validity === plugin.validity
                              )?.price
                          }
                        </span>
                      </div>
                    ))}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount</span>
                        <span>${amount}</span>
                      </div>
                    </div>

                    <Button
                      onClick={createServer}
                      className="w-full mt-6"
                      size="lg"
                      disabled={!name || !storageAllotted}
                    >
                      Create Server
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Billing Sidebar */}
          <div className="w-80 flex items-center justify-center p-2  ">
            <div className="sticky border bg-white  h-full w-full p-4 rounded-2xl top-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Billing Summary
              </h3>

              <Card>
                <CardContent className="p-4 space-y-3">
                  {storageAllotted > 0 && (
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">Storage Plan</div>
                        <div className="text-xs text-muted-foreground">
                          {storageAllotted}GB • {validity} days
                        </div>
                      </div>
                      <div className="font-semibold">
                        $
                        {storageOptions.find(
                          (o) => o.storage === storageAllotted
                        )?.price || 0}
                      </div>
                    </div>
                  )}

                  {selectedPlugins.map((plugin) => {
                    const pluginData = pluginOptions.find(
                      (p) => p.type === plugin.type
                    );
                    const variant = pluginData?.variants.find(
                      (v) => v.validity === plugin.validity
                    );

                    return (
                      <div
                        key={`${plugin.type}-${plugin.validity}`}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {plugin.type}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {plugin.validity} days
                          </div>
                        </div>
                        <div className="font-semibold">
                          ${variant?.price || 0}
                        </div>
                      </div>
                    );
                  })}

                  {(storageAllotted > 0 || selectedPlugins.length > 0) && (
                    <>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <div className="font-semibold">Total</div>
                          <div className="text-lg font-bold text-primary">
                            ${amount}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {amount === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Server className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <div className="text-sm">
                        Select a storage plan to see pricing
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {step < 3 && amount > 0 && (
                <Button
                  onClick={() => setStep(step + 1)}
                  className="w-full mt-4"
                  disabled={step === 1 && (!name || !storageAllotted)}
                >
                  Continue to {step === 1 ? "Plugins" : "Payment"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerCreation;
