"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchUsers, setPage } from "../../../store/slices/adminslice/all-user-details";
import {  activateUser , deactivateUser} from "../../../store/slices/adminslice/userManagement";
import { UserX } from "lucide-react";

export default function UsersWithProgressPage({ className }: any) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get state from Redux store
  const { users, totalPages, currentPage, loading, error } = useAppSelector(
    (state) => state.users
  );
  
  const limit = 5;
  const [deactivatingUserId, setDeactivatingUserId] = useState<string | null>(null);
const [processingUserId, setProcessingUserId] = useState<string | null>(null);



  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setPage(currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setPage(currentPage + 1));
    }
  };

const handleDeactivateUser = async (e: React.MouseEvent, userId: string) => {
  e.stopPropagation();
  
  if (window.confirm("Are you sure you want to deactivate this user?")) {
    setDeactivatingUserId(userId);
    try {
      // Use the correct endpoint - change from 'user/deactivate' to 'users/deactivate'
      const result = await dispatch(deactivateUser({ userId }));
      
      if (deactivateUser.fulfilled.match(result)) {
        dispatch(fetchUsers({ page: currentPage, limit }));
        console.log("User deactivated successfully:", userId);
      }
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    } finally {
      setDeactivatingUserId(null);
    }
  }
};

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        All Users List
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="w-16">S.No</TableHead>
            <TableHead className="!text-left">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Loading...
              </TableCell>
            </TableRow>
          ) : users && users.length > 0 ? (
            users.map((user: any, index: number) => (
              <TableRow
                className="text-center text-base font-medium text-dark dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                key={user.id}
                onClick={() => router.push(`/super-admin/all-user/view-details?id=${user.id}`)}
              >
                <TableCell className="text-center">
                  {(currentPage - 1) * limit + index + 1}
                </TableCell>
                <TableCell className="!text-left">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={user.verifyUser ? "text-green-600" : "text-red-500"}>
                    {user.verifyUser ? "Verified" : "Unverified"}
                  </span>
                </TableCell>
                <TableCell>
                  <button
  onClick={(e) => handleDeactivateUser(e, user.id)}
  disabled={deactivatingUserId === user.id}
  className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  title="Deactivate User"
>
  <UserX className="w-4 h-4" />
  {deactivatingUserId === user.id ? "Deactivating..." : "Deactivate"}
</button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="mt-4 flex justify-end items-center gap-3">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || loading}
          className="cursor-pointer px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Previous
        </button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages || loading}
          className="cursor-pointer px-4 py-2 border rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}