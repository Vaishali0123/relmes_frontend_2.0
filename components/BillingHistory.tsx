import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Server, Package, Clock, AlertTriangle } from "lucide-react";

const BillingHistory = () => {
  // Mock data for billing history
  const billingData = [
    {
      id: 1,
      type: "Server",
      name: "Production Server #1",
      purchaseDate: "2024-01-15",
      expiryDate: "2025-01-15",
      amount: "$299.99",
      status: "active",
      plugins: ["Plugin A", "Plugin B", "Plugin C"],
    },
    {
      id: 2,
      type: "Plugin",
      name: "Advanced Analytics Plugin",
      purchaseDate: "2024-02-20",
      expiryDate: "2024-08-20",
      amount: "$49.99",
      status: "expired",
      serverDependency: "Production Server #1",
    },
    {
      id: 3,
      type: "Server",
      name: "Development Server #2",
      purchaseDate: "2024-03-10",
      expiryDate: "2024-12-10",
      amount: "$199.99",
      status: "active",
      plugins: ["Plugin D"],
    },
    {
      id: 4,
      type: "Plugin",
      name: "Team Collaboration Plugin",
      purchaseDate: "2024-03-15",
      expiryDate: "2025-03-15",
      amount: "$79.99",
      status: "active",
      serverDependency: "Production Server #1",
    },
    {
      id: 5,
      type: "Plugin",
      name: "Backup Manager Plugin",
      purchaseDate: "2024-04-01",
      expiryDate: "2024-10-01",
      amount: "$29.99",
      status: "expiring_soon",
      serverDependency: "Development Server #2",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Expired
          </Badge>
        );
      case "expiring_soon":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Expiring Soon
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "Server" ? (
      <Server className="h-4 w-4 text-blue-600" />
    ) : (
      <Package className="h-4 w-4 text-purple-600" />
    );
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeServers = billingData.filter(
    (item) => item.type === "Server" && item.status === "active"
  );
  const totalSpent = billingData.reduce(
    (sum, item) => sum + parseFloat(item.amount.replace("$", "")),
    0
  );

  return (
    <div className="h-full p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Billing History
            </h1>
            <p className="text-muted-foreground">
              Manage your servers and plugins
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Servers
                  </p>
                  <p className="text-2xl font-bold">{activeServers.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Warning Alert for Expired/Expiring Items */}
        {billingData.some(
          (item) => item.status === "expired" || item.status === "expiring_soon"
        ) && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium">
                  You have expired or expiring items that may affect plugin
                  functionality.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Purchase History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Purchase Date
                    </TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Amount
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Dependencies/Plugins
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingData.map((item) => {
                    const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);

                    return (
                      <TableRow
                        key={item.id}
                        className={
                          item.status === "expired" ? "opacity-60" : ""
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            <span className="font-medium">{item.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.serverDependency && (
                              <p className="text-xs text-muted-foreground">
                                Requires: {item.serverDependency}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(item.purchaseDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>
                              {new Date(item.expiryDate).toLocaleDateString()}
                            </p>
                            {item.status === "active" && (
                              <p className="text-xs text-muted-foreground">
                                {daysUntilExpiry > 0
                                  ? `${daysUntilExpiry} days left`
                                  : "Expired"}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="font-medium">{item.amount}</span>
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {item.plugins ? (
                            <div className="flex flex-wrap gap-1">
                              {item.plugins.map((plugin, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {plugin}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              -
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Server Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeServers.map((server) => (
            <Card key={server.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-600" />
                  {server.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expires:</span>
                  <span>
                    {new Date(server.expiryDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Days left:</span>
                  <span className="font-medium">
                    {getDaysUntilExpiry(server.expiryDate)}
                  </span>
                </div>
                {server.plugins && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Active Plugins:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {server.plugins.map((plugin, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {plugin}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingHistory;
