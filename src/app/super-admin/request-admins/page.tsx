'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, User, Mail, Calendar, Shield, RefreshCw, Check, X } from 'lucide-react';
import { rejects } from 'assert';
import api from '@/lib/api';


export default function AdminUsersPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchAdmins();
    }, []);

   

    const fetchAdmins = async () => {
    try {
        setLoading(true);
        setError(null);

        // Axios automatically sends cookies because of withCredentials: true
        const response = await api.get('user/admins');

        console.log('API Response:', response.data);

        if (response.data.success && response.data.data) {
            setAdmins(response.data.data.admins || []);
            setTotalCount(response.data.count || 0);
        } else {
            setError(response.data.message || 'Failed to fetch admins');
        }
    } catch (err: any) {
        if (err.response?.status === 401) {
            setError('Session expired. Please login again.');
            // Optionally redirect to login
            setTimeout(() => {
                window.location.href = '/auth/login';
            }, 2000);
        } else if (err.response?.status === 403) {
            setError('Access denied. Super Admin privileges required.');
        } else {
            setError('An error occurred while fetching admins');
        }
        console.error('Fetch error:', err);
    } finally {
        setLoading(false);
    }
};



    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getVerifiedCount = () => admins.filter(a => a.verified).length;
    const getPendingCount = () => admins.filter(a => a.status == "rejected").length;



//   const handleApprove = async (adminId) => {
//         if (!confirm('Are you sure you want to approve this admin? They will receive access to create courses and manage students.')) {
//             return;
//         }

//         try {
//             const token = localStorage.getItem('accessToken');
//             const response = await fetch(`http://localhost:5000/user/admins/${adminId}/approve`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             const data = await response.json();

//             if (data.success) {
//                 alert('✅ Admin approved successfully! An approval email has been sent.');
//                 // Refresh the admin list
//                 fetchAdmins();
//             } else {
//                 alert(`❌ Failed to approve admin: ${data.message || 'Unknown error'}`);
//             }
//         } catch (err) {
//             console.error('Approve error:', err);
//             alert('❌ An error occurred while approving admin. Please try again.');
//         }
//     };

const handleApprove = async (adminId: string) => {
    if (!confirm('Are you sure you want to approve this admin? They will receive access to create courses and manage students.')) {
        return;
    }

    try {
        // API utility automatically sends cookies - no need to pass token manually
        const response = await api.put(`user/admins/${adminId}/approve`);

        if (response.success) {
            alert('✅ Admin approved successfully! An approval email has been sent.');
            // Refresh the admin list
            fetchAdmins();
        } else {
            alert(`❌ Failed to approve admin: ${response.error?.message || 'Unknown error'}`);
        }
    } catch (err) {
        console.error('Approve error:', err);
        alert('❌ An error occurred while approving admin. Please try again.');
    }
};


    // const handleReject = async (adminId) => {
    //     const confirmed = confirm('Are you sure you want to reject this admin?');

    //     if (!confirmed) return;

    //     try {
    //         const token = localStorage.getItem('accessToken');
    //         const response = await fetch(`http://localhost:5000/user/admins/${adminId}/reject`, {
    //             method: 'PATCH',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         const data = await response.json();

    //         if (data.success) {
    //             alert('Admin rejected successfully!');
    //             fetchAdmins();
    //         } else {
    //             alert(`Failed to reject admin: ${data.message}`);
    //         }
    //     } catch (err) {
    //         console.error('Reject error:', err);
    //         alert('An error occurred while rejecting admin.');
    //     }
    // };



// const handleReject = async (adminId: string) => {
//     if (!confirm('Are you sure you want to reject this admin application?')) {
//         return;
//     }

//     try {
//         // API utility automatically sends cookies with the request
//         // No body needed - reason is optional
//         const response = await api.patch(`user/admins/${adminId}/reject`);

//         console.log('Reject Response:', response);

//         if (response.success && response.data) {
//             // Backend returns: { success: true, message: "...", data: { admin: {...}, emailSent: true/false } }
//             const { emailSent } = response.data.data || {};
            
//             // Show the message from backend
//             alert(response.data.message || `✅ Admin rejected successfully! ${emailSent ? 'A rejection email has been sent.' : 'However, the email could not be sent.'}`);
            
//             // Refresh the admin list
//             fetchAdmins();
//         }
//     } catch (err: any) {
//         console.error('Reject error:', err);
//         console.error('Error response:', err.response);
        
//         if (err.response?.status === 400) {
//             alert('❌ Invalid request. Admin ID is required.');
//         } else if (err.response?.status === 404) {
//             alert('❌ Admin user not found.');
//         } else if (err.response?.status === 403) {
//             alert('❌ Access denied. Super Admin privileges required.');
//         } else if (err.response?.status === 401) {
//             alert('❌ Session expired. Please login again.');
//             window.location.href = '/auth/login';
//         } else if (err.response?.status === 500) {
//             alert(`❌ Server error: ${err.response?.data?.message || 'Internal server error'}`);
//         } else {
//             alert('❌ An error occurred while rejecting admin. Please try again.');
//         }
//     }
// };
const handleReject = async (adminId: string) => {
    if (!confirm('Are you sure you want to reject this admin application?')) {
        return;
    }

    try {
        // Get token from localStorage or cookies
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // API utility automatically sends cookies with the request
        const response = await api.patch(`user/admins/${adminId}/reject`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Reject Response:', response);

        // Check if the request was successful
        if (response.success) {
            // Backend returns: { success: true, message: "...", data: { admin: {...}, emailSent: true/false } }
            const emailSent = response.data?.emailSent ?? false;
            
            // Show the message from backend (it already contains email status info)
            alert(response.message || '✅ Admin rejected successfully!');
            
            // Refresh the admin list
            fetchAdmins();
        } else {
            // Handle unexpected unsuccessful response
            alert(response.message || '❌ Failed to reject admin.');
        }
    } catch (err: any) {
        console.error('Reject error:', err);
        console.error('Error response:', err.response);
        
        // Handle different HTTP error status codes
        const status = err.response?.status;
        const errorMessage = err.response?.data?.message;
        
        switch (status) {
            case 400:
                alert(errorMessage || '❌ Invalid request. Admin ID is required.');
                break;
            case 401:
                alert('❌ Session expired. Please login again.');
                window.location.href = '/auth/login';
                break;
            case 403:
                alert('❌ Access denied. Super Admin privileges required.');
                break;
            case 404:
                alert('❌ Admin user not found.');
                break;
            case 500:
                alert(`❌ Server error: ${errorMessage || 'Internal server error'}`);
                break;
            default:
                alert(errorMessage || '❌ An error occurred while rejecting admin. Please try again.');
        }
    }
};      












    if (loading) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="dark:text-gray-300 text-gray-600 font-medium">Loading admin users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="max-w-md w-full">
                    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/50 rounded-lg p-6 text-center">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Admins</h3>
                        <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
                        <button
                            onClick={fetchAdmins}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                            <Shield className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-500" />
                            Admin Users Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage all administrator accounts</p>
                    </div>
                    <button
                        onClick={fetchAdmins}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Admins</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalCount}</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Verified</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-500 mt-1">{getVerifiedCount()}</p>
                            </div>
                            <div className="h-12 w-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Rejected Approval</p>
                                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-500 mt-1">{getPendingCount()}</p>
                            </div>
                            <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-500/20 rounded-full flex items-center justify-center">
                                <XCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Admin Details
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Email Address
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Verification Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Account Created
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
                                {admins.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <User className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">No admin users found</p>
                                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Admin accounts will appear here once created</p>
                                        </td>
                                    </tr>
                                ) : (
                                    admins.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        {admin.profileImage ? (
                                                            <img
                                                                className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                                                                src={admin.profileImage}
                                                                alt={admin.username}
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center border-2 border-blue-300 dark:border-blue-400">
                                                                <User className="h-6 w-6 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                            {admin.username}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1 gap-2">
                                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">ID: {admin.id}</span>
                                                            <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-medium border border-blue-200 dark:border-blue-500/30">
                                                                {admin.role}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900 dark:text-gray-300">
                                                    <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                                                    <span className="truncate">{admin.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                              


                                                   {(() => {
                                                    switch (admin.status) {
                                                        case "rejected":
                                                            return  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30">
                                                        <XCircle className="h-4 w-4 mr-1.5" />
                                                        Approval Rejected  
                                                    </span>;
                                                        case "pending":
                                                            return <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30">
                                                        <XCircle className="h-4 w-4 mr-1.5" />
                                                        Waiting for Approval
                                                    </span>;
                                                        case "approved":
                                                            return  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-500/30">
                                                        <CheckCircle className="h-4 w-4 mr-1.5" />
                                                         Approvaled
                                                    </span>;
                                                        default:
                                                            return  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-500/30">
                                                        
                                                        Admin
                                                    </span>;
                                                    }
                                                })()}




                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                                                    <span>{formatDate(admin.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">



                                                {(() => {
                                                    switch (admin.status) {
                                                        case "rejected":
                                                            return <h1>This admin is rejected</h1>;
                                                        case "pending":
                                                            return <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleApprove(admin.id)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                                                        >
                                                            <Check className="h-3.5 w-3.5 mr-1" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(admin.id)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                                                        >
                                                            <X className="h-3.5 w-3.5 mr-1" />
                                                            Reject
                                                        </button>
                                                    </div>;
                                                        case "approved":
                                                            return <h1>This admin is approved</h1>;
                                                        default:
                                                            return <h1>Unknown status</h1>;
                                                    }
                                                })()}

                                           
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
                    <div className="mt-6 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-6">
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Total: </span>
                                    <span className="font-bold text-gray-900 dark:text-white">{totalCount}</span>
                                </div>
                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Verified: </span>
                                    <span className="font-bold text-green-600 dark:text-green-500">{getVerifiedCount()}</span>
                                </div>
                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                <div>
                                    <span className="text-gray-600 dark:text-gray-400">Rejected: </span>
                                    <span className="font-bold text-yellow-600 dark:text-yellow-500">{getPendingCount()}</span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                Last updated: {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}