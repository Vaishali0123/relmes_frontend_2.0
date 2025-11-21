"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  UserPlus,
  Settings as SettingsIcon,
  Server,
  Users,
  Clock,
} from "lucide-react";
import axios from "axios";
import { API } from "@/app/utils/helpers";
import toast, { Toaster } from "react-hot-toast";
import { useAuthContext } from "@/app/(webApp)/auth/components/auth";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  joinDate: string;
}

const Settings = () => {
  const [userRole] = useState<"admin" | "member">("admin"); // Mock user role
  const [userName, setUserName] = useState("");
  const [serverValidity, setServerValidity] = useState("30");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<"admin" | "member">(
    "member"
  );
  const [fullname, setFullname] = useState("");
  const { data } = useAuthContext();

  // const [activeTab, setActiveTab] = useState("profile");
  // const [loading, setLoading] = useState(false);

  // Profile
  const [email, setEmail] = useState("");

  // Server
  const [serverName, setServerName] = useState("");
  // const [serverId, setServerId] = useState("");

  // Team
  const [teamMembers, setTeamMembers] = useState<
    {
      id: string;
      name: string;
      email: string;
      role: "admin" | "member";
      joinDate: string;
    }[]
  >([]);

  // WP Command
  // const [commandPrompt, setCommandPrompt] = useState("");
  // const [commandOutput, setCommandOutput] = useState("");
  // const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
  //   {
  //     id: "1",
  //     name: "John Doe",
  //     email: "john@company.com",
  //     role: "admin",
  //     joinDate: "2024-01-15",
  //   },
  //   {
  //     id: "2",
  //     name: "Jane Smith",
  //     email: "jane@company.com",
  //     role: "member",
  //     joinDate: "2024-02-01",
  //   },
  //   {
  //     id: "3",
  //     name: "Mike Johnson",
  //     email: "mike@company.com",
  //     role: "member",
  //     joinDate: "2024-02-10",
  //   },
  // ]);

  // const handleSaveProfile = () => {
  //   toast({
  //     title: "Profile Updated",
  //     description: "Your profile information has been saved successfully.",
  //   });
  // };

  // const handleSaveServer = () => {
  //   if (userRole !== "admin") {
  //     toast({
  //       title: "Access Denied",
  //       description: "Only administrators can modify server settings.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
  //   toast({
  //     title: "Server Settings Updated",
  //     description: "Server configuration has been saved successfully.",
  //   });
  // };

  const handleAddMember = () => {
    if (!newMemberEmail) {
      // toast({
      //   title: "Email Required",
      //   description: "Please enter a valid email address.",
      //   variant: "destructive",
      // });
      toast.error("Email Required");
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberEmail.split("@")[0],
      email: newMemberEmail,
      role: newMemberRole,
      joinDate: new Date().toISOString().split("T")[0],
    };

    setTeamMembers([...teamMembers, newMember]);
    setNewMemberEmail("");
    setNewMemberRole("member");

    // toast({
    //   title: "Member Added",
    //   description: `${newMemberEmail} has been invited to the team.`,
    // });
    toast("Member Added: " + newMemberEmail);
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== memberId));
    toast.error("Member Removed: " + memberId);
    // toast({
    //   title: "Member Removed",
    //   description: "Team member has been removed successfully.",
    // });
  };
  // const fetchTeam = async () => {
  //   try {
  //     const res = await axios.get(`${API}/getUserServers/${data?.id}`);
  //     setTeamMembers(res.data);
  //   } catch (err) {
  //     toast.error("Failed to load team");
  //   }
  // };
  const fetchUserServer = async () => {
    try {
      const res = await axios.get(`${API}/getUserServers/${data?.id}`);
      console.log(res.data, "User Servers");
    } catch (err) {
      console.log(err);
      toast.error("Failed to load team");
    }
  };
  useEffect(() => {
    if (!data) return;
    fetchUserServer();
    // fetchTeam();
  }, []);

  const handleUpdateProfile = async () => {
    // setLoading(true);
    try {
      await axios.post(`${API}/update-profile/${data?.id}`, {
        fullname,
        username: userName,

        email,
      });
      toast.success("Profile updated!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update profile");
    } finally {
      // setLoading(false);
    }
  };

  const handleUpdateServer = async () => {
    // setLoading(true);
    try {
      await axios.patch(`${API}/update-server`, {
        // serverId,
        name: serverName,
      });
      toast.success("Server updated!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update server");
    } finally {
      // setLoading(false);
    }
  };

  // const handleRunCommand = async () => {
  //   if (!commandPrompt.trim()) return toast.error("Prompt cannot be empty");
  //   // setLoading(true);
  //   try {
  //     const res = await axios.post(`${API}/run-command`, {
  //       prompt: commandPrompt,
  //     });
  //     setCommandOutput(res.data?.result || "No output");
  //     toast.success("Command executed");
  //   } catch (err) {
  //     toast.error("Command failed");
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  return (
    <div className="h-full overflow-x-auto w-full bg-background px-6">
      <Toaster />
      <div className="max-w-4xl mt-5  space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-black" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground text-[14px]">
              Manage your team workspace and preferences
            </p>
          </div>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your user name"
              />
            </div>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
            <button
              // onClick={handleSaveProfile}
              onClick={handleUpdateProfile}
              className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-[10px] text-[14px]"
            >
              Save Profile
            </button>
          </CardContent>
        </Card>

        {/* Server Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Server Settings
              {userRole === "admin" && (
                <Badge variant="secondary">Admin Only</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Configure server name and validity settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serverName">Server Name</Label>
              <Input
                id="serverName"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="Enter server name"
                disabled={userRole !== "admin"}
              />
              {userRole !== "admin" && (
                <p className="text-sm text-muted-foreground">
                  Only administrators can edit the server name
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serverValidity">Server Validity (Days)</Label>
              <Select
                value={serverValidity}
                onValueChange={setServerValidity}
                disabled={userRole !== "admin"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select validity period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleUpdateServer}
              disabled={userRole !== "admin"}
              className="w-full sm:w-auto"
            >
              <Clock className="h-4 w-4 mr-2" />
              Update Server Settings
            </Button>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </CardTitle>
            <CardDescription>
              Manage team members and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Member Form */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add New Member
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="memberEmail">Email Address</Label>
                  <Input
                    id="memberEmail"
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="member@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberRole">Role</Label>
                  <Select
                    value={newMemberRole}
                    onValueChange={(value: "admin" | "member") =>
                      setNewMemberRole(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddMember} className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Members List */}
            <div className="space-y-4">
              <h3 className="font-semibold">
                Current Members ({teamMembers.length})
              </h3>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-foreground">
                            {member.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                        <Badge
                          variant={
                            member.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {member.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined: {new Date(member.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
