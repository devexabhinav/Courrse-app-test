import { Users } from "@/components/Tables/users";
import { TopChannelsSkeleton } from "@/components/Tables/users/skeleton";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import api from "@/lib/api";
import { Suspense } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ChartPageClient from "../users/ChartPageClient";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";

// Define the expected type for searchParams
interface SearchParams {
  selected_time_frame?: string;
}

// Update the HomePage function to handle searchParams as a Promise
export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  // Await the searchParams to resolve the Promise
  const resolvedSearchParams = await searchParams;
  const { selected_time_frame } = resolvedSearchParams;

  const res = await api.get("user");
  const users = res?.data?.data?.users;
  const timeFrameKey = createTimeFrameExtractor(selected_time_frame)("used_devices") ?? "used_devices:monthly";

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup users={users} />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12">
          <Breadcrumb pageName="Basic Chart" />
          <ChartPageClient timeFrameKey={timeFrameKey} />
        </div>
      </div>
    </>
  );
}