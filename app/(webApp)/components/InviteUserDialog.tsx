"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Search, Shield, Database, Check, X } from "lucide-react";
import axios from "axios";
import { API } from "@/app/utils/helpers";
import toast from "react-hot-toast";

interface Plugin {
    _id: string;
    pluginName?: string;
    type?: string;
    icon?: string;
    productiondomain?: string;
}

interface PluginAccess {
    pluginId: string;
    pluginName: string;
    hasAccess: boolean;
}

interface InviteUserDialogProps {
    serverId: string;
    invitedBy: string;
    plugins: Plugin[];
    onInviteSuccess?: () => void;
    onClose?: () => void;
}

const InviteUserDialog: React.FC<InviteUserDialogProps> = ({
    serverId,
    invitedBy,
    plugins,
    onInviteSuccess,
    onClose,
}) => {
    const [loading, setLoading] = useState(false);

    // Form state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedUserEmail, setSelectedUserEmail] = useState("");
    const [role, setRole] = useState<"admin" | "member">("member");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    // Plugin access state
    const [pluginAccess, setPluginAccess] = useState<Record<string, PluginAccess>>({});

    // Initialize plugin access
    useEffect(() => {
        const initialAccess: Record<string, PluginAccess> = {};
        plugins.forEach((plugin) => {
            initialAccess[plugin._id] = {
                pluginId: plugin._id,
                pluginName: plugin.pluginName || plugin.type || "Unknown Plugin",
                hasAccess: false,
            };
        });
        setPluginAccess(initialAccess);
    }, [plugins]);

    // Auto-search as user types with debouncing
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery.trim().length > 0) {
                handleSearchUsers();
            } else {
                setSearchResults([]);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Search users
    const handleSearchUsers = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setSearching(true);
            const res = await axios.get(`${API}/users/search`, {
                params: { query: searchQuery },
            });

            if (res?.data?.success) {
                setSearchResults(res?.data?.users || []);
            }
        } catch (error) {
            console.error("Error searching users:", error);
            toast.error("Failed to search users");
        } finally {
            setSearching(false);
        }
    };

    // Select user from search results
    const handleSelectUser = (user: any) => {
        console.log(user, "user");
        // Handle both _id and id fields from API
        const userId = user._id || user.id;
        setSelectedUserId(userId);
        setSelectedUserEmail(user.email);
        // Keep search results visible, don't clear them
    };

    // Toggle plugin access
    const togglePluginAccess = (pluginId: string) => {
        setPluginAccess((prev) => ({
            ...prev,
            [pluginId]: {
                ...prev[pluginId],
                hasAccess: !prev[pluginId].hasAccess,
            },
        }));
    };



    // Send invitation
    const handleInviteUser = async () => {
        if (!selectedUserId) {
            toast.error("Please select a user to invite");
            return;
        }

        // Prepare plugin IDs - only send IDs of plugins with access
        const pluginIds = Object.values(pluginAccess)
            .filter((p) => p.hasAccess)
            .map((p) => p.pluginId);

        const payload = {
            userId: selectedUserId,
            role,
            invitedBy,
            pluginIds, // Send empty array if no plugins selected
        };

        try {
            setLoading(true);
            const res = await axios.post(`${API}/servers/${serverId}/users/invite`, payload);

            if (res?.data?.message) {
                toast.success(res.data.message);
                resetForm();
                onInviteSuccess?.();
                onClose?.();
            }
        } catch (error: any) {
            console.error("Error inviting user:", error);
            toast.error(error?.response?.data?.error || "Failed to invite user");
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setSelectedUserId("");
        setSelectedUserEmail("");
        setSearchQuery("");
        setSearchResults([]);
        setRole("member");

        const resetAccess: Record<string, PluginAccess> = {};
        plugins.forEach((plugin) => {
            resetAccess[plugin._id] = {
                pluginId: plugin._id,
                pluginName: plugin.pluginName || plugin.type || "Unknown Plugin",
                hasAccess: false,
            };
        });
        setPluginAccess(resetAccess);
    };

    const selectedPluginsCount = Object.values(pluginAccess).filter(
        (p) => p.hasAccess
    ).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0  bg-black/60 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Dialog Content */}
            <div
                className="relative z-50 overflow-auto  w-full max-w-2xl  max-h-[90vh] overflow-y-auto bg-[#2d2d2d]  rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-[#2d2d2d] border-b border-white/10 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-white" />
                        <div className="text-lg font-semibold text-white">Invite User to Server</div>
                    </div>
                    <div
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                    >
                        <X className="h-4 w-4 text-white" />
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    {/* User Search Section */}
                    <div className="space-y-2">
                        <div className="text-sm font-semibold text-white">Search User</div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by email or username..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                            />
                            {searching && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="border border-white/10 rounded-lg max-h-48 overflow-y-auto">
                                {searchResults.map((user) => {
                                    const userId = user._id || user.id;
                                    const isSelected = selectedUserId === userId;
                                    return (
                                        <div
                                            key={userId}
                                            onClick={() => handleSelectUser(user)}
                                            className={`p-3 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors ${isSelected
                                                ? "bg-blue-900/20 border-blue-500/30"
                                                : "hover:bg-white/5"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className={`text-sm font-medium ${isSelected ? "text-blue-400" : "text-white"}`}>
                                                        {user.fullname || user.username}
                                                    </div>
                                                    <div className={`text-sm ${isSelected ? "text-blue-300" : "text-gray-400"}`}>
                                                        {user.email}
                                                    </div>
                                                </div>
                                                {isSelected && <Check className="h-4 w-4 text-blue-500" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>

                    {/* Plugin Access Section */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-white flex items-center gap-2">
                                <Database className="h-4 w-4" />
                                Plugin Access
                            </div>
                            <div className="px-3 py-1 bg-[#1a1a1a] border border-white/10 rounded-full text-sm text-white">
                                {selectedPluginsCount} of {plugins.length} selected
                            </div>
                        </div>

                        {plugins.length === 0 ? (
                            <div className="p-6 text-center text-gray-400 bg-[#1a1a1a] rounded-lg border border-white/10">
                                No plugins available in this server
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-96 overflow-y-auto border border-white/10 rounded-lg p-3 bg-[#1a1a1a]">
                                {plugins.map((plugin) => {
                                    const access = pluginAccess[plugin._id];
                                    if (!access) return null;

                                    return (
                                        <div
                                            key={plugin._id}
                                            onClick={() => togglePluginAccess(plugin._id)}
                                            className={`rounded-lg p-3 border transition-all cursor-pointer ${access.hasAccess
                                                ? "border-blue-500 bg-blue-900/10"
                                                : "border-white/10 bg-[#252525] hover:bg-[#2a2a2a]"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                                                        {plugin.icon ? (
                                                            <img
                                                                src={plugin.icon}
                                                                alt={plugin.pluginName}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <Database className="h-4 w-4 text-white" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-white">
                                                            {plugin.pluginName || plugin.type || "Unknown Plugin"}
                                                        </div>
                                                        <div className="text-xs text-gray-400">{plugin.type}</div>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${access.hasAccess
                                                        ? "bg-blue-500 border-blue-500"
                                                        : "border-white/30"
                                                        }`}
                                                >
                                                    {access.hasAccess && <Check className="h-3 w-3 text-white" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-3 border-t border-white/10">
                        <div
                            onClick={() => {
                                resetForm();
                                onClose?.();
                            }}
                            className="flex-1 py-2.5 rounded-lg text-center text-sm font-medium cursor-pointer transition-colors bg-[#1a1a1a] text-white border border-white/10 hover:bg-white/5"
                        >
                            Cancel
                        </div>
                        <div
                            onClick={handleInviteUser}
                            className={`flex-1 py-2.5 rounded-lg text-center text-sm font-medium cursor-pointer transition-colors ${!selectedUserId || loading
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-white text-black hover:bg-gray-200"
                                }`}
                        >
                            {loading ? "Inviting..." : "Send Invitation"}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default InviteUserDialog;
