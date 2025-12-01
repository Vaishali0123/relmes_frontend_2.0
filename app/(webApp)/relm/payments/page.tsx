"use client";
import React, { useState } from "react";
import { Download, Rocket } from "lucide-react";

export default function BillingPage() {
  const [timeFilter, setTimeFilter] = useState("month");

  const billingHistory = [
    {
      date: "Feb 5, 2025",
      description: "Invoice for October 2025",
      amount: "$123.79",
    },
    {
      date: "Feb 4, 2025",
      description: "Invoice for September 2025",
      amount: "$98.03",
    },
    { date: "Feb 3, 2025", description: "Paypal", amount: "$35.07" },
  ];

  return (
    <div className="min-h-full bg-[#ffffff] p-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-12">
        Billing and Payment
      </h1>

      {/* Subscription Overview */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Subscription Overview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Current Plan Card */}
          <div className="bg-white rounded-2xl border  p-8">
            <h3 className="text-base font-semibold text-gray-900 mb-6">
              Current Plan
            </h3>
            <div className="flex items-end justify-between">
              <div>
                <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
                  Pro Plan
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors">
                Upgrade Plan
                <Rocket className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Plugins and Storage Card */}
          <div className="bg-white rounded-2xl border  p-8">
            <h3 className="text-base font-semibold text-gray-900 mb-6">
              Plugins and Storage Summary
            </h3>

            <div className="space-y-6">
              {/* Storage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    3GB / 5 GB
                  </span>
                  <span className="text-sm text-gray-500">Storage Used</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>

              {/* Plugins */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    Plugins{" "}
                    <span className="text-gray-500">10 of 100 Used</span>
                  </span>
                  <span className="text-sm text-gray-500">10 Plugins Used</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-400 h-2 rounded-full"
                    style={{ width: "10%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Payment Methods
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Credit Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-4">ByeWind</h4>
            <p className="text-gray-600 mb-4 tracking-wider">
              1235 6321 1343 7542
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Exp 06/25</span>
              <div className="flex gap-1">
                <div className="w-8 h-8 rounded-full bg-red-500 opacity-80"></div>
                <div className="w-8 h-8 rounded-full bg-orange-400 opacity-80 -ml-4"></div>
              </div>
            </div>
          </div>

          {/* PayPal */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-4">PayPal</h4>
            <p className="text-gray-600 mb-4">byewind@twitter.com</p>
            <div className="flex items-center justify-end">
              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xl">
                P
              </div>
            </div>
          </div>

          {/* Add Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
            <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center mb-3">
              <span className="text-2xl text-gray-400">+</span>
            </div>
            <span className="font-medium text-gray-700">Add card</span>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Billing History
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFilter("month")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeFilter === "month"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeFilter("year")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeFilter === "year"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Year
            </button>
            <button
              onClick={() => setTimeFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeFilter === "all"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-8 py-4 text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="text-left px-8 py-4 text-sm font-medium text-gray-500">
                  Description
                </th>
                <th className="text-left px-8 py-4 text-sm font-medium text-gray-500">
                  Amount
                </th>
                <th className="text-left px-8 py-4 text-sm font-medium text-gray-500">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-8 py-4 text-gray-900">{item.date}</td>
                  <td className="px-8 py-4 text-gray-600">
                    {item.description}
                  </td>
                  <td className="px-8 py-4 text-gray-900">{item.amount}</td>
                  <td className="px-8 py-4">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
