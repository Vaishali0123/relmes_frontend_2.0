"use client";

import { useState } from "react";
import axios from "axios";
import { API, errorHandler } from "@/app/utils/helpers";
import { toast } from "@/app/utils/toast-safe";
import { useAuthContext } from "../../auth/components/auth";

type MembershipPlan = {
  planName: string;
  price: string;
  duration: string;
  features: string[];
};

const defaultPlan: MembershipPlan = {
  planName: "",
  price: "",
  duration: "",
  features: [""],
};

const inputStyles =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10";

const sectionCardStyles =
  "rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur";

const UploadPluginPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pluginName: "",
    generatedpluginId: "",
    pluginVersion: "",
    pluginType: "",
    description: "",
    productiondomain: "",
    slug: "",
    schema: "",
    icon: "",
    ownerId: "",
    data: "",
  });
const {data}= useAuthContext()

  const [bankDetails, setBankDetails] = useState({
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    upi: "",
  });

  const [tags, setTags] = useState<string[]>([""]);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([
    { ...defaultPlan },
  ]);

  const updateFormField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateBankField = (field: keyof typeof bankDetails, value: string) => {
    setBankDetails((prev) => ({ ...prev, [field]: value }));
  };

  const updateTag = (index: number, value: string) => {
    setTags((prev) => prev.map((tag, idx) => (idx === index ? value : tag)));
  };

  const addTag = () => setTags((prev) => [...prev, ""]);
  const removeTag = (index: number) =>
    setTags((prev) => prev.filter((_, idx) => idx !== index));

  const updatePlan = (
    index: number,
    field: keyof MembershipPlan,
    value: string
  ) => {
    setMembershipPlans((prev) =>
      prev.map((plan, idx) =>
        idx === index ? { ...plan, [field]: value } : plan
      )
    );
  };

  const addPlan = () =>
    setMembershipPlans((prev) => [...prev, { ...defaultPlan }]);

  const removePlan = (index: number) =>
    setMembershipPlans((prev) => prev.filter((_, idx) => idx !== index));

  const updateFeature = (
    planIndex: number,
    featureIndex: number,
    value: string
  ) => {
    setMembershipPlans((prev) =>
      prev.map((plan, idx) => {
        if (idx !== planIndex) return plan;
        const updatedFeatures = plan.features.map((feature, fIdx) =>
          fIdx === featureIndex ? value : feature
        );
        return { ...plan, features: updatedFeatures };
      })
    );
  };

  const addFeature = (planIndex: number) => {
    setMembershipPlans((prev) =>
      prev.map((plan, idx) =>
        idx === planIndex ? { ...plan, features: [...plan.features, ""] } : plan
      )
    );
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    setMembershipPlans((prev) =>
      prev.map((plan, idx) => {
        if (idx !== planIndex) return plan;
        return {
          ...plan,
          features: plan.features.filter((_, fIdx) => fIdx !== featureIndex),
        };
      })
    );
  };

  const resetForm = () => {
    setFormData({
      pluginName: "",
      generatedpluginId: "",
      pluginVersion: "",
      pluginType: "",
      description: "",
      productiondomain: "",
      slug: "",
      schema: "",
      icon: "",
      ownerId: "",
      data: "",
    });
    setBankDetails({
      accountHolder: "",
      accountNumber: "",
      ifsc: "",
      upi: "",
    });
    setTags([""]);
    setMembershipPlans([{ ...defaultPlan }]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!API) {
      toast.error("API endpoint is not configured.");
      return;
    }

    const requiredFields: Array<keyof typeof formData> = [
      "pluginName",
      "generatedpluginId",
      "pluginVersion",
      "pluginType",
      "productiondomain",
      "icon",
    ];

    const missingField = requiredFields.find(
      (field) => !formData[field].trim().length
    );

    if (missingField) {
      toast.error(`${missingField} is required`);
      return;
    }

    if (!formData.generatedpluginId.startsWith("plg_")) {
      toast.error("pluginId must start with 'plg_'");
      return;
    }

    let parsedData: Record<string, unknown> | undefined;
    if (formData.data.trim()) {
      try {
        parsedData = JSON.parse(formData.data);
      } catch (error) {
        toast.error("Invalid JSON in custom data section");
        return;
      }
    }



    const sanitizedCore = Object.keys(formData).reduce(
      (acc, key) => ({
        ...acc,
        [key]: formData[key as keyof typeof formData].trim(),
      }),
      {} as typeof formData
    );

    const { ownerId, ...coreFields } = sanitizedCore;

    const payload = {
      ...coreFields,
      owner: data?.id,
      tags: tags.filter((tag) => tag.trim().length),
      //   membership: cleanedMembership,
      //   bankDetails: Object.values(bankDetails).some((val) => val.trim().length)
      //     ? Object.entries(bankDetails).reduce(
      //         (acc, [key, value]) => ({
      //           ...acc,
      //           [key]: value.trim(),
      //         }),
      //         {} as typeof bankDetails
      //       )
      //     : undefined,
      data: parsedData,
    };

    setLoading(true);
    try {
      const res = await axios.post(`${API}/uploadPluginDetails`, payload, {
        withCredentials: true,
      });
      console.log(res?.data, "res");
      toast.success("Plugin details saved successfully");
      resetForm();
    } catch (error) {
      errorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-gradient-to-br from-white via-[#fdf4eb] to-white px-4 pt-4 text-gray-900 sm:px-8">
      <div className="mx-auto flex  max-w-5xl flex-col gap-6">
        <header className="space-y-2 rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            Plugin Workspace
          </p>
          <h1 className="font-space-grotesk text-3xl font-bold text-gray-900 md:text-4xl">
            Publish a New Plugin
          </h1>
          <p className="max-w-3xl text-sm text-gray-600">
            Provide required metadata, pricing plans, and deployment details for
            your Relmes plugin. All fields marked with an asterisk (*) are
            required.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 pb-16">
          <section className={sectionCardStyles}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Core Details
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: "Plugin Name *", field: "pluginName" },
                {
                  label: "Generated Plugin ID (plg_...) *",
                  field: "generatedpluginId",
                },
                { label: "Plugin Version *", field: "pluginVersion" },
                { label: "Plugin Type *", field: "pluginType" },
                { label: "Production Domain *", field: "productiondomain" },
                // { label: "Slug *", field: "slug" },
                // { label: "Schema Name *", field: "schema" },
                // { label: "Owner User ID", field: "ownerId" },
                { label: "Icon URL", field: "icon" },
              ].map(({ label, field }) => (
                <label
                  key={field}
                  className="text-sm font-medium text-gray-700"
                >
                  {label}
                  <input
                    className={`${inputStyles} mt-1`}
                    value={formData[field as keyof typeof formData]}
                    onChange={(event) =>
                      updateFormField(
                        field as keyof typeof formData,
                        event.target.value
                      )
                    }
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </label>
              ))}
            </div>
            <label className="mt-4 block text-sm font-medium text-gray-700">
              Description
              <textarea
                className={`${inputStyles} mt-1 min-h-[120px]`}
                value={formData.description}
                onChange={(event) =>
                  updateFormField("description", event.target.value)
                }
                placeholder="Describe what your plugin does and any setup notes."
              />
            </label>
          </section>

          <section className={sectionCardStyles}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Membership Plans
              </h2>
              <button
                type="button"
                onClick={addPlan}
                className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black"
              >
                + Add Plan
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Optional pricing tiers you offer for this plugin.
            </p>
            <div className="mt-4 space-y-4">
              {membershipPlans.map((plan, planIndex) => (
                <div
                  key={`plan-${planIndex}`}
                  className="rounded-xl border border-gray-100 bg-gray-50/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      Plan #{planIndex + 1}
                    </h3>
                    {membershipPlans.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePlan(planIndex)}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <label className="text-sm font-medium text-gray-700">
                      Plan Name
                      <input
                        className={`${inputStyles} mt-1`}
                        value={plan.planName}
                        onChange={(event) =>
                          updatePlan(planIndex, "planName", event.target.value)
                        }
                        placeholder="Basic / Pro / Enterprise"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Price (USD)
                      <input
                        type="number"
                        min="0"
                        className={`${inputStyles} mt-1`}
                        value={plan.price}
                        onChange={(event) =>
                          updatePlan(planIndex, "price", event.target.value)
                        }
                        placeholder="e.g. 15"
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Duration (days)
                      <input
                        type="number"
                        min="0"
                        className={`${inputStyles} mt-1`}
                        value={plan.duration}
                        onChange={(event) =>
                          updatePlan(planIndex, "duration", event.target.value)
                        }
                        placeholder="30"
                      />
                    </label>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Features
                      </span>
                      <button
                        type="button"
                        onClick={() => addFeature(planIndex)}
                        className="text-sm text-gray-700 hover:text-black"
                      >
                        + Feature
                      </button>
                    </div>
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={`feature-${planIndex}-${featureIndex}`}
                        className="flex items-center gap-3"
                      >
                        <input
                          className={inputStyles}
                          value={feature}
                          onChange={(event) =>
                            updateFeature(
                              planIndex,
                              featureIndex,
                              event.target.value
                            )
                          }
                          placeholder="Describe included benefit"
                        />
                        {plan.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeFeature(planIndex, featureIndex)
                            }
                            className="text-xs font-semibold text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={sectionCardStyles}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Tags</h2>
            <p className="text-sm text-gray-500">
              Help users find your plugin. Add descriptive keywords.
            </p>
            <div className="mt-4 space-y-3">
              {tags.map((tag, index) => (
                <div key={`tag-${index}`} className="flex items-center gap-3">
                  <input
                    className={inputStyles}
                    value={tag}
                    onChange={(event) => updateTag(index, event.target.value)}
                    placeholder="e.g. automation, productivity"
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-xs font-semibold text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="text-sm font-semibold text-gray-700 hover:text-black"
              >
                + Add Tag
              </button>
            </div>
          </section>

          {/* <section className={sectionCardStyles}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Custom Data Payload
            </h2>
            <p className="text-sm text-gray-500">
              Provide any JSON configuration your plugin requires (e.g. data
              schema, default settings).
            </p>
            <textarea
              className={`${inputStyles} mt-4 min-h-[180px] font-mono`}
              placeholder='{"settings": {"access": "read-only"}}'
              value={formData.data}
              onChange={(event) => updateFormField("data", event.target.value)}
            />
          </section> */}

          <div className="sticky bottom-0 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-5 shadow-lg backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Ready to publish?
              </p>
              <p className="text-xs text-gray-500">
                We&apos;ll validate your plugin details before saving.
              </p>
            </div>
            <button
            
              //   type="submit"
              onClick={(event) => {
                handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
              }}
              //   disabled={loading}
              className="rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Plugin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPluginPage;
