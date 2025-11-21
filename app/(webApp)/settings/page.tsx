// "use client";
// import { useState } from "react";
// import {
//   Server,
//   CreditCard,
//   Settings,
//   Clock,
//   Sun,
//   LogOut,
//   ChevronUp,
//   ChevronDown,
// } from "lucide-react";

// export default function SettingsPage() {
//   const [serversExpanded, setServersExpanded] = useState(true);

//   const servers = [
//     {
//       name: "Experience",
//       members: null,
//       icon: Clock,
//       badge: "Start Free Trial",
//       color: "bg-white",
//     },
//     {
//       name: "WilloWave",
//       members: "40,000 Members",
//       icon: null,
//       logo: "W",
//       color: "bg-gray-900",
//     },
//     {
//       name: "Apna City",
//       members: "98,070 Members",
//       icon: null,
//       logo: "🏙️",
//       color: "bg-white",
//     },
//     {
//       name: "FigVerse",
//       members: "5,000",
//       icon: null,
//       logo: "💬",
//       color: "bg-blue-600",
//     },
//   ];

//   return (
//     <div className=" h-screen pr-2 ">
//       {/* Main Content */}
//       <div className="w-full space-y-2">
//         <div className="flex items-center h-[80px] justify-center">
//           <div className="text-2xl font-semibold font-space-grotesk bg-white border border-[#f4f4f4da] w-full p-4 rounded-2xl text-gray-900 ">
//             Settings
//           </div>
//         </div>

//         <div className="bg-white relative rounded-3xl w-full p-8 border border-[#f4f4f4da] h-[calc(100vh-100px)] ">
//           <h2 className="text-xl font-semibold font-space-grotesk text-gray-900 mb-8">
//             Account Information
//           </h2>

//           {/* Profile Picture */}
//           <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#f4f4f4da]">
//             <div>
//               <div className="text-sm text-gray-600 mb-1">Profile Picture</div>
//               <div className="text-gray-900">Set an avatar</div>
//             </div>
//             <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center">
//               <span className="text-white text-xl">👤</span>
//             </div>
//           </div>

//           {/* Name */}
//           <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#f4f4f4da]">
//             <div>
//               <div className="text-sm text-gray-600 mb-1">Name</div>
//               <div className="text-gray-900 font-medium">Maya Sinclair</div>
//             </div>
//             <button className="text-amber-500 hover:text-amber-600 font-medium">
//               Update
//             </button>
//           </div>

//           {/* Email */}
//           <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#f4f4f4da]">
//             <div>
//               <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
//                 Email
//                 <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded">
//                   Verified
//                 </span>
//               </div>
//               <div className="text-gray-900 font-medium">hey@agency.com</div>
//             </div>
//             <button className="text-amber-500 hover:text-amber-600 font-medium">
//               Update
//             </button>
//           </div>

//           {/* Password */}
//           <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#f4f4f4da]">
//             <div>
//               <div className="text-sm text-gray-600 mb-1">Password</div>
//               <div className="text-gray-900">Las changed Sep 21, 2023</div>
//             </div>
//             <button className="text-amber-500 hover:text-amber-600 font-medium">
//               Update
//             </button>
//           </div>

//           {/* Sign Out Everywhere */}
//           <div>
//             <div className="text-sm font-medium text-gray-900 mb-2">
//               Sign Out Everywhere
//             </div>
//             <p className="text-sm text-gray-600 mb-4">
//               If you lost a device or left logged in a public computer, you can
//               sign out everywhere except your current browser.
//             </p>
//             <button className="flex items-center absolute bottom-4 right-4 gap-2 text-red-600 hover:text-red-700 font-medium">
//               <LogOut className="w-4 h-4" />
//               Sign out everywhere
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuthContext } from "../auth/components/auth";
import { API } from "@/app/utils/helpers";
import { CiUser } from "react-icons/ci";

export default function SettingsPage() {
  const { data } = useAuthContext();
  const userId = data?.id;

  const [user, setUser] = useState(data);
  const [loading, setLoading] = useState(false);
  const [picPreview, setPicPreview] = useState<string | null>(
    user?.profilePicUrl || null
  );
  const [newPicFile, setNewPicFile] = useState<File | null>(null);

  // Handle profile picture selection
  const handlePicChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPicFile(file);
      setPicPreview(URL.createObjectURL(file));
    }
  };

  // Submit ALL profile updates together
  const updateProfile = async () => {
    if (!user) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("fullname", user.fullname || "");
    formData.append("username", user.username || "");
    formData.append("phone", user.phone || "");

    if (newPicFile) {
      formData.append("profilePic", newPicFile);
    }

    const res = await fetch(`${API}/update-profile/${userId}`, {
      method: "PUT",
      body: formData,
    });

    const resdata = await res.json();
    setLoading(false);

    if (resdata.success) {
      alert("Profile updated successfully!");
      setUser(resdata.data); // update UI with new backend values
    } else {
      alert(resdata.message);
    }
  };

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="h-screen w-full px-3 py-4">
      {/* Header */}
      <div className="flex items-center justify-center mb-4">
        <div className="text-lg font-semibold font-space-grotesk bg-white border border-gray-200 shadow-sm w-full p-3 rounded-xl text-gray-900">
          Settings
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl w-full p-6 border border-gray-200 shadow-sm h-[calc(100vh-100px)] overflow-auto">
        <h2 className="text-base font-semibold font-space-grotesk text-gray-900 mb-6">
          Account Information
        </h2>

        {/* Profile Picture Section */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div>
            <div className="text-xs text-gray-500">Profile Picture</div>
            <div className="text-gray-900 text-sm font-medium">
              Set an avatar
            </div>
          </div>

          <label className="w-[40px] h-[40px] rounded-[16px] bg-gray-100 flex items-center justify-center shadow-inner cursor-pointer overflow-hidden">
            {picPreview ? (
              <img
                src={picPreview}
                className="w-full h-full object-cover"
                alt="profile"
              />
            ) : (
              <CiUser size={20} className="text-black" />
            )}

            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handlePicChange}
            />
          </label>
        </div>

        {/* Name */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div>
            <div className="text-xs text-gray-500">Name</div>
            <input
              className="text-gray-900 text-sm font-medium outline-none bg-transparent"
              value={user.fullname}
              onChange={(e) => setUser({ ...user, fullname: e.target.value })}
            />
          </div>
        </div>

        {/* Email (Not editable) */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div>
            <div className="text-xs text-gray-500">Email</div>
            <div className="text-gray-900 text-sm font-medium">
              {user.email}
            </div>
          </div>

          <button className="text-gray-300 text-xs cursor-not-allowed font-medium">
            —
          </button>
        </div>

        {/* Username */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div>
            <div className="text-xs text-gray-500">Username</div>
            <input
              className="text-gray-900 text-sm font-medium outline-none bg-transparent"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div>
            <div className="text-xs text-gray-500">Phone</div>
            <input
              className="text-gray-900 text-sm font-medium outline-none bg-transparent"
              value={user.phone || ""}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row gap-2 w-full justify-end items-center">
          {/* Update profile button */}
          <button
            disabled={loading}
            onClick={updateProfile}
            className="px-6 hover:opacity-75 py-2 rounded-[12px] text-white bg-black"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>

          <button className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium rounded-lg px-2 py-1">
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import { useState } from "react";
// import {
//   LogOut,
//   CalendarDays,
//   User2,
//   Mail,
//   KeyRound,
//   Image as ImageIcon,
// } from "lucide-react";

// export default function SettingsPage() {
//   return (
//     <div className="h-screen w-full px-3 py-4">
//       {/* Header */}
//       <div className="flex items-center justify-center mb-4">
//         <div className="text-lg font-semibold font-space-grotesk bg-white border border-gray-200 shadow-sm w-full p-3 rounded-xl text-gray-900">
//           Settings
//         </div>
//       </div>

//       {/* Card */}
//       <div className="bg-white rounded-2xl w-full p-6 border border-gray-200 shadow-sm h-[calc(100vh-100px)] overflow-auto">
//         <h2 className="text-base font-semibold font-space-grotesk text-gray-900 mb-6">
//           Account Information
//         </h2>

//         {/* Profile Picture Section */}
//         <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
//           <div>
//             <div className="text-xs text-gray-500">Profile Picture</div>
//             <div className="text-gray-900 text-sm font-medium">
//               Set an avatar
//             </div>
//           </div>

//           <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center shadow-inner">
//             <ImageIcon className="w-4 h-4 text-white opacity-80" />
//           </div>
//         </div>

//         {/* Name */}
//         <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
//           <div>
//             <div className="text-xs text-gray-500">Name</div>
//             <div className="text-gray-900 text-sm font-medium">
//               Maya Sinclair
//             </div>
//           </div>
//           <button className="text-amber-500 text-xs hover:text-amber-600 font-medium">
//             Update
//           </button>
//         </div>

//         {/* Email */}
//         <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
//           <div>
//             <div className="text-xs text-gray-500 flex items-center gap-2">
//               Email
//               <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded">
//                 Verified
//               </span>
//             </div>
//             <div className="text-gray-900 text-sm font-medium">
//               hey@agency.com
//             </div>
//           </div>
//           <button className="text-amber-500 text-xs hover:text-amber-600 font-medium">
//             Update
//           </button>
//         </div>

//         {/* Password */}
//         <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
//           <div>
//             <div className="text-xs text-gray-500">Password</div>
//             <div className="text-gray-900 text-sm">
//               Last changed Sep 21, 2023
//             </div>
//           </div>
//           <button className="text-amber-500 text-xs hover:text-amber-600 font-medium">
//             Update
//           </button>
//         </div>

//         {/* Sign Out Everywhere */}
//         <div className="">
//           <div className="text-xs font-medium text-gray-900 mb-1">
//             Sign Out Everywhere
//           </div>
//           <p className="text-xs text-gray-500 mb-4 leading-relaxed">
//             If you lost a device or logged in on a public system, you can sign
//             out everywhere except this browser.
//           </p>

//           <button className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium rounded-lg px-2 py-1">
//             <LogOut className="w-4 h-4" />
//             Sign out everywhere
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
