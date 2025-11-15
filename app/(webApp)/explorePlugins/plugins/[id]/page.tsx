"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Check, ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { mockPlugins, type Plugin } from "../../data/plugins";
import { API } from "@/app/utils/helpers";
import { useAuthContext } from "@/app/(webApp)/auth/components/auth";

interface Server {
  _id: string;
  dbName: string;
  name?: string;
  icon?: string;
  members?: [];
}

export default function PluginDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pluginId = params.id as string;
  console.log(pluginId, "pluginId");
  const { data } = useAuthContext();
  const [selectedPlan, setSelectedPlan] = useState<
    "basic" | "pro" | "enterprise"
  >("pro");
  const [selectedServerId, setSelectedServerId] = useState<string>("");
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(false);

  const plugin = mockPlugins.find((p) => p.id === pluginId);

  useEffect(() => {
    if (data?.id) {
      getUserServers();
    }
  }, [data?.id]);

  const getUserServers = async () => {
    try {
      const res = await axios.get(`${API}/getUserServers/${data?.id}`);
      if (res?.data) {
        setServers(res?.data);
        if (res?.data.length > 0 && !selectedServerId) {
          setSelectedServerId(res?.data[0]._id);
        }
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to load servers");
    }
  };

  if (!plugin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Plugin not found
          </h1>
          <Link
            href="/marketPlace"
            className="hover:underline"
            style={{ color: "#FDD78D" }}
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-4 w-4 text-gray-300 fill-gray-300" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  const getPlanValidity = (plan: "basic" | "pro" | "enterprise"): number => {
    // Map plan to validity in days (30 days = 1 month)
    const validityMap = {
      basic: 30,
      pro: 180,
      enterprise: 365,
    };
    return validityMap[plan];
  };

  const handleInstallPlugin = async () => {
    if (!selectedServerId) {
      toast.error("Please select a server");
      return;
    }

    if (!plugin) {
      toast.error("Plugin not found");
      return;
    }

    setLoading(true);

    try {
      const amount = plugin.pricing[selectedPlan].price;
      const validity = getPlanValidity(selectedPlan);
      const now = new Date();
      const boughton = now.toISOString();
      const expireson = new Date(
        now.getTime() + validity * 24 * 60 * 60 * 1000
      ).toISOString();

      const pluginPayload = {
        type: plugin.name, // Using plugin name as type (e.g., "Advanced Analytics", "Security Shield")
        // Alternative: type: plugin.id, // Use this if backend expects plugin ID instead
        boughton,
        expireson,
        transactionData: {
          amount: amount,
          txnId: "TXN" + Math.floor(Math.random() * 100000),
        },
      };

      await axios.post(`${API}/addplugin/${selectedServerId}`, {
        plugins: [pluginPayload],
      });

      toast.success(
        `Plugin "${plugin.name}" installed successfully on selected server!`
      );
      router.push(`/inServer?serverId=${selectedServerId}`);
    } catch (error: any) {
      console.error("Failed to install plugin", error);
      toast.error(error?.response?.data?.message || "Failed to install plugin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-500 w-full overflow-y-auto ">
      <div className="max-w-5xl bg-slate-500 mx-auto">
        {/* Back Button */}
        <Link
          href="/marketPlace"
          className="inline-flex items-center gap-2 bg-black text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Marketplace</span>
        </Link>

        {/* Header */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-6xl shrink-0">{plugin.icon}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {plugin.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    plugin.price === "Free" ? "bg-green-100 text-green-700" : ""
                  }`}
                  style={
                    plugin.price !== "Free"
                      ? { backgroundColor: "#FDD78D33", color: "#FDD78D" }
                      : {}
                  }
                >
                  {plugin.price}
                </span>
              </div>
              <p className="text-base text-gray-600 mt-2">
                {plugin.description}
              </p>
              <div className="flex items-center gap-4 mt-4 flex-wrap">
                <div className="flex items-center gap-2">
                  {renderStars(plugin.rating)}
                  <span className="font-semibold text-gray-900">
                    {plugin.rating}
                  </span>
                  <span className="text-gray-500">
                    ({plugin.reviews} reviews)
                  </span>
                </div>
                <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                  {plugin.category}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <span>By {plugin.developer}</span>
                <span className="mx-2">•</span>
                <span>Version {plugin.version}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Features Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plugin.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Basic Plan */}
              <div
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                  selectedPlan === "basic"
                    ? "shadow-lg scale-105"
                    : "border-gray-200 hover:shadow-md hover:border-gray-300"
                }`}
                style={
                  selectedPlan === "basic"
                    ? { borderColor: "#FDD78D", backgroundColor: "#FDD78D33" }
                    : {}
                }
                onClick={() => setSelectedPlan("basic")}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Basic
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${plugin.pricing.basic.price}
                  </span>
                  {plugin.pricing.basic.price > 0 && (
                    <span className="text-gray-500 text-sm">/month</span>
                  )}
                </div>
                <ul className="space-y-2 mb-4">
                  {plugin.pricing.basic.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    selectedPlan === "basic"
                      ? "text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={
                    selectedPlan === "basic"
                      ? { backgroundColor: "#FDD78D" }
                      : {}
                  }
                  onMouseEnter={
                    selectedPlan === "basic"
                      ? (e) =>
                          (e.currentTarget.style.backgroundColor = "#FDD78DCC")
                      : undefined
                  }
                  onMouseLeave={
                    selectedPlan === "basic"
                      ? (e) =>
                          (e.currentTarget.style.backgroundColor = "#FDD78D")
                      : undefined
                  }
                >
                  {plugin.pricing.basic.price === 0
                    ? "Get Started"
                    : "Select Plan"}
                </button>
              </div>

              {/* Pro Plan */}
              <div
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 relative ${
                  selectedPlan === "pro"
                    ? "shadow-lg scale-105"
                    : "border-gray-200 hover:shadow-md hover:border-gray-300"
                }`}
                style={
                  selectedPlan === "pro"
                    ? { borderColor: "#FDD78D", backgroundColor: "#FDD78D33" }
                    : {}
                }
                onClick={() => setSelectedPlan("pro")}
              >
                {selectedPlan === "pro" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span
                      className="text-white px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: "#FDD78D" }}
                    >
                      Popular
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pro
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${plugin.pricing.pro.price}
                  </span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {plugin.pricing.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    selectedPlan === "pro"
                      ? "text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={
                    selectedPlan === "pro" ? { backgroundColor: "#FDD78D" } : {}
                  }
                  onMouseEnter={
                    selectedPlan === "pro"
                      ? (e) =>
                          (e.currentTarget.style.backgroundColor = "#FDD78DCC")
                      : undefined
                  }
                  onMouseLeave={
                    selectedPlan === "pro"
                      ? (e) =>
                          (e.currentTarget.style.backgroundColor = "#FDD78D")
                      : undefined
                  }
                >
                  Select Plan
                </button>
              </div>

              {/* Enterprise Plan */}
              <div
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                  selectedPlan === "enterprise"
                    ? "shadow-lg scale-105"
                    : "border-gray-200 hover:shadow-md hover:border-gray-300"
                }`}
                style={
                  selectedPlan === "enterprise"
                    ? { borderColor: "#FDD78D", backgroundColor: "#FDD78D33" }
                    : {}
                }
                onClick={() => setSelectedPlan("enterprise")}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Enterprise
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${plugin.pricing.enterprise.price}
                  </span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {plugin.pricing.enterprise.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    selectedPlan === "enterprise"
                      ? "text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={
                    selectedPlan === "enterprise"
                      ? { backgroundColor: "#FDD78D" }
                      : {}
                  }
                  onMouseEnter={
                    selectedPlan === "enterprise"
                      ? (e) =>
                          (e.currentTarget.style.backgroundColor = "#FDD78DCC")
                      : undefined
                  }
                  onMouseLeave={
                    selectedPlan === "enterprise"
                      ? (e) =>
                          (e.currentTarget.style.backgroundColor = "#FDD78D")
                      : undefined
                  }
                >
                  Select Plan
                </button>
              </div>
            </div>
          </div>

          {/* Server Selection */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Select Server
            </h2>
            {servers.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm mb-2">
                  No servers found. Please create a server first.
                </p>
                <Link
                  href="/serverCreation"
                  className="hover:underline text-sm font-medium"
                  style={{ color: "#FDD78D" }}
                >
                  Create Server →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {servers.map((server) => (
                  <div
                    key={server._id}
                    onClick={() => setSelectedServerId(server._id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedServerId === server._id
                        ? ""
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={
                      selectedServerId === server._id
                        ? {
                            borderColor: "#FDD78D",
                            backgroundColor: "#FDD78D33",
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedServerId === server._id
                            ? ""
                            : "border-gray-300"
                        }`}
                        style={
                          selectedServerId === server._id
                            ? {
                                borderColor: "#FDD78D",
                                backgroundColor: "#FDD78D",
                              }
                            : {}
                        }
                      >
                        {selectedServerId === server._id && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {server.name || server.dbName}
                        </h3>
                        <p className="text-sm text-gray-500">{server.dbName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              className="flex-1 text-white py-3 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#FDD78D" }}
              onMouseEnter={(e) =>
                !e.currentTarget.disabled &&
                (e.currentTarget.style.backgroundColor = "#FDD78DCC")
              }
              onMouseLeave={(e) =>
                !e.currentTarget.disabled &&
                (e.currentTarget.style.backgroundColor = "#FDD78D")
              }
              disabled={!selectedServerId || servers.length === 0 || loading}
              onClick={handleInstallPlugin}
            >
              {loading
                ? "Processing..."
                : plugin.pricing[selectedPlan].price === 0
                ? "Install Free"
                : `Subscribe - $${plugin.pricing[selectedPlan].price}/month`}
            </button>
            <Link
              href="/marketPlace"
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
