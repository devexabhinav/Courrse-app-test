// app/_components/home-content-skeleton.tsx
import { OverviewCardsSkeleton } from "./overview-cards/skeleton";

export default function HomeContentSkeleton() {
  return (
    <div className="animate-pulse">
      <OverviewCardsSkeleton />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12">
          {/* Breadcrumb Skeleton */}
          <div className="mb-4 h-4 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>

          {/* Chart Skeleton */}
          <div className="dark:border-strokedark dark:bg-boxdark rounded-sm border border-stroke bg-white p-6 shadow-default">
            <div className="h-80 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
