// app/_components/overview-cards/card.tsx
import { ReactElement } from "react";

interface OverviewCardProps {
  label: string;
  data: {
    value: string;
    growthRate: number;
  };
  Icon: (props: { className?: string }) => ReactElement;
}

export function OverviewCard({ label, data, Icon }: OverviewCardProps) {
  const isPositive = data.growthRate >= 0;

  return (
    <div className="dark:border-strokedark dark:bg-boxdark rounded-sm border border-stroke bg-white p-6 shadow-default">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-black dark:text-white">
            {label}
          </span>
          <h4 className="mt-2 text-2xl font-bold text-black dark:text-white">
            {data.value}
          </h4>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary bg-opacity-10 dark:bg-opacity-20">
          <Icon className="text-primary" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <svg
              className="fill-current"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              />
            </svg>
          ) : (
            <svg
              className="fill-current"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848689L5.64284 0.0848689L5.64284 7.69237Z"
                fill=""
              />
            </svg>
          )}
          {Math.abs(data.growthRate)}%
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Since last month
        </span>
      </div>
    </div>
  );
}
