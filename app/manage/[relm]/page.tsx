"use client";
import { API } from "@/app/utils/helpers";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, HardDrive, Server, TrendingUp } from "lucide-react";

// Utility functions for storage conversion
const formatStorageSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return "0 MB";

    const mb = bytes / (1024 * 1024);
    const gb = mb / 1024;

    if (gb >= 1) {
        return `${gb.toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
};

const calculatePercentage = (used: number, total: number): number => {
    if (!total || total === 0) return 0;
    return Math.min((used / total) * 100, 100);
};

const getStorageColor = (percentage: number): string => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-orange-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
};

interface PluginBreakdown {
    _id: string;
    storageUsed: number;
}

interface BreakdownData {
    serverName: string;
    totalStorage: number;
    usedStorage: number;
    breakdown: PluginBreakdown[];
}

const Page = () => {
    const params = useParams();
    const serverId = params.relm;
    const [breakdowndata, setBreakdowndata] = useState<BreakdownData | null>(null);
    const [loading, setLoading] = useState(true);

    const getStorage = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API}/storage/servers/${serverId}/breakdown`);
            console.log(res.data);
            setBreakdowndata(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (serverId) {
            getStorage();
        }
    }, [serverId]);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading storage data...</p>
                </div>
            </div>
        );
    }

    if (!breakdowndata) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-center">
                    <Database className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No storage data available</p>
                </div>
            </div>
        );
    }

    const totalUsagePercentage = calculatePercentage(
        breakdowndata.usedStorage || 0,
        breakdowndata.totalStorage || 0
    );

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Server className="h-8 w-8 text-primary" />
                            {breakdowndata.serverName || "Server Storage"}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Storage breakdown and usage analytics
                        </p>
                    </div>
                    <Badge
                        variant={
                            totalUsagePercentage >= 90
                                ? "destructive"
                                : totalUsagePercentage >= 75
                                    ? "secondary"
                                    : "outline"
                        }
                        className="text-lg px-4 py-2"
                    >
                        {totalUsagePercentage.toFixed(1)}% Used
                    </Badge>
                </div>

                {/* Overview Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5" />
                            Storage Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Total Storage</p>
                                <p className="text-2xl font-bold">
                                    {formatStorageSize(breakdowndata.totalStorage || 0)}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Used Storage</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {formatStorageSize(breakdowndata.usedStorage || 0)}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Available Storage</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatStorageSize(
                                        (breakdowndata.totalStorage || 0) - (breakdowndata.usedStorage || 0)
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Overall Usage</span>
                                <span className="font-semibold">{totalUsagePercentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${getStorageColor(
                                        totalUsagePercentage
                                    )}`}
                                    style={{ width: `${totalUsagePercentage}%` }}
                                />
                            </div>
                        </div>

                        {totalUsagePercentage >= 75 && (
                            <div
                                className={`flex items-center gap-2 p-3 rounded-lg ${totalUsagePercentage >= 90
                                        ? "bg-red-50 text-red-700"
                                        : "bg-orange-50 text-orange-700"
                                    }`}
                            >
                                <TrendingUp className="h-4 w-4" />
                                <p className="text-sm font-medium">
                                    {totalUsagePercentage >= 90
                                        ? "Critical: Storage is almost full!"
                                        : "Warning: Storage usage is high"}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Plugins Storage Breakdown */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Plugin Storage Breakdown
                            <Badge variant="outline" className="ml-2">
                                {breakdowndata.breakdown?.length || 0} Plugins
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!breakdowndata.breakdown || breakdowndata.breakdown.length === 0 ? (
                            <div className="text-center py-12">
                                <Database className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                                <p className="text-muted-foreground">No plugins installed</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {breakdowndata.breakdown.map((item: any) => {
                                    const pluginPercentage = calculatePercentage(
                                        item.storageUsed || 0,
                                        breakdowndata.totalStorage || 0
                                    );

                                    return (
                                        <div
                                            key={item._id}
                                            className="border rounded-xl p-4 hover:shadow-md transition-all duration-200 bg-white"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <Database className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">
                                                            {item._id || "Unknown Plugin"}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground">
                                                            {pluginPercentage.toFixed(1)}% of total
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">Storage Used</span>
                                                    <span className="font-semibold text-lg">
                                                        {formatStorageSize(item.storageUsed || 0)}
                                                    </span>
                                                </div>

                                                {/* Plugin Progress Bar */}
                                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-500 ${getStorageColor(
                                                            pluginPercentage
                                                        )}`}
                                                        style={{ width: `${pluginPercentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Statistics Card */}
                {breakdowndata.breakdown && breakdowndata.breakdown.length > 0 && (
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Storage Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Total Plugins</p>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {breakdowndata.breakdown.length}
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Largest Plugin</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {formatStorageSize(
                                            Math.max(...breakdowndata.breakdown.map((p) => p.storageUsed || 0))
                                        )}
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Average Usage</p>
                                    <p className="text-3xl font-bold text-purple-600">
                                        {formatStorageSize(
                                            (breakdowndata.usedStorage || 0) / breakdowndata.breakdown.length
                                        )}
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Smallest Plugin</p>
                                    <p className="text-3xl font-bold text-orange-600">
                                        {formatStorageSize(
                                            Math.min(...breakdowndata.breakdown.map((p) => p.storageUsed || 0))
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Page;
