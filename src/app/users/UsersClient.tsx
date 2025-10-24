"use client";

import { useEffect, useState } from "react";
import { Users } from "@/components/Tables/users";
import { useApiClient } from "@/lib/api";

const UsersClient = () => {
  const [users, setUsers] = useState<any>([]);
  const [error, setError] = useState("");
  const api = useApiClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("user");
        setUsers(res.data?.data || []);
      } catch (err: any) {
        setError(
          "Failed to load users: " + (err.response?.status || err.message),
        );
      }
    };

    fetchUsers();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12">
          <Users users={users?.users} />
        </div>
      </div>
    </>
  );
};

export default UsersClient;
