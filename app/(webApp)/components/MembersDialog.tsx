"use client";

import React, { useState, useEffect } from "react";
import { X, User, Shield, Database, Calendar } from "lucide-react";
import axios from "axios";
import { API } from "@/app/utils/helpers";
import toast from "react-hot-toast";

interface Member {
    _id: string;
    name: string;
    email: string;
    role: "Admin" | "member";
    joinDate: string;
    pluginAccess?: string[];
}

interface Plugin {
    _id: string;
    pluginName?: string;
    type?: string;
    icon?: string;
}

interface MembersDialogProps {
    serverId: string;
    plugins: Plugin[];
    onClose: () => void;
}

const MembersDialog: React.FC<MembersDialogProps> = ({
    serverId,
    plugins,
    onClose,
}) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMembers();
    }, [serverId]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API}/server-members/${serverId}`);
console.log(res.data)
            if (res?.data?.success) {
                setMembers(res.data.members || []);
            }
        } catch (error: any) {
            console.error("Error fetching members:", error);
            toast.error(error?.response?.data?.error || "Failed to fetch members");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getPluginInfo = (pluginId: string) => {
        return plugins.find((p) => p._id === pluginId);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Dialog Content */}
            <div
                className="relative z-50 w-full max-w-4xl max-h-[90vh] overflow-hidden bg-[#2d2d2d] rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-[#2d2d2d] border-b border-white/10 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-white" />
                        <div className="text-lg font-semibold text-white">Members</div>
                    </div>
                    <div
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                    >
                        <X className="h-4 w-4 text-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        </div>
                    ) : members.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            No members found in this server
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {members.map((member) => (
                                <div
                                    key={member._id}
                                    className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 hover:bg-[#252525] transition-colors"
                                >
                                    {/* Member Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className="h-[35px] w-[35px] rounded-[13px] bg-[#2d2d2d] flex items-center justify-center">
                                                <span className="text-black font-semibold text-lg">
                                                    {member.name?.charAt(0)?.toUpperCase() || "U"}
                                                </span>
                                            </div>

                                            {/* Member Info */}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-white font-semibold">
                                                        {member.name}
                                                    </div>{
                                                        member.role === "Admin" &&(
                                                              <div
                                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.role === "Admin"
                                                            ? "bg-orange-500/20 text-orange-400"
                                                            : "bg-blue-500/20 text-blue-400"
                                                            }`}
                                                    >
                                                        <Shield className="inline h-3 w-3 mr-1" />
                                                        {member.role}
                                                    </div>
                                                        )
                                                    }
                                                  
                                                </div>
                                                <div className="text-sm text-gray-400">{member.email}</div>
                                                {/* <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Joined {formatDate(member.joinDate)}
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Plugin Access */}
                                    {member.pluginAccess && member.pluginAccess.length > 0 ? (
                                        <div className="border-t border-white/10 pt-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Database className="h-4 w-4 text-gray-400" />
                                                <div className="text-sm font-medium text-gray-300">
                                                    Plugin Access ({member.pluginAccess.length})
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {member.pluginAccess.map((pluginId) => {
                                                    const plugin = getPluginInfo(pluginId);
                                                    return (
                                                        <div
                                                            key={pluginId}
                                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#252525] border border-white/10 rounded-lg"
                                                        >
                                                            {plugin?.icon ? (
                                                                <img
                                                                    src={plugin.icon}
                                                                    alt={plugin.pluginName}
                                                                    className="h-4 w-4 rounded object-cover"
                                                                />
                                                            ) : (
                                                                <Database className="h-4 w-4 text-gray-400" />
                                                            )}
                                                            <span className="text-sm text-white">
                                                                {plugin?.pluginName || plugin?.type || pluginId}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-t border-white/10 pt-3">
                                            <div className="text-sm text-gray-500 italic">
                                                No plugin access granted
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MembersDialog;
