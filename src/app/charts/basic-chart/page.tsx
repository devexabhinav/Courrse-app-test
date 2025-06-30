import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import ChartPageClient from "./ChartPageClient"; 

export const metadata: Metadata = {
  title: "Basic Chart",
};

export default function Page({ searchParams }: { searchParams: { selected_time_frame?: string } }) {
  const extractTimeFrame = createTimeFrameExtractor(searchParams.selected_time_frame);
const timeFrameKey = extractTimeFrame("used_devices") ?? "used_devices:monthly";

  return (
    <>
      <Breadcrumb pageName="Basic Chart" />
      <ChartPageClient timeFrameKey={timeFrameKey} />
    </>
  );
}
