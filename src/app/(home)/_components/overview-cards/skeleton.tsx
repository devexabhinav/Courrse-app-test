// app/_components/overview-cards/skeleton.tsx
export function OverviewCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="dark:border-strokedark dark:bg-boxdark animate-pulse rounded-sm border border-stroke bg-white p-4 shadow-default"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-6 w-12 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-3 w-10 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
