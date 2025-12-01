"use client";

import { API } from "@/app/utils/helpers";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

const PageContent = () => {
  const [selectedPlugins, setSelectedPlugins] = useState<
    { type: string; price: number }[]
  >([]);
  // const [amount, setAmount] = useState(0);
  const searchparams = useSearchParams();
  const [serverId, setServerId] = useState("");
  useEffect(() => {
    setServerId(searchparams.get("serverId") || "");
  }, [searchparams]);

  const addOrUpdatePlugin = (type: string, price: number) => {
    setSelectedPlugins((prev) => {
      const exists = prev.find((p) => p.type === type);
      if (exists) {
        return prev.map((p) => (p.type === type ? { ...p, price } : p));
      } else {
        return [...prev, { type, price }];
      }
    });
    // setAmount((prev) => prev + price);
  };
  const handleSubmit = async () => {
    if (selectedPlugins.length === 0) {
      toast.error("Please select at least one plugin.");
      return;
    }

    const now = new Date();
    const pluginsPayload = selectedPlugins.map((plugin) => {
      const duration =
        plugin.price === 20
          ? 30
          : plugin.price === 40
          ? 180
          : plugin.price === 55 || plugin.price === 80
          ? 365
          : 30;

      const boughton = now.toISOString();
      const expireson = new Date(
        now.getTime() + duration * 24 * 60 * 60 * 1000
      ).toISOString();

      return {
        type: plugin.type,
        boughton,
        expireson,
        transactionData: {
          amount: plugin.price,
          txnId: "TXN" + Math.floor(Math.random() * 100000), // mock txnId
        },
      };
    });
    try {
      await axios.post(`${API}/addplugin/${serverId}`, {
        plugins: pluginsPayload,
      });
    } catch (error) {
      console.error("Failed to add plugins", error);
    }
  };

  return (
    <div className="w-full h-[100vh]  px-2 pn:max-sm:h-auto pn:max-sm:overflow-y-auto   no-scrollbar">
      {/* header  */}
      <div className="py-4 w-full flex justify-between border-slate-200 border-b p-4">
        <div className="font-semibold text-[20px]">Add Plugin</div>
        <button
          onClick={handleSubmit}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit Plugins
        </button>
      </div>
      {/* main  */}
      <div className="h-[calc(100%-80px)] w-full  p-10">
        <div className="h-full w-full rounded-2xl p-4 gap-4 bg-white">
          {/* Chat plugin */}
          <div className="p-2 bg-slate-200">
            Chat - Variants
            <div
              onClick={() => addOrUpdatePlugin("Chat", 40)}
              className="bg-red-200"
            >
              <div>Price: $40</div>
              <div>Validity - 30 days</div>
            </div>
          </div>
          {/* Drive plugin */}
          <div className="p-2 bg-slate-200 hover:bg-slate-100">
            Drive - Variants
            <div
              // onClick={() => {
              //   if (selectedPlugins?.length >= 1) {
              //     selectedPlugins?.forEach((plugin) => {
              //       if (plugin.type === "Drive") {
              //         plugin.validity = 30;
              //       }
              //     });
              //     setAmount(amount + 20);
              //   } else {
              //     setSelectedPlugins((prev) => [
              //       ...prev,
              //       {
              //         type: "Drive",
              //         validity: 30,
              //       },
              //     ]);
              //     setAmount(amount + 20);
              //   }
              // }}
              onClick={() => addOrUpdatePlugin("Drive", 20)}
              className="bg-red-200"
            >
              <div>Price: $20</div>

              <div>Validity - 30 days</div>
            </div>
            <div
              // onClick={() => {
              //   if (validity >= 180) {
              //     if (selectedPlugins?.length >= 1) {
              //       selectedPlugins?.forEach((plugin) => {
              //         if (plugin.type === "Drive") {
              //           plugin.validity = 180;
              //         }
              //       });
              //       setAmount(amount + 40);
              //     } else {
              //       setSelectedPlugins((prev) => [
              //         ...prev,
              //         {
              //           type: "Drive",
              //           validity: 180,
              //         },
              //       ]);
              //       setAmount(amount + 40);
              //     }
              //   } else {
              //     toast.error(
              //       "You can not have more plugin validity than server validity"
              //     );
              //   }
              // }}
              onClick={() => addOrUpdatePlugin("Drive", 40)}
              className="bg-green-200"
            >
              <div>Price: $40</div>
              <div>Validity - 180 days</div>
            </div>
            <div
              // onClick={() => {
              //   if (validity >= 180) {
              //     if (selectedPlugins?.length >= 1) {
              //       selectedPlugins?.forEach((plugin) => {
              //         if (plugin.type === "Drive") {
              //           plugin.validity = 365;
              //         }
              //       });
              //       setAmount(amount + 80);
              //     } else {
              //       setSelectedPlugins((prev) => [
              //         ...prev,
              //         {
              //           type: "Drive",
              //           validity: 365,
              //         },
              //       ]);
              //       setAmount(amount + 80);
              //     }
              //   } else {
              //     toast.error(
              //       "You can not have more plugin validity than server validity"
              //     );
              //   }
              // }}
              onClick={() => addOrUpdatePlugin("Drive", 80)}
              className="bg-yellow-200"
            >
              <div>Price: $80</div>
              <div>Validity - 365 days</div>
            </div>
          </div>
          {/* Xmind plugin */}
          <div className="p-2 bg-slate-200 hover:bg-slate-100">
            Xmind
            <div className="bg-red-200">
              <div
                // onClick={() => {
                //   if (selectedPlugins?.length >= 1) {
                //     selectedPlugins?.forEach((plugin) => {
                //       if (plugin.type === "Xmind") {
                //         plugin.validity = 30;
                //       }
                //     });
                //     setAmount(amount + 20);
                //   } else {
                //     setSelectedPlugins((prev) => [
                //       ...prev,
                //       {
                //         type: "Xmind",

                //         validity: 30,
                //       },
                //     ]);
                //     setAmount(amount + 20);
                //   }
                // }}
                onClick={() => addOrUpdatePlugin("Xmind", 20)}
              >
                Price: $20 for a month - 30 days
              </div>
              <div
                // onClick={() => {
                //   if (validity >= 180) {
                //     if (selectedPlugins?.length >= 1) {
                //       selectedPlugins?.forEach((plugin) => {
                //         if (plugin.type === "Xmind") {
                //           plugin.validity = 180;
                //         }
                //       });
                //       setAmount(amount + 40);
                //     } else {
                //       setSelectedPlugins((prev) => [
                //         ...prev,
                //         {
                //           type: "Xmind",
                //           validity: 180,
                //         },
                //       ]);
                //       setAmount(amount + 40);
                //     }
                //   } else {
                //     toast.error(
                //       "You can not have more plugin validity than server validity"
                //     );
                //   }
                // }}
                onClick={() => addOrUpdatePlugin("Xmind", 40)}
              >
                Price: $40 for 180 days
              </div>
              <div
                // onClick={() => {
                //   if (validity >= 365) {
                //     if (selectedPlugins?.length >= 1) {
                //       selectedPlugins?.forEach((plugin) => {
                //         if (plugin.type === "Xmind") {
                //           plugin.validity = 365;
                //         }
                //       });
                //       setAmount(amount + 55);
                //     } else {
                //       setSelectedPlugins((prev) => [
                //         ...prev,
                //         {
                //           type: "Xmind",
                //           validity: 365,
                //         },
                //       ]);
                //       setAmount(amount + 55);
                //     }
                //   } else {
                //     toast.error(
                //       "You can not have more plugin validity than server validity"
                //     );
                //   }
                // }}
                onClick={() => addOrUpdatePlugin("Xmind", 55)}
              >
                Price: $55 for 365 days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
