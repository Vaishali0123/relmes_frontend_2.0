"use client";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Camera, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { API } from "@/app/utils/helpers";
import { useAuthContext } from "../auth/components/auth";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setSelectedPlugins, setStep, removeSelectedPlugin, SelectedPlugin, updateSelectedPlugin } from "@/app/redux/slices/paramsSlice";
import MarketPlace from "../components/MarketPlace";
import { BsPlug } from "react-icons/bs";
import { TbServer2 } from "react-icons/tb";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { PluginData } from "../relm/layout";

interface Plugin {
  _id: string;
  duration?: number;
  price: number;
  membershipName?: string;
  membershipId?: string;
  // Add other properties that exist on your plugin object
}

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
  const dispatch = useAppDispatch();
  // const [step, setStep] = useState(1);
  const { step } = useAppSelector((state) => state.params);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [validity, setValidity] = useState(0);
  const [storageAllotted, setStorageAllotted] = useState(0);
  const [icon, setIcon] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  // const [selectedPlugins, setSelectedPlugins] = useState<Plugin[]>([]);
  const [serverplans, setServerplans] = useState<any[]>([]);
  const [plugins, setPlugins] = useState<any[]>([]);
  const [selectedServerPlan, setSelectedServerPlan] = useState<any>(null);
  const { data } = useAuthContext(); // Assuming you have a context to get user data
  // Using mock data - replace with actual auth context
  const userData = mockUserData;
  const selectedPlugins = useSelector<RootState, SelectedPlugin[]>(
    (state: RootState) => state.params.selectedPlugins
  );
  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIcon(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Convert to lowercase, remove spaces, and allow only alphanumeric and hyphens
    const formattedSlug = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setSlug(formattedSlug);
  };

  // const selectStoragePlan = (storage: number, price: number, days: number) => {
  //   setStorageAllotted(storage);
  //   setValidity(days);
  //   setAmount(price);
  // };
  const [membershipId, setMembershipId] = useState("");

  const handleServerPlanSelect = (plan: any) => {
    setMembershipId(plan._id);
    setSelectedServerPlan(plan);
    // Reset plugins if server plan validity is less than any selected plugin validity
    if (selectedPlugins.length > 0) {
      const invalidPlugins = selectedPlugins.filter(
        (p) => (p.duration || 30) > plan.duration
      );
      if (invalidPlugins.length > 0) {
        invalidPlugins.forEach((plugin) => {
          removePlugin(plugin._id, plugin.price);
        });
        toast.error(
          `Some plugins were removed as their validity exceeds the server plan validity (${plan.duration} days)`
        );
      }
    }
  };

  const addOrUpdatePlugin = (
    pluginId: string,
    // type: string,
    pluginDuration: number,
    price: number,
    membershipId?: string
  ) => {
    // Check if server plan is selected
    if (!selectedServerPlan) {
      toast.error("Please select a server plan first");
      return;
    }

    // Check if plugin validity exceeds server validity
    if (pluginDuration > selectedServerPlan.duration) {
      toast.error(
        `Plugin validity (${pluginDuration} days) cannot exceed server validity (${selectedServerPlan.duration} days)`
      );
      return;
    }

    // Find the plugin to get its type
    const pluginData = plugins.find((p: any) => p._id === pluginId);
    const pluginType = pluginData?.type || pluginData?.name || "Unknown";

    const exists = selectedPlugins.find((p: SelectedPlugin) => p._id === pluginId);
    if (exists) {
      // Update existing plugin
      dispatch(updateSelectedPlugin({
        ...exists,
        // duration: pluginDuration,
        // price: price,
        // // membershipName: selectedServerPlan?.name || membershipId,
        // membershipId: membershipId,
      }));
    } else {
      // Add new plugin
      dispatch(setSelectedPlugins({
        _id: pluginId,
        price: price,
        // type: pluginType,
        // duration: pluginDuration,
        // membershipName: selectedServerPlan?.name || membershipId,
      }));
    }
  };

  const removePlugin = (pluginId: string, price: number) => {
    dispatch(removeSelectedPlugin(pluginId));
  };

  const createServer = async () => {
    // if (!slug.trim()) {
    //   toast.error("Please enter a server initialization name (slug)");
    //   return;
    // }

    try {
      const formData = new FormData();
      formData.append("name", name);
      // formData.append("slug", slug);
      formData.append("description", description);
      // formData.append("storageallotted", storageAllotted.toString());
      if (data?.id) {
        formData.append("ownerId", data?.id);
      }
      formData.append("membershipId", membershipId);
      // formData.append("validity", validity.toString());
      // formData.append("amount", amount.toString());
      formData.append("plugin", JSON.stringify(selectedPlugins));

      if (icon) {
        formData.append("icon", icon);
      }

      const res = await axios.post(`${API}/createServer`, formData);

      if (res?.data?.success) {
        toast.success("Server created successfully!");
        navigate.push("/home");
      }
    } catch (e) {
      toast.error("Failed to create server");
      console.log(e);
    }
  };
  const getAllPlugins = async () => {
    try {
      const res = await axios.get(`${API}/getAllPlugins`);
      console.log(res?.data, "plugins");
      if (res?.data?.success) {
        setPlugins(res?.data?.plugins);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getAllServerMembershipPlans = async () => {
    try {
      const res = await axios.get(`${API}/admin/getAllServerMembershipPlans`);
      console.log(res?.data, "serverplans");
      if (res?.data?.success) {
        setServerplans(res?.data?.data);
      } else {
        toast.error(res?.data?.message);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAllServerMembershipPlans();
    getAllPlugins();
  }, []);
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
    <div className="h-screen p-2 flex items-center justify-center">
      <Toaster position="top-right" />

      <div className="flex h-full">
        {/* step 1 */}
        <div
          className={` space-y-2 overflow-hidden bg-white border rounded-l-3xl p-4 border-[#f4f4f4] duration-100 ${step === 1 ? "w-full" : "w-[10%] "
            }`}
        >
          <div
            className={`text-3xl text-primary flex flex-col items-center justify-center ${step === 1 ? "opacity-0 hidden" : "opacity-100"
              }`}
          >
            <TbServer2 />
            <div className="flex items-center justify-center flex-col mt-4 font-space-grotesk">
              <div className="text-lg">S</div>
              <div className="text-lg">E</div>

              <div className="text-lg">R</div>

              <div className="text-lg">V</div>

              <div className="text-lg">E</div>

              <div className="text-lg">R</div>
            </div>
          </div>
          <div className={`${step === 1 ? "w-full" : "w-[10%] opacity-0"}`}>
            <div className=" pl-2">
              <h1 className="text-[16px] font-semibold font-space-grotesk text-gray-900 mb-0.5">
                Server Creation
              </h1>
              <p className="text-gray-600 text-[12px]">
                Set up your new server with basic information
              </p>
            </div>
            <div className=" rounded-3xl p-4">
              <CardContent className="space-y-6">
                {/* Icon Upload */}
                <div>
                  <Label>Server Icon</Label>
                  <div className="flex items-center  gap-4 mt-2">
                    <label
                      htmlFor="iconInput"
                      className="cursor-pointer  flex items-center gap-3"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="iconInput"
                        onChange={handleIconChange}
                      />
                      <div className="h-16 w-16 relative rounded-2xl shadow-md bg-[#ffffff] flex items-center justify-center hover:bg-muted/80 transition-colors">
                        {preview ? (
                          <img
                            src={preview}
                            alt="Server Icon"
                            className="h-full w-full z-10 rounded-2xl object-cover"
                          />
                        ) : (
                          <Camera className="h-6 w-6 z-10 text-muted-foreground" />
                        )}
                        <div className="text-xs h-16 w-16 absolute bg-[#ffffff]  rounded-2xl z-0 top-2 right-2"></div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {icon?.name || "Click to upload server icon"}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Server Name and Slug */}
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
                  {/* <div>
                    <Label htmlFor="serverSlug">Server Type</Label>
                    <Input
                      id="serverSlug"
                      value={slug}
                      onChange={handleSlugChange}
                      placeholder="e.g., my-server-name"
                      className="mt-1"
                    />
                  </div> */}
                </div>

                {/* Description */}
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

                {/* Storage Plans */}
                <div>
                  <Label>Storage Plan</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3  gap-4 mt-2">
                    {serverplans.map((option, i) => (
                      <div
                        key={i}
                        className={`cursor-pointer transition-all duration-200 border border-[#f4f4f4] rounded-2xl hover:shadow-md ${membershipId === option?._id
                          ? "scale-110 bg-primary/5"
                          : "hover:bg-muted/50"
                          }`}
                        onClick={() => handleServerPlanSelect(option)}
                      >
                        <CardContent className="p-4 text-center ">
                          {/* Add Name */}
                          <div className="text-lg font-semibold text-foreground">
                            {option?.name}
                          </div>
                          {option?.popular ? (
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
                          {/* <div className="text-2xl font-bold text-foreground">
                                {option.storage}GB
                              </div> */}
                          <div className="text-lg font-semibold text-primary">
                            ${option.price || "Soon Available"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {option.duration} days
                          </div>
                        </CardContent>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </div>
        {/* step 2 */}
        <div
          className={` space-y-2 h-full overflow-hidden bg-white border-t border-b  p-4 border-[#f4f4f4] duration-100 ${step === 2 ? "w-full  " : "w-[10%] "
            }`}
        >
          <div
            className={`text-3xl text-primary flex flex-col items-center justify-center ${step === 2 ? "opacity-0 hidden" : "opacity-100"
              }`}
          >
            <BsPlug />
            <div className="flex items-center justify-center flex-col mt-4 font-space-grotesk">
              <div className="text-lg">P</div>
              <div className="text-lg">l</div>

              <div className="text-lg">u</div>

              <div className="text-lg">g</div>

              <div className="text-lg">i</div>

              <div className="text-lg">n</div>

              <div className="text-lg">s</div>
            </div>
          </div>
          <div className={`${step === 2 ? "w-full" : "w-[10%] opacity-0"}`}>
            <MarketPlace />
          </div>
        </div>
        {/* step 3 */}
        <div
          className={` flex items-center justify-center relative space-y-2 h-full overflow-hidden bg-white border rounded-r-3xl p-2 border-[#f4f4f4] duration-100 ${step === 3 ? "w-full " : "w-80 "
            }`}
        >
          <div className="  h-full w-full p-4 rounded-2xl top-6">
            <h3 className="text-lg font-semibold font-space-grotesk text-foreground mb-4">
              Billing Summary
            </h3>

            <div>
              <CardContent className="p-4 space-y-3">
                {selectedServerPlan && (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm">Server Plan</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedServerPlan.name} •{" "}
                        {selectedServerPlan.duration} days
                      </div>
                    </div>
                    <div className="font-semibold">
                      ${selectedServerPlan.price || 0}
                    </div>
                  </div>
                )}

                {selectedPlugins.map((plugin, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-sm">{plugin.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {plugin.membershipName && (
                          <span>{plugin.membershipName} • </span>
                        )}
                        {plugin.duration} days
                      </div>
                    </div>
                    <div className="font-semibold">${plugin.price}</div>
                  </div>
                ))}

                {(selectedServerPlan || selectedPlugins.length > 0) && (
                  <>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <div className="font-semibold">Total</div>
                        <div className="text-lg font-bold text-primary">
                          $
                          {(selectedServerPlan?.price || 0) +
                            selectedPlugins.reduce(
                              (sum, p) => sum + p.price,
                              0
                            )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {!selectedServerPlan && selectedPlugins.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Server className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">
                      Select a server plan to see pricing
                    </div>
                  </div>
                )}
              </CardContent>
            </div>

            {step <= 3 &&
              (selectedServerPlan || selectedPlugins.length > 0) && (
                <Button
                  onClick={() =>
                    // dispatch(setStep(step + 1)
                    createServer()
                  }
                  className="w-[400px] self-center flex mt-4 absolute bottom-4 right-4 bg-[#F9D199]"
                  disabled={
                    step === 1 && (!name || !slug.trim() || !selectedServerPlan)
                  }
                >
                  {step === 1 ? "Continue to Plugins" : "Proceed"}
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerCreation;
