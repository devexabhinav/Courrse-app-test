// app/_components/home-content.tsx
"use client";

import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { useApiClient } from "@/lib/api";
import { useEffect, useState } from "react";
import { OverviewCardsGroup } from "./overview-cards";
import ChartPageClient from "@/app/users/ChartPageClient";
import { OverviewCardsSkeleton } from "./overview-cards/skeleton";

interface HomeContentProps {
  initialTimeFrame?: string;
}

export default function HomeContent({ initialTimeFrame }: HomeContentProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This should now be stable and not change on every render
  const api = useApiClient();

  const timeFrameKey =
    createTimeFrameExtractor(initialTimeFrame)("used_devices") ??
    "used_devices:monthly";

  // Fetch users only once on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("📡 Fetching users...");

        const res = await api.get("user");

        if (!isMounted) return;

        if (res.success) {
          setUsers(res?.data?.data?.users || []);
          console.log("✅ Users fetched successfully");
        } else {
          setError(res.error?.message || "Failed to fetch users");
          console.error("❌ API error:", res.error);
        }
      } catch (err) {
        if (!isMounted) return;
        setError("Network error occurred");
        console.error("❌ Fetch error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [api]); // api should now be stable

  if (loading) {
    return (
      <>
        <OverviewCardsSkeleton />
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
          <div className="col-span-12">
            <Breadcrumb pageName="Chart" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 rounded bg-blue-500 px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <OverviewCardsGroup users={users} />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12">
          <Breadcrumb pageName="Chart" />
          <ChartPageClient timeFrameKey={timeFrameKey} />
        </div>
      </div>
    </>
  );
}
