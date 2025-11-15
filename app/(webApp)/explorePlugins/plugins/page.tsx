"use client";

import React, { useState, useEffect } from "react";
import { Star, Check, X } from "lucide-react";

interface Plugin {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  rating: number;
  reviews: number;
  downloads: string;
  price: "Free" | "Paid";
  featured: boolean;
  trending: boolean;
  developer: string;
  version: string;
  features: string[];
  pricing: {
    basic: { price: number; features: string[] };
    pro: { price: number; features: string[] };
    enterprise: { price: number; features: string[] };
  };
}

interface PluginDetailDialogProps {
  plugin: Plugin;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const page = ({ plugin, open, onOpenChange }: PluginDetailDialogProps) => {
  const [selectedPlan, setSelectedPlan] = useState<
    "basic" | "pro" | "enterprise"
  >("pro");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog Content */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="text-6xl flex-shrink-0">{plugin.icon}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {plugin.name}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    plugin.price === "Free"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
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

        <div className="p-6 space-y-6">
          {/* Features Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plugin.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Choose Your Plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Basic Plan */}
              <div
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                  selectedPlan === "basic"
                    ? "border-blue-500 shadow-lg scale-105 bg-blue-50"
                    : "border-gray-200 hover:shadow-md hover:border-gray-300"
                }`}
                onClick={() => setSelectedPlan("basic")}
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Basic
                </h4>
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
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    selectedPlan === "basic"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
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
                    ? "border-blue-500 shadow-lg scale-105 bg-blue-50"
                    : "border-gray-200 hover:shadow-md hover:border-gray-300"
                }`}
                onClick={() => setSelectedPlan("pro")}
              >
                {selectedPlan === "pro" && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Popular
                    </span>
                  </div>
                )}
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Pro
                </h4>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${plugin.pricing.pro.price}
                  </span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {plugin.pricing.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    selectedPlan === "pro"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Select Plan
                </button>
              </div>

              {/* Enterprise Plan */}
              <div
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                  selectedPlan === "enterprise"
                    ? "border-blue-500 shadow-lg scale-105 bg-blue-50"
                    : "border-gray-200 hover:shadow-md hover:border-gray-300"
                }`}
                onClick={() => setSelectedPlan("enterprise")}
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Enterprise
                </h4>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${plugin.pricing.enterprise.price}
                  </span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {plugin.pricing.enterprise.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    selectedPlan === "enterprise"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Select Plan
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              onClick={() => {
                console.log(`Installing ${plugin.name} - ${selectedPlan} plan`);
                onOpenChange(false);
              }}
            >
              {plugin.pricing[selectedPlan].price === 0
                ? "Install Free"
                : `Subscribe - $${plugin.pricing[selectedPlan].price}/month`}
            </button>
            <button
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
