// 'use client';

// import React, { useState, useEffect } from 'react';
// import { CheckCircle, XCircle, User, Mail, Calendar, Shield, RefreshCw, Check, X } from 'lucide-react';
// import { apiRequest } from '@/lib/api'; // Adjust path based on your project structure

// export default function AdminUsersPage() {
//     const [admins, setAdmins] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [totalCount, setTotalCount] = useState(0);

//     useEffect(() => {
//         fetchAdmins();
//     }, []);

//     const fetchAdmins = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             const response = await apiRequest('/user/admins', {
//                 method: 'GET'
//             });

//             const data = await response.json();

//             console.log('API Response:', data);

//             if (data.success && data.data) {
//                 setAdmins(data.data.admins || []);
//                 setTotalCount(data.data.count || 0);
//             } else {
//                 setError(data.message || 'Failed to fetch admins');
//             }
//         } catch (err) {
//             setError('An error occurred while fetching admins');
//             console.error('Fetch error:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const getVerifiedCount = () => admins.filter(a => a.verified).length;
//     const getPendingCount = () => admins.filter(a => a.status === "rejected").length;

//     const handleApprove = async (adminId) => {
//         if (!confirm('Are you sure you want to approve this admin? They will receive access to create courses and manage students.')) {
//             return;
//         }

//         try {
//             const response = await apiRequest(`/user/admins/${adminId}/approve`, {
//                 method: 'PUT'
//             });

//             const data = await response.json();

//             if (data.success) {
//                 alert('✅ Admin approved successfully! An approval email has been sent.');
//                 fetchAdmins();
//             } else {
//                 alert(`❌ Failed to approve admin: ${data.message || 'Unknown error'}`);
//             }
//         } catch (err) {
//             console.error('Approve error:', err);
//             alert('❌ An error occurred while approving admin. Please try again.');
//         }
//     };

//     const handleReject = async (adminId) => {
//         const confirmed = confirm('Are you sure you want to reject this admin?');

//         if (!confirmed) return;

//         try {
//             const response = await apiRequest(`/user/admins/${adminId}/reject`, {
//                 method: 'PATCH'
//             });

//             const data = await response.json();

//             if (data.success) {
//                 alert('Admin rejected successfully!');
//                 fetchAdmins();
//             } else {
//                 alert(`Failed to reject admin: ${data.message}`);
//             }
//         } catch (err) {
//             console.error('Reject error:', err);
//             alert('An error occurred while rejecting admin.');
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen p-6 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
//                     <p className="dark:text-gray-300 text-gray-600 font-medium">Loading admin users...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen p-6 flex items-center justify-center">
//                 <div className="max-w-md w-full">
//                     <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/50 rounded-lg p-6 text-center">
//                         <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
//                         <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Admins</h3>
//                         <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
//                         <button
//                             onClick={fetchAdmins}
//                             className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                         >
//                             <RefreshCw className="h-4 w-4 mr-2" />
//                             Try Again
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen p-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-6 flex items-center justify-between">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
//                             <Shield className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-500" />
//                             Admin Users Management
//                         </h1>
//                         <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage all administrator accounts</p>
//                     </div>
//                     <button
//                         onClick={fetchAdmins}
//                         className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
//                     >
//                         <RefreshCw className="h-4 w-4 mr-2" />
//                         Refresh
//                     </button>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                     <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Admins</p>
//                                 <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalCount}</p>
//                             </div>
//                             <div className="h-12 w-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
//                                 <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Verified</p>
//                                 <p className="text-3xl font-bold text-green-600 dark:text-green-500 mt-1">{getVerifiedCount()}</p>
//                             </div>
//                             <div className="h-12 w-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
//                                 <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Rejected Approval</p>
//                                 <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-500 mt-1">{getPendingCount()}</p>
//                             </div>
//                             <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-500/20 rounded-full flex items-center justify-center">
//                                 <XCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Table */}
//                 <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                             <thead className="bg-gray-50 dark:bg-gray-900/50">
//                                 <tr>
//                                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                                         Admin Details
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                                         Email Address
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                                         Verification Status
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                                         Account Created
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
//                                         Actions
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
//                                 {admins.length === 0 ? (
//                                     <tr>
//                                         <td colSpan="5" className="px-6 py-12 text-center">
//                                             <User className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
//                                             <p className="text-gray-500 dark:text-gray-400 font-medium">No admin users found</p>
//                                             <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Admin accounts will appear here once created</p>
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     admins.map((admin) => (
//                                         <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="flex items-center">
//                                                     <div className="flex-shrink-0 h-12 w-12">
//                                                         {admin.profileImage ? (
//                                                             <img
//                                                                 className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
//                                                                 src={admin.profileImage}
//                                                                 alt={admin.username}
//                                                             />
//                                                         ) : (
//                                                             <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center border-2 border-blue-300 dark:border-blue-400">
//                                                                 <User className="h-6 w-6 text-white" />
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                     <div className="ml-4">
//                                                         <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                                                             {admin.username}
//                                                         </div>
//                                                         <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1 gap-2">
//                                                             <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">ID: {admin.id}</span>
//                                                             <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-medium border border-blue-200 dark:border-blue-500/30">
//                                                                 {admin.role}
//                                                             </span>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="flex items-center text-sm text-gray-900 dark:text-gray-300">
//                                                     <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
//                                                     <span className="truncate">{admin.email}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 {(() => {
//                                                     switch (admin.status) {
//                                                         case "rejected":
//                                                             return <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30">
//                                                                 <XCircle className="h-4 w-4 mr-1.5" />
//                                                                 Approval Rejected
//                                                             </span>;
//                                                         case "pending":
//                                                             return <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30">
//                                                                 <XCircle className="h-4 w-4 mr-1.5" />
//                                                                 Waiting for Approval
//                                                             </span>;
//                                                         case "approved":
//                                                             return <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-500/30">
//                                                                 <CheckCircle className="h-4 w-4 mr-1.5" />
//                                                                 Approved
//                                                             </span>;
//                                                         default:
//                                                             return <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-500/30">
//                                                                 Admin
//                                                             </span>;
//                                                     }
//                                                 })()}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
//                                                 <div className="flex items-center">
//                                                     <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
//                                                     <span>{formatDate(admin.createdAt)}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 {(() => {
//                                                     switch (admin.status) {
//                                                         case "rejected":
//                                                             return <h1>This admin is rejected</h1>;
//                                                         case "pending":
//                                                             return <div className="flex items-center gap-2">
//                                                                 <button
//                                                                     onClick={() => handleApprove(admin.id)}
//                                                                     className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
//                                                                 >
//                                                                     <Check className="h-3.5 w-3.5 mr-1" />
//                                                                     Approve
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => handleReject(admin.id)}
//                                                                     className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
//                                                                 >
//                                                                     <X className="h-3.5 w-3.5 mr-1" />
//                                                                     Reject
//                                                                 </button>
//                                                             </div>;
//                                                         case "approved":
//                                                             return <h1>This admin is approved</h1>;
//                                                         default:
//                                                             return <h1>Unknown status</h1>;
//                                                     }
//                                                 })()}
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Footer Summary */}
//                 {admins.length > 0 && (
//                     <div className="mt-6 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
//                         <div className="flex items-center justify-between text-sm">
//                             <div className="flex items-center space-x-6">
//                                 <div>
//                                     <span className="text-gray-600 dark:text-gray-400">Total: </span>
//                                     <span className="font-bold text-gray-900 dark:text-white">{totalCount}</span>
//                                 </div>
//                                 <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
//                                 <div>
//                                     <span className="text-gray-600 dark:text-gray-400">Verified: </span>
//                                     <span className="font-bold text-green-600 dark:text-green-500">{getVerifiedCount()}</span>
//                                 </div>
//                                 <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
//                                 <div>
//                                     <span className="text-gray-600 dark:text-gray-400">Rejected: </span>
//                                     <span className="font-bold text-yellow-600 dark:text-yellow-500">{getPendingCount()}</span>
//                                 </div>
//                             </div>
//                             <div className="text-xs text-gray-500">
//                                 Last updated: {new Date().toLocaleTimeString()}
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  Shield,
  RefreshCw,
  Check,
  X,
  Search,
  Filter,
  Download,
  MoreVertical,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem("authToken"); // or however you store tokens

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    return fetch(`http://localhost:5000${url}`, config);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest("/user/admins", {
        method: "GET",
      });

      // Handle authentication and authorization errors
      if (response.status === 401) {
        setError("Authentication failed. Please login again.");
        return;
      }

      if (response.status === 403) {
        setError("Access denied. Super-Admin privileges required.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("API Response:", data);

      if (data.success) {
        setAdmins(data.admins || []);
        setTotalCount(data.count || 0);
      } else {
        setError(data.message || "Failed to fetch admins");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if (
        err.message?.includes("401") ||
        err.message?.includes("Unauthorized")
      ) {
        setError("Please login again to access this page.");
      } else if (
        err.message?.includes("403") ||
        err.message?.includes("Forbidden")
      ) {
        setError("You do not have Super-Admin privileges to access this page.");
      } else {
        setError(
          "An error occurred while fetching admins. Please check your connection and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter admins based on search and status
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.id?.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && admin.verified) ||
      (statusFilter === "pending" &&
        !admin.verified &&
        admin.status !== "rejected") ||
      (statusFilter === "rejected" && admin.status === "rejected");

    return matchesSearch && matchesStatus;
  });

  const getVerifiedCount = () => admins.filter((a) => a.verified).length;
  const getRejectedCount = () =>
    admins.filter((a) => a.status === "rejected").length;
  const getPendingCount = () =>
    admins.filter((a) => !a.verified && a.status !== "rejected").length;

  const handleApprove = async (adminId) => {
    if (
      !confirm(
        "Are you sure you want to approve this admin? They will receive access to create courses and manage students.",
      )
    ) {
      return;
    }

    try {
      const response = await apiRequest(`/user/admins/${adminId}/approve`, {
        method: "PUT",
      });

      if (response.status === 401) {
        alert("Session expired. Please login again.");
        return;
      }

      if (response.status === 403) {
        alert("Access denied. Super-Admin privileges required.");
        return;
      }

      const data = await response.json();

      if (data.success) {
        alert(
          "✅ Admin approved successfully! An approval email has been sent.",
        );
        fetchAdmins();
      } else {
        alert(`❌ Failed to approve admin: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Approve error:", err);
      if (err.message?.includes("401") || err.message?.includes("403")) {
        alert("Access denied. Please check your permissions.");
      } else {
        alert("❌ An error occurred while approving admin. Please try again.");
      }
    }
  };

  const handleReject = async (adminId) => {
    const rejectionReason = prompt("Please provide a reason for rejection:");

    if (rejectionReason === null) return; // User cancelled

    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to reject this admin?\n\nReason: ${rejectionReason}`,
    );

    if (!confirmed) return;

    try {
      const response = await apiRequest(`/user/admins/${adminId}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rejectionReason }),
      });

      if (response.status === 401) {
        alert("Session expired. Please login again.");
        return;
      }

      if (response.status === 403) {
        alert("Access denied. Super-Admin privileges required.");
        return;
      }

      const data = await response.json();

      if (data.success) {
        alert("Admin rejected successfully!");
        fetchAdmins();
      } else {
        alert(`Failed to reject admin: ${data.message}`);
      }
    } catch (err) {
      console.error("Reject error:", err);
      if (err.message?.includes("401") || err.message?.includes("403")) {
        alert("Access denied. Please check your permissions.");
      } else {
        alert("An error occurred while rejecting admin.");
      }
    }
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Username",
      "Email",
      "Role",
      "Status",
      "Verified",
      "Created At",
    ];
    const csvData = filteredAdmins.map((admin) => [
      admin.id,
      `"${admin.username}"`,
      `"${admin.email}"`,
      admin.role,
      admin.status || "N/A",
      admin.verified ? "Yes" : "No",
      formatDate(admin.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admins-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Enhanced loading component
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"></div>
          <p className="font-medium text-gray-600 dark:text-gray-300">
            Loading admin users...
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Super-Admin access required
          </p>
        </div>
      </div>
    );
  }

  // Enhanced error component
  if (error) {
    const isAuthError =
      error.includes("login") || error.includes("Authentication");
    const isPermissionError =
      error.includes("Access denied") || error.includes("privileges");

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div
            className={`${
              isAuthError
                ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20"
                : isPermissionError
                  ? "border-red-200 bg-red-50 dark:bg-red-900/20"
                  : "border-red-200 bg-red-50 dark:bg-red-900/20"
            } rounded-lg border-2 p-6 text-center dark:border-opacity-50`}
          >
            <XCircle
              className={`h-12 w-12 ${
                isAuthError
                  ? "text-yellow-500"
                  : isPermissionError
                    ? "text-red-500"
                    : "text-red-500"
              } mx-auto mb-3`}
            />
            <h3 className="mb-2 text-lg font-semibold dark:text-white">
              {isAuthError
                ? "Authentication Required"
                : isPermissionError
                  ? "Access Denied"
                  : "Error Loading Admins"}
            </h3>
            <p className="mb-4 dark:text-gray-300">{error}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={fetchAdmins}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </button>
              {isAuthError && (
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="inline-flex items-center rounded-lg bg-yellow-600 px-4 py-2 text-white transition-colors hover:bg-yellow-700"
                >
                  Go to Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
                  <Shield className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-500" />
                  Admin Users Management
                </h1>
                <span className="rounded-full border border-purple-200 bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-400">
                  Super-Admin
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Manage administrator accounts, approvals, and permissions
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-green-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </button>
              <button
                onClick={fetchAdmins}
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Admins
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {totalCount}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Approved
                </p>
                <p className="mt-1 text-3xl font-bold text-green-600 dark:text-green-500">
                  {getVerifiedCount()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="mt-1 text-3xl font-bold text-yellow-600 dark:text-yellow-500">
                  {getPendingCount()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-500/20">
                <RefreshCw className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Rejected
                </p>
                <p className="mt-1 text-3xl font-bold text-red-600 dark:text-red-500">
                  {getRejectedCount()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search admins by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredAdmins.length} of {admins.length} admins
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Admin Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-transparent">
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <User className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
                      <p className="mb-2 text-lg font-medium text-gray-500 dark:text-gray-400">
                        {admins.length === 0
                          ? "No admin users found"
                          : "No matching admins found"}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500">
                        {admins.length === 0
                          ? "Admin accounts will appear here once created"
                          : "Try adjusting your search or filter criteria"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {admin.profileImage ? (
                              <img
                                className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover dark:border-gray-600"
                                src={admin.profileImage}
                                alt={admin.username}
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-300 bg-gradient-to-br from-blue-500 to-blue-700 dark:border-blue-400">
                              <User className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {admin.username}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span className="rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-700">
                                ID: {admin.id}
                              </span>
                              <span className="rounded border border-blue-200 bg-blue-100 px-2 py-0.5 font-medium text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400">
                                {admin.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900 dark:text-gray-300">
                          <Mail className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                          <span
                            className="max-w-[200px] truncate"
                            title={admin.email}
                          >
                            {admin.email}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {(() => {
                          if (admin.status === "rejected") {
                            return (
                              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400">
                                <XCircle className="mr-1.5 h-4 w-4" />
                                Rejected
                              </span>
                            );
                          } else if (admin.verified) {
                            return (
                              <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400">
                                <CheckCircle className="mr-1.5 h-4 w-4" />
                                Approved
                              </span>
                            );
                          } else {
                            return (
                              <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400">
                                <RefreshCw className="mr-1.5 h-4 w-4" />
                                Pending Approval
                              </span>
                            );
                          }
                        })()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span>{formatDate(admin.createdAt)}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-2">
                          {admin.status === "rejected" ? (
                            <span className="text-sm italic text-gray-500 dark:text-gray-400">
                              Rejected
                            </span>
                          ) : admin.verified ? (
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              Approved
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleApprove(admin.id)}
                                className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
                              >
                                <Check className="mr-1 h-3.5 w-3.5" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(admin.id)}
                                className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
                              >
                                <X className="mr-1 h-3.5 w-3.5" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Summary */}
        {admins.length > 0 && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Total:{" "}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {totalCount}
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Approved:{" "}
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-500">
                    {getVerifiedCount()}
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Pending:{" "}
                  </span>
                  <span className="font-bold text-yellow-600 dark:text-yellow-500">
                    {getPendingCount()}
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Rejected:{" "}
                  </span>
                  <span className="font-bold text-red-600 dark:text-red-500">
                    {getRejectedCount()}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
