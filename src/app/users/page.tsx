import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import ChartPageClient from "./ChartPageClient";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  verified: boolean;
  createdAt: string;
}

interface UsersProps {
  className?: string;
  users: User[];
  // loading: boolean;
}

// Define the expected type for searchParams
interface SearchParams {
  selected_time_frame?: string;
}

// Export as default and handle searchParams as a Promise
export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  // Await the searchParams to resolve the Promise
  const resolvedSearchParams = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(resolvedSearchParams.selected_time_frame);
  const timeFrameKey = extractTimeFrame("used_devices") ?? "used_devices:monthly";

  return (
    <>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12">
          {/* <Users users={users} /> */}
          <Breadcrumb pageName="Basic Chart" />
          <ChartPageClient timeFrameKey={timeFrameKey} />
        </div>
      </div>
    </>
  );
}