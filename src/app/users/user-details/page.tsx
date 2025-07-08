"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function UsersWithProgressPage({ className }: any) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get("user/get-all-details"); // adjust if full URL needed
        setUsers(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

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

      {/* {loading ? (
          <p className="text-center">Loading...</p>
        ) : ( */}
      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="!text-left">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Enrolled Courses</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users && users.length > 0 ? (
            users.map((user: any) => (
              <TableRow
                className="text-center text-base font-medium text-dark dark:text-white"
                key={user.id}
              >
                <TableCell className="!text-left">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role || "User"}</TableCell>
                <TableCell>
                  <span className={user.verified ? "text-green-600" : "text-red-500"}>
                    {user.verified ? "Verified" : "Unverified"}
                  </span>
                </TableCell>
              

                {/* Enrolled Courses */}
                <TableCell>
                  {user.enrolledCourses?.length > 0 ? (
                    <ul className="text-left space-y-1">
                      {user.enrolledCourses.map((course: any) => (
                        <li key={course.course_id} className="flex items-center gap-1">
                          <img
                            src={course.image}
                            alt={course.title}
                            width={30}
                            height={30}
                            className="rounded"
                          />
                          <span>{course.title}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="italic text-gray-500">Not Enrolled</span>
                  )}
                </TableCell>

                {/* Progress */}
                <TableCell>
                  {user.enrolledCourses?.length > 0 ? (
                    <ul className="text-left space-y-1">
                      {user.enrolledCourses.map((course: any) => (
                        <li key={course.course_id}>
                          {course.completion_percentage}% complete
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell>View More Details</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* )} */}
    </div>
  );
}
